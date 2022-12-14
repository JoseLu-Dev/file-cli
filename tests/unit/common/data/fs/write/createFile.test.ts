const ensureFileMock = jest.fn()
jest.mock('fs-extra', () => ({
    ensureFile: ensureFileMock
}))

import { CreateFile } from '../../../../../../src/common/data/fs/write/createFile';
const createFile: CreateFile = new CreateFile()

describe('create', () => {
    
    it('calls ensureFile method with given dir path', async () => {
        
        await createFile.create('C:\\temp\\image.jpg')

        expect(ensureFileMock).toHaveBeenCalledWith('C:\\temp\\image.jpg')
    })

})
