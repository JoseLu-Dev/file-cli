import { Service } from "typedi"

import { FileWrapper } from "../../../../common/business/fileWrapper"

@Service()
export class GroupByFileDateCreatedUseCase {

    constructor() { }

    group(files: Array<FileWrapper>, format: string = 'dd-mm-yyyy'): void {
        files.forEach(file => {
            this._moveFileToItsFolder(file)
        })
    }

    private _moveFileToItsFolder(file: FileWrapper): void {

        const folder = this._getFolderFromFileDate(file)

        file.pathNew = `${file.pathNew}\\${folder}`
    }

    private _getFolderFromFileDate(file: FileWrapper): string {

        if(!file.stats) return 'no-date'

        const modifiedTime: Date = file.stats.mtime
        return `${modifiedTime.getFullYear()}-${modifiedTime.getMonth() + 1}-${modifiedTime.getDate()}`
    }

}