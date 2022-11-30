import { Service } from "typedi"

import { GroupOptions } from "./groupOptions"
import { GetFilesWithStatsUseCase } from "../../../common/business/useCases/getFilesWithStatsUseCase"
import { GroupByFileExtensionUseCase } from "./useCases/groupByFileExtensionUseCase"
import { WriteComputedFilesUseCase } from "../../../common/business/useCases/writeComputedFilesUseCase"
import { GroupByFileDateCreatedUseCase } from "./useCases/groupByFileDateCreatedUseCase"
import { FileWrapper } from "../../../common/business/fileWrapper"
import { FileWrapperFilter } from "../../../common/business/filters/fileWrapperFilter"

@Service()
export class GroupFiles {

    readonly options = {
        extension: this._groupByFileExtensionUseCase,
        dateCreated: this._groupByFileDateCreatedUseCase,
    }

    constructor(
        private readonly _getFilesMetadataUseCase: GetFilesWithStatsUseCase,
        private readonly _groupByFileExtensionUseCase: GroupByFileExtensionUseCase,
        private readonly _groupByFileDateCreatedUseCase: GroupByFileDateCreatedUseCase,
        private readonly _writeComputedFilesUseCase: WriteComputedFilesUseCase,
        private readonly _fileWrapperFilter: FileWrapperFilter,
    ) { }

    async performGroup(path: string, options: GroupOptions) {

        let files: Array<FileWrapper> = await this._getFilesMetadataUseCase.list(path)

        files = this._fileWrapperFilter.removeDirs(files)

        this._groupForEachOption(options, files)

        this._writeComputedFilesUseCase.write(files)
    }

    private _groupForEachOption(options: GroupOptions, files: Array<FileWrapper>){

        type ObjectKey = keyof typeof this.options

        for (const option in options) {
            this.options[option as ObjectKey].group(files)
        }
    }
}