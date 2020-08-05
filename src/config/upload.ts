import multer, { StorageEngine } from 'multer'
import path from 'path'
import crypto from 'crypto'

interface IUploadConfig {
  driver: 's3' | 'disk'

  tempFolder: string
  uploadsFolder: string

  multer: { storage: StorageEngine }

  config: {
    disk: {
      dummy: string
    }
    aws: {
      bucket: string
    }
  }
}

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp')
const uploadsFolder = path.resolve(tempFolder, 'uploads')

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tempFolder,
  uploadsFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,
      filename(_req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex')
        const fileName = `${fileHash}-${file.originalname}`

        return callback(null, fileName)
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber',
    },
  },
} as IUploadConfig
