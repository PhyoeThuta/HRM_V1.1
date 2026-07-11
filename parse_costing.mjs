import xlsx from 'xlsx';
import fs from 'fs';

const workbook = xlsx.readFile('Costing.xlsx');
const sheet = workbook.Sheets['One Portion'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const menus = [];

// The tables are horizontally separated. We assume each table is 5 columns wide, with 2 empty columns between them.
// Column index offsets: 0, 7, 14, 21, 28...
for (let c = 0; c < data[0].length; c += 7) {
  if (!data[0][c]) continue; // Skip if no menu name
  
  const rawMenuName = data[0][c]; // e.g. "FGB 0002 - Fried Beef with Bell Pepper (အမဲငရုတ်ပွ + ထမင်း)"
  const salesPriceRaw = data[1] && data[1][c] ? data[1][c] : ''; // e.g. "Sales Prices - 120 Thb"
  
  // Extract Code, EN name, MM name
  let code = '';
  let nameEn = rawMenuName;
  let nameMm = '';
  
  const match = rawMenuName.match(/^([A-Z0-9\s]+)\s*-\s*([^\(]+)(?:\((.+)\))?/);
  if (match) {
    code = match[1].trim();
    nameEn = match[2].trim();
    nameMm = match[3] ? match[3].trim() : '';
  }

  // Extract Price
  let salesPrice = 0;
  const priceMatch = salesPriceRaw.match(/[\d\.]+/);
  if (priceMatch) {
    salesPrice = parseFloat(priceMatch[0]);
  }

  const ingredients = [];
  
  // Start from row 3 (which is index 3) where ingredients start
  let totalBOMCost = 0;
  for (let r = 3; r < data.length; r++) {
    const row = data[r];
    const desc = row[c];
    if (!desc || desc.trim() === '') continue;
    if (desc.toLowerCase().includes('total')) continue;
    
    const cost = row[c+1] || 0;
    const qty = row[c+2] || 0;
    const um = row[c+3] || '';
    const total = row[c+4] || 0;
    
    if (qty > 0) {
      ingredients.push({
        name: desc.trim(),
        cost_per_unit: parseFloat(cost) || 0,
        qty: parseFloat(qty) || 0,
        unit: um.trim(),
        total_cost: parseFloat(total) || 0
      });
      totalBOMCost += parseFloat(total) || 0;
    }
  }

  menus.push({
    code,
    name_en: nameEn,
    name_mm: nameMm,
    sales_prices: salesPrice,
    total_bill_of_materials: totalBOMCost,
    ingredients
  });
}

fs.writeFileSync('parsed_costing.json', JSON.stringify(menus, null, 2));
console.log(`Successfully parsed ${menus.length} menus from Costing.xlsx! Check parsed_costing.json.`);
