import express from 'express';
import multer from 'multer';
import { processOCR } from '../controllers/ocrController.js'; // include .js extension

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.fields([{ name: 'front' }, { name: 'back' }]), processOCR);

export default router;
