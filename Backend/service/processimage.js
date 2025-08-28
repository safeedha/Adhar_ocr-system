  import sharp from 'sharp';
  
  const preprocessImage = async (inputPath, outputPath) => {
      await sharp(inputPath)
        .grayscale()     
        .threshold(150)    
        .normalize()      
        .toFile(outputPath);
    };
  export default preprocessImage