import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class FakeStorageProvider implements IStorageProvider {
  private files: string[] = []

  public async saveFile(file: string): Promise<string> {
    this.files.push(file)
    return file
  }

  public async deleteFile(file: string): Promise<void> {
    const fileIndex = this.files.findIndex(storageFile => storageFile === file)

    if (fileIndex) {
      this.files.splice(fileIndex, 1)
    }

    return
  }
}

export default FakeStorageProvider
