import Tesseract from 'tesseract.js';

const runOCR = async (image, lang = 'eng') => {
  const { data: { text } } = await Tesseract.recognize(image, lang, {
    tessedit_pageseg_mode: 6, 
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,-./ '
  });
  return text;
};
export default runOCR