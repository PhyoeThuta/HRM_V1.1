import xlsx from 'xlsx';
import fs from 'fs';

const files = [
  '_N-Customers-Data-2026-1.xlsx',
  'Book1-5-1.xlsx',
  'Costing.xlsx'
];

files.forEach(file => {
  console.log(`\n=================== FILE: ${file} ===================`);
  try {
    const workbook = xlsx.readFile(file);
    const sheetNames = workbook.SheetNames;
    console.log(`Sheets: ${sheetNames.join(', ')}`);
    
    sheetNames.forEach(sheetName => {
      console.log(`\n--- Sheet: ${sheetName} ---`);
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Print first 10 rows to understand the structure
      const sample = data.slice(0, 10);
      console.log(JSON.stringify(sample, null, 2));
    });
  } catch (err) {
    console.error(`Failed to read ${file}:`, err.message);
  }
});
