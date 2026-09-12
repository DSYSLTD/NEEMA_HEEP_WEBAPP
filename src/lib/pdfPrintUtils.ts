import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PdfReportOptions {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
  filename?: string;
  orientation?: 'portrait' | 'landscape';
}

async function loadLogoDataUrl(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/NEEMA HEEP LOGO.jpeg';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
  });
}

export async function exportPdfReport({
  title,
  subtitle,
  columns,
  rows,
  filename = 'Neema_HEEP_Report.pdf',
  orientation = 'portrait'
}: PdfReportOptions) {
  const doc = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: 'a4'
  });

  // Attempt to load official logo
  const logoDataUrl = await loadLogoDataUrl();

  // Header Banner
  doc.setFillColor(7, 69, 4); // #074504
  doc.rect(0, 0, doc.internal.pageSize.width, 28, 'F');

  // Gold accent bar below banner
  doc.setFillColor(192, 153, 27); // #C0991B
  doc.rect(0, 28, doc.internal.pageSize.width, 1.5, 'F');

  let textStartX = 14;
  if (logoDataUrl) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(12, 3, 22, 22, 2, 2, 'F');
      doc.setDrawColor(192, 153, 27);
      doc.setLineWidth(0.5);
      doc.roundedRect(12, 3, 22, 22, 2, 2, 'S');

      doc.addImage(logoDataUrl, 'JPEG', 13, 4, 20, 20);
      textStartX = 38;
    } catch (e) {
      console.warn('Could not render logo in PDF:', e);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('NEEMA HEEP MICROFINANCE', textStartX, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(title.toUpperCase(), textStartX, 19);

  doc.setTextColor(192, 153, 27); // #C0991B
  const rightText = `Generated: ${new Date().toLocaleDateString()}`;
  doc.text(rightText, doc.internal.pageSize.width - 14 - doc.getTextWidth(rightText), 19);

  let startY = 34;
  if (subtitle) {
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'italic');
    doc.text(subtitle, 14, startY);
    startY += 8;
  }

  autoTable(doc, {
    startY: startY,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 69, 4],
      textColor: [192, 153, 27],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 40, 40]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248]
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Draw Official Neema HEEP Stamp at bottom right of each page
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width;
      const pageHeight = pageSize.height;

      const stampX = pageWidth - 42;
      const stampY = pageHeight - 32;

      // Outer Stamp Circle
      doc.setDrawColor(7, 69, 4); // Green
      doc.setLineWidth(0.8);
      doc.circle(stampX, stampY, 14, 'S');

      // Inner Stamp Circle
      doc.setDrawColor(192, 153, 27); // Gold
      doc.setLineWidth(0.4);
      doc.circle(stampX, stampY, 12, 'S');

      // Stamp Text
      doc.setTextColor(7, 69, 4);
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'bold');
      doc.text('NEEMA HEEP', stampX, stampY - 5, { align: 'center' });

      doc.setTextColor(192, 153, 27);
      doc.setFontSize(4.5);
      doc.text('★ OFFICIAL STAMP ★', stampX, stampY - 1, { align: 'center' });

      doc.setTextColor(7, 69, 4);
      doc.setFontSize(4.5);
      doc.text('EMBU HQ VERIFIED', stampX, stampY + 3, { align: 'center' });

      doc.setFontSize(4);
      doc.setTextColor(100, 100, 100);
      doc.text(`AUDIT ${new Date().getFullYear()}`, stampX, stampY + 7, { align: 'center' });
    }
  });

  doc.save(filename);
}

