const xlsx = require('xlsx');

// Create a workbook with "1-Jun-26" in B1
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet([
  [null, "1-Jun-26", null, null, "Main Dish", "Side Dish", "Dessert", "Soup", "RICE"]
]);
xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
xlsx.writeFile(wb, "test.xlsx");

// Read it back
const wb2 = xlsx.readFile("test.xlsx");
const ws2 = wb2.Sheets[wb2.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws2, { header: "A" });
console.log("Rows:", JSON.stringify(rows, null, 2));

const dateRaw = rows[0]['B'];
console.log("dateRaw:", dateRaw, typeof dateRaw);

let parsedDate;
const strDate = String(dateRaw);
if (strDate.includes('-')) {
    const parts = strDate.split('-');
    if (parts.length === 3) {
        const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        const monthMap = {'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04', 'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08', 'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'};
        const monthStr = parts[1].substring(0, 3);
        const month = monthMap[monthStr] || '01';
        const day = parts[0].padStart(2, '0');
        parsedDate = new Date(`${year}-${month}-${day}T12:00:00Z`);
    } else {
        parsedDate = new Date(strDate);
    }
} else {
    parsedDate = new Date(strDate);
}
console.log("parsedDate:", parsedDate);
console.log("isNaN:", isNaN(parsedDate.getTime()));
