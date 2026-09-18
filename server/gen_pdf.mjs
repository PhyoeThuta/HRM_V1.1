import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({ margin: 50, size: 'A4' });
const outputPath = '../hrm-client/public/sample_promotion_letter.pdf';

doc.pipe(fs.createWriteStream(outputPath));

// Header Banner
doc
  .rect(0, 0, 595.28, 90)
  .fill('#1e1b4b'); // Dark indigo header

doc
  .fillColor('#ffffff')
  .fontSize(22)
  .font('Helvetica-Bold')
  .text('OFFICIAL PROMOTION LETTER', 50, 30, { align: 'left' });

doc
  .fontSize(10)
  .font('Helvetica')
  .fillColor('#a5b4fc')
  .text('HUMAN RESOURCES & TALENT MANAGEMENT DIVISION', 50, 58, { align: 'left' });

// Document Details Box
doc.moveDown(4);
doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold');
doc.text('DATE:', 50, 110);
doc.font('Helvetica').text('September 18, 2026', 100, 110);

doc.font('Helvetica-Bold').text('REF NO:', 350, 110);
doc.font('Helvetica').text('HR/PROMO/2026/089', 410, 110);

doc.font('Helvetica-Bold').text('TO:', 50, 130);
doc.font('Helvetica').text('Mg Mg (Employee ID: EMP-001)', 100, 130);

doc.font('Helvetica-Bold').text('SUBJECT:', 50, 150);
doc.font('Helvetica-Bold').fillColor('#4338ca').text('LETTER OF PROMOTION & SALARY ADJUSTMENT', 115, 150);

// Divider Line
doc
  .moveTo(50, 175)
  .lineTo(545, 175)
  .strokeColor('#e2e8f0')
  .lineWidth(1)
  .stroke();

// Body Text
doc.moveDown(2);
doc.fillColor('#334155').fontSize(11).font('Helvetica');
doc.text('Dear Mg Mg,', 50, 195);

doc.moveDown(0.8);
doc.text(
  'We are delighted to inform you that, in recognition of your exceptional performance, strong leadership, and continuous dedication to our organization, management has approved your promotion.',
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1);
doc.text(
  'Effective from October 1, 2026, your official title and compensation structure will be updated as follows:',
  { align: 'justify', lineGap: 4 }
);

// Highlights Table Box
const boxY = 285;
doc
  .roundedRect(50, boxY, 495, 110, 8)
  .fillAndStroke('#f8fafc', '#cbd5e1');

doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold');
doc.text('NEW POSITION TITLE:', 70, boxY + 20);
doc.font('Helvetica').fillColor('#4338ca').text('Senior Software Engineer & Tech Lead', 210, boxY + 20);

doc.font('Helvetica-Bold').fillColor('#1e293b').text('DEPARTMENT:', 70, boxY + 40);
doc.font('Helvetica').fillColor('#334155').text('Engineering & Operations Division', 210, boxY + 40);

doc.font('Helvetica-Bold').fillColor('#1e293b').text('NEW BASE SALARY:', 70, boxY + 60);
doc.font('Helvetica-Bold').fillColor('#15803d').text('$4,500.00 USD / Month', 210, boxY + 60);

doc.font('Helvetica-Bold').fillColor('#1e293b').text('EFFECTIVE DATE:', 70, boxY + 80);
doc.font('Helvetica').fillColor('#334155').text('October 1, 2026', 210, boxY + 80);

// Paragraph 3
doc.fillColor('#334155').fontSize(11).font('Helvetica');
doc.text(
  'In your new role, you will be reporting directly to the Head of Engineering. Your duties will include oversight of core application architecture, mentoring junior developers, and leading key technical initiatives.',
  50,
  boxY + 130,
  { align: 'justify', lineGap: 4 }
);

doc.moveDown(1);
doc.text(
  'We express our sincere appreciation for your hard work and look forward to your continued success with our company. Congratulations on your well-deserved promotion!',
  { align: 'justify', lineGap: 4 }
);

// Signatures Section
const sigY = 580;

// Executive Signature Box
doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b');
doc.text('EXECUTIVE / BOSS APPROVAL', 50, sigY);
doc.font('Helvetica-Oblique').fillColor('#64748b').fontSize(9).text('(Electronic Signature Required)', 50, sigY + 14);

doc
  .rect(50, sigY + 30, 220, 50)
  .dash(4, { space: 4 })
  .strokeColor('#cbd5e1')
  .stroke();
doc.undash();
doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('[ Boss Signature Placeholder ]', 85, sigY + 50);

// HR Signature Box
doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b');
doc.text('HR MANAGER AUTHORIZATION', 325, sigY);
doc.font('Helvetica-Oblique').fillColor('#64748b').fontSize(9).text('(Final Verification & Issue)', 325, sigY + 14);

doc
  .rect(325, sigY + 30, 220, 50)
  .dash(4, { space: 4 })
  .strokeColor('#cbd5e1')
  .stroke();
doc.undash();
doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('[ HR Signature Placeholder ]', 360, sigY + 50);

// Footer
doc
  .rect(0, 780, 595.28, 60)
  .fill('#f1f5f9');

doc
  .fillColor('#64748b')
  .fontSize(8)
  .font('Helvetica')
  .text('Confidential - Corporate HR System Internal Document', 50, 795, { align: 'center' });

doc.end();

console.log('Sample Promotion Letter PDF generated successfully at:', outputPath);
