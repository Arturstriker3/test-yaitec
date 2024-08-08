import multer from 'multer';
import path from 'path';

// Mantém o nome original do arquivo e a extensão

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage });

export default upload;