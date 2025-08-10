import fs from 'fs';
import pdfParse from 'pdf-parse';

(async () => {
  try {
    const fileBuffer = fs.readFileSync('file:///C:/Users/rahul/Downloads/Rahul_Jha_CV_latest%20(1).pdf'); // Replace with a valid PDF file path
    const pdfData = await pdfParse(fileBuffer);
    console.log('Extracted Text:', pdfData.text);
  } catch (error) {
    console.error('Error while parsing PDF:', error);
  }
})();

const hello = 10;

export default hello;