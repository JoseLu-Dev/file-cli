import { CommandOptions } from "./commandOptions";
import { GetFilesWithStatsUseCase } from "../useCases/getFilesWithStatsUseCase";
import { WriteComputedFilesUseCase } from "../useCases/writeComputedFilesUseCase";
import { FileWrapper } from "../fileWrapper";

export abstract class Command {

    constructor(
        private readonly _getFilesMetadataUseCase: GetFilesWithStatsUseCase,
        private readonly _writeComputedFilesUseCase: WriteComputedFilesUseCase,
    ) { }

    abstract execute(options: CommandOptions): Promise<void>

    protected abstract _process(files: Array<FileWrapper>, options: CommandOptions): Promise<Array<FileWrapper>> //processed

    protected async _read(options: CommandOptions): Promise<Array<FileWrapper>> {
        return this._getFilesMetadataUseCase.list(options.path, options.findOptions?.recursive, options.findOptions?.regex)
    }

    protected async _write(files: Array<FileWrapper>): Promise<void> {
        //await this._writeComputedFilesUseCase.write(files)
    }
}