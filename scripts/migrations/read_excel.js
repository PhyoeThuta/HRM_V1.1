const xlsx = require('xlsx');

function dumpExcel(filename) {
  console.log(`\n=== DUMPING ${filename} ===`);
  const workbook = xlsx.readFile(filename);
  for (const sheetName of workbook.SheetNames) {
    console.log(`\nSheet: ${sheetName}`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log('Headers:', data[0]);
    console.log('Row 1:', data[1]);
    console.log('Row 2:', data[2]);
    console.log(`Total Rows: ${data.length}`);
  }
}

try {
  dumpExcel('Book1-5-1.xlsx');
  dumpExcel('Costing.xlsx');
} catch (e) {
  console.error(e);
}
