
import fs from 'fs';
import calculateAge from '../service/calculateage.js'
import preprocessImage from '../service/processimage.js'
import runOCR from '../service/ocrconvert.js'
import getAddress from '../service/getaddress.js'
import  getPin from '../service/getPinnumber.js'


export const processOCR = async (req, res) => {
  try {
    let response={}
    const frontImage = req.files.front[0].path;
    const backImage = req.files.back[0].path;
    const processedFront = `processed_front_${Date.now()}.png`;
    const processedBack = `processed_back_${Date.now()}.png`;
     await preprocessImage(frontImage, processedFront);
    await preprocessImage(backImage, processedBack);
    const frontText=await runOCR(processedFront)
    const backText=await runOCR(processedBack)
  
  
    fs.unlinkSync(frontImage);
    fs.unlinkSync(backImage);
    fs.unlinkSync(processedFront);
    fs.unlinkSync(processedBack);
     if(!frontText.includes("Government of India"))
     {  
        response.status=false
        response.message="Invalid Aadhaar card. Please upload a valid Aadhaar front image."
        res.json({message:response})
        return
     }
      if(!backText.includes("Address"))
     {  
        response.status=false
        response.message="Invalid Aadhaar card. Please upload a valid Aadhaar back image."
        res.json({message:response})
        return
     }

    let data={}

    const lines =frontText.split("\n").map(l => l.trim()).filter(Boolean);
     console.log(lines)
    data.Name=lines[2]

  const dobLine = lines.find(l => l.toLowerCase().includes("dob"));

if (dobLine) {
  data.dob = dobLine.split(":").pop().trim(); 
}
 let dob = data.dob.match(/\d{2}\/\d{2}\/\d{4}/)[0];
  data.dob=dob
  const age=calculateAge(data.dob)
  data.age=age

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

   const backline = backText.split("\n").map(l => l.trim()).filter(Boolean);
   data.address=getAddress(backline) 


data.pincode=getPin(backline)
response.status=true
response.data=data
response.message="Adhar parsed sucessfully"

    res.json({message:response});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OCR failed' });
  }
};
