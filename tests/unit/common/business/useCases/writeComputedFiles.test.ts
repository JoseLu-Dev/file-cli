import { WriteComputedFilesUseCase } from '../../../../../src/common/business/useCases/writeComputedFilesUseCase';
import { FileWrapper } from '../../../../../src/common/business/fileWrapper';


const createDirMock = jest.fn()
const createFileMock = jest.fn()
const moveFileMock = jest.fn()
const writeComputedFiles = new WriteComputedFilesUseCase(
    { create: createDirMock },
    { create: createFileMock },
    { move: moveFileMock },
)

describe('write', () => {

    it('calls moves files', async () => {
        const files: FileWrapper[] = [
            {
                pathCurrentComplete: () => 'current1',
                pathNewComplete: () => 'new1',
                stats: {
                    isFile: () => true
                }
            },
            {
                pathCurrentComplete: () => 'current2',
                pathNewComplete: () => 'new2',
                isNew: false,
                stats: {
                    isFile: () => true
                }
            }
        ] as FileWrapper[]

        await writeComputedFiles.write(files)

        expect(moveFileMock).toBeCalledTimes(2)

        expect(moveFileMock).toHaveBeenCalledWith('current1', 'new1')
        expect(moveFileMock).toHaveBeenCalledWith('current2', 'new2')
    })

    it('calls create files', async () => {
        const files: FileWrapper[] = [
            {
                pathNewComplete: () => 'new1',
                isNew: true,
                stats: {
                    isFile: () => true
                }
            }
        ] as FileWrapper[]

        await writeComputedFiles.write(files)

        expect(createFileMock).toBeCalledTimes(1)

        expect(createFileMock).toHaveBeenCalledWith('new1')
    })

    it('calls create directory', async () => {
        const files: FileWrapper[] = [
            {
                pathNewComplete: () => 'new1',
                isNew: true,
                stats: {
                    isDirectory: () => true,
                    isFile: () => false,
                }
            }
        ] as FileWrapper[]

        await writeComputedFiles.write(files)

        expect(createDirMock).toBeCalledTimes(1)

        expect(createDirMock).toHaveBeenCalledWith('new1')
    })

})