export function printHtmlReport({
  title,
  subtitle,
  columns,
  rows
}: {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to print reports.');
    return;
  }

  const tableHeadHtml = columns.map(col => `<th style="border: 1px solid #e5e7eb; padding: 10px; background-color: #074504; color: #C0991B; text-align: left; font-size: 11px; text-transform: uppercase;">${col}</th>`).join('');
  
  const tableRowsHtml = rows.map((row, rIdx) => {
    const bg = rIdx % 2 === 0 ? '#ffffff' : '#f9fafb';
    const cells = row.map(cell => `<td style="border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 12px; color: #1f2937;">${cell ?? ''}</td>`).join('');
    return `<tr style="background-color: ${bg};">${cells}</tr>`;
  }).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Neema HEEP Microfinance</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1f2937; margin: 0; }
          .header { border-bottom: 2px solid #074504; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .brand { font-size: 20px; font-weight: 900; color: #074504; text-transform: uppercase; letter-spacing: -0.5px; }
          .tagline { font-size: 12px; color: #C0991B; font-weight: 700; text-transform: uppercase; }
          .title { font-size: 16px; font-weight: 800; color: #074504; margin-top: 12px; text-transform: uppercase; }
          .subtitle { font-size: 12px; color: #4b5563; margin-top: 4px; }
          .meta { font-size: 11px; color: #6b7280; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; pt-12px; font-size: 10px; color: #9ca3af; text-align: center; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="/NEEMA HEEP LOGO.jpeg" alt="Neema HEEP Logo" style="height: 52px; width: 52px; object-fit: cover; border-radius: 8px; border: 1.5px solid #C0991B;" onerror="this.style.display='none'" />
            <div>
              <div class="brand">Neema HEEP Microfinance</div>
              <div class="tagline">Official Corporate Audit & Management Report</div>
              <div class="title">${title}</div>
              ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="official-stamp" style="border: 2.5px double #074504; border-radius: 50%; width: 90px; height: 90px; padding: 4px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #074504; transform: rotate(-5deg); background: rgba(192, 153, 27, 0.08); border-color: #C0991B;">
              <div style="font-size: 8px; font-weight: 900; color: #074504; letter-spacing: 0.5px;">NEEMA HEEP</div>
              <div style="font-size: 6.5px; font-weight: 800; color: #C0991B; border-top: 1px solid #C0991B; border-bottom: 1px solid #C0991B; margin: 1px 0; width: 100%;">★ OFFICIAL STAMP ★</div>
              <div style="font-size: 6.5px; font-weight: 800; color: #074504;">EMBU HQ VERIFIED</div>
            </div>
            <div class="meta">
              <div>Printed: ${new Date().toLocaleString()}</div>
              <div>Confidential - Internal Use</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>${tableHeadHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Neema HEEP Microfinance | Neema Plaza, 3rd Floor, Mama Ngina Street, Embu | Tel: 0705 759 365 | Email: info@neemaheep.com
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

export function printSingleItemDossier({
  title,
  category,
  date,
  senderName,
  senderEmail,
  senderPhone,
  metadata,
  content
}: {
  title: string;
  category: string;
  date: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  metadata?: Record<string, string | number>;
  content: string;
}) {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to print dossiers.');
    return;
  }

  const metaHtml = metadata && Object.keys(metadata).length > 0
    ? Object.entries(metadata).map(([k, v]) => `
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 8px 12px; border-radius: 8px;">
          <div style="font-size: 10px; font-weight: 800; color: #4b5563; text-transform: uppercase;">${k.replace(/([A-Z])/g, ' $1')}</div>
          <div style="font-size: 13px; font-weight: 800; color: #074504; font-family: monospace; margin-top: 2px;">${v}</div>
        </div>
      `).join('')
    : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Neema HEEP Microfinance Lead Dossier</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 28px; color: #1f2937; margin: 0; }
          .header { border-bottom: 2px solid #074504; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .brand { font-size: 20px; font-weight: 900; color: #074504; text-transform: uppercase; }
          .tagline { font-size: 11px; color: #C0991B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .badge { display: inline-block; padding: 4px 10px; background: #074504; color: #C0991B; font-size: 10px; font-weight: 900; text-transform: uppercase; border-radius: 20px; margin-top: 8px; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          .label { font-size: 10px; font-weight: 800; color: #6b7280; text-transform: uppercase; }
          .val { font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px; }
          .body-text { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; font-size: 13px; line-height: 1.7; color: #1f2937; white-space: pre-wrap; margin-top: 16px; }
          .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 10px; color: #9ca3af; text-align: center; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="/NEEMA HEEP LOGO.jpeg" alt="Neema HEEP Logo" style="height: 56px; width: 56px; object-fit: cover; border-radius: 10px; border: 2px solid #C0991B;" />
            <div>
              <div class="brand">Neema HEEP Microfinance</div>
              <div class="tagline">Enterprise Client Lead & Inquiry Dossier</div>
              <div class="badge">${category}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="border: 2.5px double #074504; border-radius: 50%; width: 85px; height: 85px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #074504; transform: rotate(-4deg); background: rgba(192, 153, 27, 0.08); border-color: #C0991B;">
              <div style="font-size: 8px; font-weight: 900; color: #074504;">NEEMA HEEP</div>
              <div style="font-size: 6px; font-weight: 800; color: #C0991B; border-top: 1px solid #C0991B; border-bottom: 1px solid #C0991B; margin: 1px 0; width: 100%;">★ OFFICIAL STAMP ★</div>
              <div style="font-size: 6px; font-weight: 800; color: #074504;">EMBU HQ VERIFIED</div>
            </div>
            <div style="font-size: 11px; color: #6b7280; text-align: right;">
              <div><strong>Date:</strong> ${date}</div>
              <div>Printed: ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div style="font-size: 16px; font-weight: 900; color: #074504; margin-bottom: 12px;">${title}</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div>
              <div class="label">Client / Sender Name</div>
              <div class="val">${senderName}</div>
            </div>
            <div>
              <div class="label">Email Address</div>
              <div class="val" style="font-family: monospace;">${senderEmail}</div>
            </div>
            ${senderPhone ? `
            <div>
              <div class="label">Phone Number</div>
              <div class="val" style="font-family: monospace;">${senderPhone}</div>
            </div>
            ` : ''}
          </div>
        </div>

        ${metaHtml ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 16px;">
          ${metaHtml}
        </div>
        ` : ''}

        <div class="label" style="margin-top: 12px; margin-left: 2px;">Inquiry / Application Details</div>
        <div class="body-text">${content}</div>

        <div class="footer">
          Neema HEEP Microfinance | Corporate HQ: Neema Plaza, 3rd Floor, Mama Ngina Street, Embu | Tel: 0705 759 365 | Email: info@neemaheep.com
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

export interface LeadDossierItem {
  id: string;
  title: string;
  category: string;
  date: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  status?: string;
  metadata?: Record<string, string | number>;
  content: string;
}

export function printAllLeadsBooklet({
  title = 'Complete Leads & Client Inquiries Dossier Booklet',
  items
}: {
  title?: string;
  items: LeadDossierItem[];
}) {
  const printWindow = window.open('', '_blank', 'width=950,height=850');
  if (!printWindow) {
    alert('Please allow popups to print dossiers.');
    return;
  }

  const dossiersHtml = items.map((item, index) => {
    const metaHtml = item.metadata && Object.keys(item.metadata).length > 0
      ? Object.entries(item.metadata).map(([k, v]) => `
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 6px 10px; border-radius: 6px;">
            <div style="font-size: 9px; font-weight: 800; color: #4b5563; text-transform: uppercase;">${k.replace(/([A-Z])/g, ' $1')}</div>
            <div style="font-size: 12px; font-weight: 800; color: #074504; font-family: monospace; margin-top: 1px;">${v}</div>
          </div>
        `).join('')
      : '';

    return `
      <div class="lead-page ${index < items.length - 1 ? 'page-break' : ''}">
        <div class="header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/NEEMA HEEP LOGO.jpeg" alt="Neema HEEP Logo" style="height: 48px; width: 48px; object-fit: cover; border-radius: 8px; border: 2px solid #C0991B;" />
            <div>
              <div class="brand">Neema HEEP Microfinance</div>
              <div class="tagline">Client Inquiry & Lead Dossier (#${index + 1} of ${items.length})</div>
              <div class="badge">${item.category}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="border: 2px double #074504; border-radius: 50%; width: 75px; height: 75px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #074504; transform: rotate(-4deg); background: rgba(192, 153, 27, 0.08); border-color: #C0991B;">
              <div style="font-size: 7px; font-weight: 900; color: #074504;">NEEMA HEEP</div>
              <div style="font-size: 5.5px; font-weight: 800; color: #C0991B; border-top: 1px solid #C0991B; border-bottom: 1px solid #C0991B; margin: 1px 0; width: 100%;">★ OFFICIAL STAMP ★</div>
              <div style="font-size: 5.5px; font-weight: 800; color: #074504;">EMBU HQ VERIFIED</div>
            </div>
            <div style="font-size: 10px; color: #6b7280; text-align: right;">
              <div><strong>Ref:</strong> ${item.id}</div>
              <div><strong>Date:</strong> ${item.date}</div>
              ${item.status ? `<div style="font-weight: 900; color: #074504; margin-top: 2px;">Status: ${item.status}</div>` : ''}
            </div>
          </div>
        </div>

        <div class="card">
          <div style="font-size: 14px; font-weight: 900; color: #074504; margin-bottom: 10px;">${item.title}</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div>
              <div class="label">Client / Sender Name</div>
              <div class="val">${item.senderName}</div>
            </div>
            <div>
              <div class="label">Email Address</div>
              <div class="val" style="font-family: monospace;">${item.senderEmail}</div>
            </div>
            <div>
              <div class="label">Phone Number</div>
              <div class="val" style="font-family: monospace;">${item.senderPhone || 'N/A'}</div>
            </div>
          </div>
        </div>

        ${metaHtml ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-bottom: 14px; background: #f3f4f6; padding: 10px; border-radius: 8px;">
          ${metaHtml}
        </div>
        ` : ''}

        <div class="label" style="margin-left: 2px; margin-bottom: 4px;">Full Inquiry Details</div>
        <div class="body-text">${item.content}</div>

        <div class="footer">
          Neema HEEP Microfinance | Page ${index + 1} of ${items.length} | Corporate HQ: Neema Plaza, 3rd Floor, Mama Ngina Street, Embu | Tel: 0705 759 365
        </div>
      </div>
    `;
  }).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Neema HEEP Microfinance</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1f2937; margin: 0; background: #ffffff; }
          .lead-page { padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px dashed #d1d5db; }
          .page-break { page-break-after: always; }
          .header { border-bottom: 2px solid #074504; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
          .brand { font-size: 18px; font-weight: 900; color: #074504; text-transform: uppercase; }
          .tagline { font-size: 10px; color: #C0991B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .badge { display: inline-block; padding: 3px 8px; background: #074504; color: #C0991B; font-size: 9px; font-weight: 900; text-transform: uppercase; border-radius: 20px; margin-top: 4px; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; margin-bottom: 12px; }
          .label { font-size: 9.5px; font-weight: 800; color: #6b7280; text-transform: uppercase; }
          .val { font-size: 12px; font-weight: 800; color: #111827; margin-top: 1px; }
          .body-text { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; font-size: 12px; line-height: 1.6; color: #1f2937; white-space: pre-wrap; }
          .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 9px; color: #9ca3af; text-align: center; }
          @media print {
            body { padding: 0; }
            .lead-page { border-bottom: none; }
          }
        </style>
      </head>
      <body>
        ${dossiersHtml}

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
