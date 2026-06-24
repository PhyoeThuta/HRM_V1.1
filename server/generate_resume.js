import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Output path: Desktop
const outputPath = path.join('C:', 'Users', 'Phyoe', 'Desktop', 'kitchen_assistant_resume.pdf');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(outputPath));

doc.fontSize(24).text('John Doe', { align: 'center' });
doc.fontSize(14).text('ASSISTANT KITCHEN MANAGER / KITCHEN ASSISTANT', { align: 'center', underline: true });
doc.moveDown();

doc.fontSize(10).text('123 Culinary Road, Foodville, NY 12345 | (555) 019-2834 | john.doe@email.com', { align: 'center' });
doc.moveDown();

doc.fontSize(14).text('PROFESSIONAL SUMMARY', { underline: true });
doc.fontSize(10).text(
  'Dependable, energetic, and detail-oriented Assistant Kitchen Manager with over 3 years of hands-on experience in fast-paced casual dining environments. Adept at supporting head chefs, managing high-volume food preparation lines, enforcing strict food safety and sanitation guidelines, and supervising kitchen crews. Proven track record of optimizing stock rotation, minimizing inventory waste, and stepping in dynamically across all kitchen stations to ensure seamless service delivery.'
);
doc.moveDown();

doc.fontSize(14).text('CORE COMPETENCIES & TECHNICAL SKILLS', { underline: true });
doc.fontSize(10).text('- Culinary Operations: Food Prep, Line Cooking, Portion Control');
doc.text('- Safety & Compliance: ServSafe Certified, HACCP, Health Codes');
doc.text('- Management: Team Leadership, Shift Scheduling, Training');
doc.text('- Kitchen Tech & POS: Toast POS, Clover, ChefTec Inventory');
doc.text('- Commercial Equipment: Convection Ovens, Slicers, Walk-ins');
doc.text('- Inventory Control: FIFO Method, Stock Ordering, Waste Reduction');
doc.moveDown();

doc.fontSize(14).text('EXPERIENCE', { underline: true });
doc.fontSize(12).text('Kitchen Assistant & Prep Cook - The Golden Spoon Restaurant');
doc.fontSize(10).text('June 2021 - Present');
doc.text('- Assist the head chef in preparing over 300 meals daily in a high-volume setting.');
doc.text('- Ensure kitchen compliance with all health and safety regulations (ServSafe certified).');
doc.text('- Manage inventory and stock rotation using the FIFO method, reducing food waste by 15%.');
doc.text('- Operate and maintain commercial kitchen equipment, ensuring cleanliness and safety.');
doc.moveDown();

doc.fontSize(14).text('EDUCATION', { underline: true });
doc.fontSize(12).text('Culinary Arts Certificate');
doc.fontSize(10).text('Foodville Culinary Institute, 2021');

doc.end();

console.log(`PDF successfully generated at: ${outputPath}`);
