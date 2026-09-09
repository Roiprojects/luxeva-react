import fs from 'fs';
import {
  Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow,
  WidthType, AlignmentType, BorderStyle, HeadingLevel,
  ShadingType, VerticalAlign
} from 'docx';

const PH = '[ TBD ]';

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 80 },
    children: [new TextRun({ text, bold: true, font: 'Calibri', size: 20, color: '1F3864' })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 50, after: 50, line: 340 },
    alignment: AlignmentType.LEFT,
    indent: opts.indent ? { left: 280 } : undefined,
    children: [new TextRun({ text, size: 18, bold: opts.bold || false, italics: opts.italics || false, font: 'Calibri' })],
  });
}

function runs(items, opts = {}) {
  return new Paragraph({
    spacing: { before: 50, after: 50, line: 340 },
    alignment: AlignmentType.LEFT,
    indent: opts.indent ? { left: 280 } : undefined,
    children: items.map(r => new TextRun({
      text: r.text, size: 18, bold: r.bold || false, italics: r.italics || false, font: 'Calibri',
    })),
  });
}

function sp(lines = 1) {
  return new Paragraph({ spacing: { before: 0, after: lines * 60 }, children: [] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 150, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '1F3864' } },
    children: [],
  });
}

function makeTable(headers, rows) {
  const hRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: '1F3864', color: 'FFFFFF' },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 50, after: 50 }, children: [new TextRun({ text: h, bold: true, size: 16, color: 'FFFFFF', font: 'Calibri' })] })],
    })),
  });
  const dRows = rows.map((row, i) => new TableRow({
    children: row.map(cell => new TableCell({
      width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? 'F5F5F5' : 'FFFFFF' },
      children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: cell, size: 16, font: 'Calibri' })] })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left:   { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right:  { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    },
    rows: [hRow, ...dRows],
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 18 } } } },
  sections: [{
    properties: {
      page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } },
    },
    children: [
      // ── LETTERHEAD ──
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 60 },
        children: [new TextRun({ text: 'ROI FAST TRACK INFOTECH SOLUTIONS', bold: true, size: 26, font: 'Calibri', color: '1F3864' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [new TextRun({ text: '[Company Address]  |  [City, State – PIN]  |  Email: [your-email]  |  Phone: [+91 XXXXXXXXXX]  |  GSTIN: [GSTIN]  |  Website: [www.your-website.com]', size: 14, font: 'Calibri', color: '555555' })],
      }),
      divider(),

      // ── DATE / RECIPIENT ──
      runs([{ text: 'Date: ', bold: true }, { text: PH, italics: true }]),
      sp(0.4),
      body('To,'),
      runs([{ text: 'The Management, Luxeva Care Pvt Ltd, Jigani, Bengaluru, Karnataka', bold: true }], { indent: true }),
      runs([{ text: 'Attention: Mr. Atul Kumar, CEO  |  atul.kumar@luxevacare.com' }], { indent: true }),
      sp(0.4),
      runs([{ text: 'Subject: Engagement Letter — Design, Development & Deployment of Corporate Website with Admin Panel', bold: true }]),
      sp(0.8),

      body('Dear Mr. Kumar,'),
      sp(0.4),
      body('This Engagement Letter sets out the terms under which ROI Fast Track Infotech Solutions ("Service Provider") agrees to provide website design, development, and deployment services to Luxeva Care Pvt Ltd ("Client"). Please review and confirm your acceptance by signing below.'),
      sp(0.6),

      // ── 1. SCOPE ──
      divider(),
      h1('1. PROJECT SCOPE'),
      body('Design, development, and deployment of a fully responsive corporate website with an integrated admin panel, comprising:'),
      runs([{ text: '(a) Public Website: ' }, { text: '12+ pages including Home, About, Services (with individual detail pages and image galleries), Portfolio, Testimonials, FAQ, Team, Contact, Privacy Policy, and Terms & Conditions — built in React with mobile-first responsive design.' }], { indent: true }),
      runs([{ text: '(b) Lead Generation System: ' }, { text: 'Multi-field enquiry forms with spam protection (honeypot + rate-limiting), UTM/source tracking, lead lifecycle management (New → Contacted → Qualified → Site Visit → Quotation → Converted/Closed), and WhatsApp click-to-chat + one-tap phone dial integration.' }], { indent: true }),
      runs([{ text: '(c) Admin Panel: ' }, { text: 'Role-based access control with modules for Dashboard, Content Editor (all pages), Enquiry Manager, Media Library, User Management, and Settings — secured with HTTP-only cookie sessions and bcrypt-hashed passwords.' }], { indent: true }),
      runs([{ text: '(d) Backend & Database: ' }, { text: 'Express.js REST API with PostgreSQL, covering enquiries (17 fields), admin users/sessions, and a JSONB content store. Schema, migrations, and seed data included.' }], { indent: true }),
      runs([{ text: '(e) Technology Stack: ' }, { text: 'React 19 · TypeScript · Vite · React Router v7 · Tailwind CSS v4 · Express 5 · PostgreSQL (pg) · react-hook-form + zod · lucide-react.' }], { indent: true }),
      runs([{ text: '(f) Handover: ' }, { text: 'Full source code, database schema, admin credentials, deployment configuration, and ' }, { text: PH, bold: true, italics: true }, { text: ' days of complimentary post-go-live support.' }], { indent: true }),

      // ── 2. FEES ──
      divider(),
      h1('2. FEES AND PAYMENT TERMS'),
      runs([{ text: 'Total Project Value: ', bold: true }, { text: PH + '  (INR)', italics: true }]),
      sp(0.3),
      makeTable(
        ['Milestone', 'Description', '%', 'Amount (INR)'],
        [
          ['M1', 'Upon signing this Letter',          '[X]%', '[Amount]'],
          ['M2', 'Upon delivery of prototype / demo', '[X]%', '[Amount]'],
          ['M3', 'Upon successful go-live',            '[X]%', '[Amount]'],
        ]
      ),
      sp(0.4),
      runs([{ text: 'Payment due within ' }, { text: PH, bold: true, italics: true }, { text: ' days of invoice. Payments via [NEFT/RTGS/UPI] to: Account: [ROI Fast Track Infotech Solutions], Bank: [Bank Name], A/c: [Number], IFSC: [IFSC], Branch: [City].' }]),
      runs([{ text: 'Late payment interest: ' }, { text: PH, bold: true, italics: true }, { text: ' [e.g., 1.5% per month on overdue amounts]', italics: true }]),

      // ── 3. TIMELINE ──
      divider(),
      h1('3. PROJECT TIMELINE'),
      makeTable(
        ['Phase', 'Description', 'Timeline'],
        [
          ['Phase 1', 'Discovery & Requirements Finalisation', '[Dates]'],
          ['Phase 2', 'Design & Prototype Approval',            '[Dates]'],
          ['Phase 3', 'Development & Testing',                  '[Dates]'],
          ['Phase 4', 'Client Review & Feedback',               '[Dates]'],
          ['Phase 5', 'Final Deployment & Go-Live',             '[Dates]'],
        ]
      ),
      runs([{ text: 'Projected Go-Live: ', bold: true }, { text: PH, italics: true }]),
      body('Timelines are indicative. Delays due to late client feedback or content shall proportionately extend the schedule.'),

      // ── 4–8. KEY TERMS (condensed) ──
      divider(),
      h1('4. CLIENT RESPONSIBILITIES'),
      runs([{ text: '• Provide all content (text, images, logos, brand guidelines) within agreed timelines.' }], { indent: true }),
      runs([{ text: '• Designate a single point of contact for approvals and feedback.' }], { indent: true }),
      runs([{ text: '• Provide consolidated feedback within ' }, { text: PH, bold: true, italics: true }, { text: ' business days per milestone.' }], { indent: true }),
      runs([{ text: '• Ensure all content is accurate, lawful, and does not infringe third-party rights.' }], { indent: true }),

      divider(),
      h1('5. INTELLECTUAL PROPERTY'),
      runs([{ text: 'Upon full and final payment, all IP rights in the developed website code, database schema, and custom components are assigned to the Client. The Client warrants all provided content is owned or licensed to them and indemnifies the Service Provider against third-party claims. The Service Provider retains the right to showcase the project in its portfolio unless the Client requests otherwise in writing.' }], { indent: true }),

      divider(),
      h1('6. WARRANTIES AND SUPPORT'),
      runs([{ text: 'The website is warranted free from material defects for ' }, { text: PH, bold: true, italics: true }, { text: ' days from go-live. This excludes Client modifications or third-party failures. Complimentary bug-fix support: ' }, { text: PH, bold: true, italics: true }, { text: ' days post go-live. Further work to be separately quoted.' }], { indent: true }),

      divider(),
      h1('7. GENERAL TERMS'),
      runs([{ text: 'Confidentiality: ' }, { text: 'Both parties agree to keep all project-related information confidential for ' }, { text: PH, bold: true, italics: true }, { text: ' years from the date of this Letter.' }], { indent: true }),
      runs([{ text: 'Limitation of Liability: ' }, { text: "The Service Provider's total liability shall not exceed the total project fees paid. Neither party is liable for indirect, incidental, consequential, or punitive damages." }], { indent: true }),
      runs([{ text: 'Termination: ' }, { text: 'Either party may terminate with ' }, { text: PH, bold: true, italics: true }, { text: ' days written notice. Client termination: fees payable for all work completed. Provider termination: for non-payment beyond ' }, { text: PH, bold: true, italics: true }, { text: ' days or no feedback for ' }, { text: PH, bold: true, italics: true }, { text: ' days.' }], { indent: true }),
      runs([{ text: 'Governing Law: ' }, { text: 'This Letter is governed by the laws of India. Disputes shall first be resolved through good-faith negotiations within ' }, { text: PH, bold: true, italics: true }, { text: ' days; failing which, by arbitration under the Arbitration and Conciliation Act, 1996, seated in Bengaluru, Karnataka.' }], { indent: true }),
      runs([{ text: 'Entire Agreement: ' }, { text: 'This Letter constitutes the entire agreement between the parties. No amendment is valid unless in writing and signed by both parties.' }], { indent: true }),

      // ── 9. ACCEPTANCE ──
      divider(),
      h1('8. ACCEPTANCE'),
      body('By signing below, both parties confirm their acceptance of all terms set out in this Engagement Letter.'),
      sp(0.5),
      makeTable(
        ['For and on behalf of ROI Fast Track Infotech Solutions', 'For and on behalf of Luxeva Care Pvt Ltd'],
        [
          ['Name: [Authorised Signatory Name]',                'Name: [Atul Kumar / Authorised Signatory]'],
          ['Designation: [Designation]',                       'Designation: [CEO / Designation]'],
          ['Signature: _________________________',              'Signature: _________________________'],
          ['Date: [DD/MM/YYYY]',                               'Date: [DD/MM/YYYY]'],
          ['Company Stamp / Seal',                             'Company Stamp / Seal'],
        ]
      ),
      sp(0.8),
      body('This document is prepared in accordance with Indian contract law norms. Both parties are advised to seek independent legal counsel before execution.', { italics: true }),

      sp(0.5),
      divider(),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [new TextRun({ text: 'ROI FAST TRACK INFOTECH SOLUTIONS', bold: true, size: 18, font: 'Calibri', color: '1F3864' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 30 },
        children: [new TextRun({ text: '[Company Address]  |  [City, State – PIN]  |  Email: [your-email]  |  Phone: [+91 XXXXXXXXXX]  |  Website: [www.your-website.com]  |  GSTIN: [GSTIN]', size: 13, font: 'Calibri', color: '777777' })],
      }),
    ],
  }],
});

const out = 'C:\\Users\\SaiPr\\Desktop\\luxeva-react\\Engagement_Letter_v2.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log('Done →', out);
});
