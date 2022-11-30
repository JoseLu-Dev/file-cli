import { Service } from "typedi"

import { GroupOptions } from "./groupOptions"
import { GetFilesWithStatsUseCase } from "../../../common/business/useCases/getFilesWithStatsUseCase"
import { GroupByFileExtensionUseCase } from "./useCases/groupByFileExtensionUseCase"
import { WriteComputedFilesUseCase } from "../../../common/business/useCases/writeComputedFilesUseCase"
import { GroupByFileDateCreatedUseCase } from "./useCases/groupByFileDateCreatedUseCase"
import { FileWrapper } from "../../../common/business/fileWrapper"
import { FileWrapperFilter } from "../../../common/business/filters/fileWrapperFilter"
import { CommandComplete } from "../../../common/business/command/commandComplete"
import { CommandOptions } from "../../../common/business/command/commandOptions"

@Service()
export class GroupFiles extends CommandComplete {

    readonly options = {
        extension: this._groupByFileExtensionUseCase,
        dateCreated: this._groupByFileDateCreatedUseCase,
    }

    constructor(
        _getFilesMetadataUseCase: GetFilesWithStatsUseCase,
        _writeComputedFilesUseCase: WriteComputedFilesUseCase,
        private readonly _fileWrapperFilter: FileWrapperFilter,
        private readonly _groupByFileExtensionUseCase: GroupByFileExtensionUseCase,
        private readonly _groupByFileDateCreatedUseCase: GroupByFileDateCreatedUseCase,
    ) {
        super(
            _getFilesMetadataUseCase,
            _writeComputedFilesUseCase
        )
    }

    protected _process(files: FileWrapper[], options: CommandOptions): Promise<FileWrapper[]> {

        if(!options.specificOptions) throw new Error('No group options provided')

        files = this._fileWrapperFilter.removeDirs(files)

        this._groupForEachOption(options.specificOptions, files)

        return Promise.resolve(files)
    }

    private _groupForEachOption(options: GroupOptions, files: Array<FileWrapper>) {

        type OptionsKey = keyof typeof this.options

        for (const [option, value] of Object.entries(options)) {
            this.options[option as OptionsKey].group(files, value)
        }
    }
}