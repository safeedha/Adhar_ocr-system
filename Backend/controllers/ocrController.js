import Tesseract from 'tesseract.js';
import fs from 'fs';

export const processOCR = async (req, res) => {
  try {
    const frontImage = req.files.front[0].path;
    const backImage = req.files.back[0].path;

   
    const frontText = await Tesseract.recognize(frontImage, 'eng');

    const backText = await Tesseract.recognize(backImage, 'eng');

   
    fs.unlinkSync(frontImage);
    fs.unlinkSync(backImage);

    res.json({
      frontText: frontText.data.text,
      backText: backText.data.text
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OCR failed' });
  }
};
