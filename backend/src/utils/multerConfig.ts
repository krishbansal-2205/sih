import multer from 'multer';

// Use memory storage so files are not saved to disk
export const upload = multer({ storage: multer.memoryStorage() });