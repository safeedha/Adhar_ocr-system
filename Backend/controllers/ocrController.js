import Tesseract from 'tesseract.js';
import fs from 'fs';

export const processOCR = async (req, res) => {
  try {
    const frontImage = req.files.front[0].path;
    const backImage = req.files.back[0].path;

   
    const frontText = await Tesseract.recognize(frontImage, 'eng');
    let data={}
    const backText = await Tesseract.recognize(backImage, 'eng');
     console.log(frontText.data.text,backText.data.text)   
    fs.unlinkSync(frontImage);
    fs.unlinkSync(backImage);
    const lines =frontText.data.text.split("\n").map(l => l.trim()).filter(Boolean);
    data.Name=lines[2]

const dobLine = lines.find(l => l.toLowerCase().includes("dob"));
if (dobLine) {
  data.dob = dobLine.split(":").pop().trim(); 
}

const genderLine = lines.find(l => 
  l.toLowerCase().includes("male") || l.toLowerCase().includes("female")
);
if (genderLine) {
  if (genderLine.toLowerCase().includes("female")) {
    data.gender = "Female";
  } else if (genderLine.toLowerCase().includes("male")) {
    data.gender = "Male";
  }
}

const aadhaarLine = lines.find(l => /\d{4}\s\d{4}\s\d{4}/.test(l));
if (aadhaarLine) {
  data.aadhaarNumber = aadhaarLine.match(/\d{4}\s\d{4}\s\d{4}/)[0];
}

   const backline = backText.data.text.split("\n").map(l => l.trim()).filter(Boolean);
console.log(backline);


let start = backline.findIndex(l => l.toLowerCase().includes("address"));
if (start === -1) start = 0; 

let end = backline.findIndex(l => /\d{4}\s?\d{4}\s?\d{4}/.test(l)); 

if (end === -1) end = backline.length; 

data.address = backline.slice(start, end).join(" ");
let response={
  stattus:true,
  data:data,
  message:"Adhar parsed sucessfully"
}
;
    res.json({message:response});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OCR failed' });
  }
};
