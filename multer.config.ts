import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/cars', // Локальное хранилище фото
    filename: (req, file, cb) => {
      const fileExtName = path.extname(file.originalname);
      const randomName = uuidv4();
      cb(null, `${randomName}${fileExtName}`);
    },
  }),
};
export const multerConfigParts = {
  storage: diskStorage({
    destination: './uploads/parts', // Локальное хранилище фото
    filename: (req, file, cb) => {
      const fileExtName = path.extname(file.originalname);
      const randomName = uuidv4();
      cb(null, `${randomName}${fileExtName}`);
    },
  }),
};
export const multerConfigServices = {
  storage: diskStorage({
    destination: './uploads/car-services', // Локальное хранилище фото
    filename: (req, file, cb) => {
      const fileExtName = path.extname(file.originalname);
      const randomName = uuidv4();
      cb(null, `${randomName}${fileExtName}`);
    },
  }),
};