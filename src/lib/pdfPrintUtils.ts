import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface SummaryMetric {
  label: string;
  value: string | number;
  color?: string;
}

export interface PdfReportOptions {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  summaryMetrics?: SummaryMetric[];
  referenceNumber?: string;
  issuingDepartment?: string;
  showSignatureBlock?: boolean;
}

/**
 * Loads the official Neema HEEP high-resolution logo as a base64 Data URL.
 * Automatically tries multiple paths and normalizes to a crisp canvas.
 */
async function loadLogoDataUrl(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const candidatePaths = [
    '/header_logo.jpeg',
    '/NEEMA HEEP LOGO.jpeg',
    '/neema_heep_logo.jpeg',
    '/footer_logo.png'
  ];

  for (const src of candidatePaths) {
    try {
      const dataUrl = await new Promise<string | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const targetDim = 260;
            canvas.width = targetDim;
            canvas.height = targetDim;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, targetDim, targetDim);
              ctx.drawImage(img, 0, 0, targetDim, targetDim);
              resolve(canvas.toDataURL('image/jpeg', 0.92));
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
      });

      if (dataUrl) return dataUrl;
    } catch {
      // Continue to next path
    }
  }

  return null;
}

/**
 * Helper to generate a consistent institutional reference number
 */
export function generateInstitutionalRef(prefix = 'NH-REP'): string {
  const year = new Date().getFullYear();
  const dayOfYear = Math.floor((Date.now() - new Date(year, 0, 0).getTime()) / 86400000);
  const serial = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}/${year}/${String(dayOfYear).padStart(3, '0')}-${serial}`;
}

/**
 * EXPORT PDF REPORT ON OFFICIAL NEEMA HEEP LETTERHEAD
 * Produces a publication-grade PDF with official corporate logo, institutional
 * address, contact hotlines, branch network, document reference, circular official seal,
 * and executive sign-off blocks.
 */
export async function exportPdfReport({
  title,
  subtitle,
  columns,
  rows,
  filename = 'Neema_HEEP_Official_Report.pdf',
  orientation = 'portrait',
  summaryMetrics = [],
  referenceNumber,
  issuingDepartment = 'Operations & Credit Administration',
  showSignatureBlock = true
}: PdfReportOptions) {
  const doc = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const marginX = 14;
  const contentWidth = pageWidth - (marginX * 2);

  const refNumber = referenceNumber || generateInstitutionalRef('NH-AUD');
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const generationTimestamp = new Date().toLocaleString();

  // Attempt to load official logo
  const logoDataUrl = await loadLogoDataUrl();

  // ==============================================================================
  // 1. TOP CORPORATE LETTERHEAD (PAGE 1)
  // ==============================================================================

  // Top Forest Green Header Accent Band
  doc.setFillColor(7, 69, 4); // #074504
  doc.rect(0, 0, pageWidth, 5.5, 'F');

  // Gold Accent Rule below top band
  doc.setFillColor(192, 153, 27); // #C0991B
  doc.rect(0, 5.5, pageWidth, 1.2, 'F');

  // Draw Logo on Left
  const logoX = marginX;
  const logoY = 9;
  const logoSize = 22;

  if (logoDataUrl) {
    try {
      // Rounded white logo badge with gold outline
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
      doc.setDrawColor(192, 153, 27);
      doc.setLineWidth(0.4);
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'S');

      doc.addImage(logoDataUrl, 'JPEG', logoX + 0.8, logoY + 0.8, logoSize - 1.6, logoSize - 1.6);
    } catch {
      // Fallback emblem if addImage fails
      doc.setFillColor(7, 69, 4);
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
      doc.setTextColor(192, 153, 27);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('NH', logoX + (logoSize / 2), logoY + 14, { align: 'center' });
    }
  } else {
    // Fallback emblem
    doc.setFillColor(7, 69, 4);
    doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
    doc.setTextColor(192, 153, 27);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('NH', logoX + (logoSize / 2), logoY + 14, { align: 'center' });
  }

  // Institutional Name & Tagline (Center-Left)
  const textX = logoX + logoSize + 4;
  doc.setTextColor(7, 69, 4); // Forest Green
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('NEEMA HEEP MICROFINANCE', textX, 14);

  doc.setTextColor(192, 153, 27); // Gold
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('HOUSING & ECONOMIC EMPOWERMENT PROGRAMME', textX, 18);

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.text('"Empowering Communities • Transforming Livelihoods"', textX, 22);

  doc.setTextColor(110, 110, 110);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Reg. No. CPR/2014/149811 • Licensed Microfinance Institution', textX, 26);

  // Corporate HQ & Contact Details (Right-Aligned)
  const rightX = pageWidth - marginX;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('HEAD OFFICE: Neema Plaza, 3rd Floor', rightX, 12.5, { align: 'right' });

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Mama Ngina Street, P.O. Box 2487 - 60100, Embu, Kenya', rightX, 16, { align: 'right' });
  doc.text('Hotline: +254 705 759 365  |  +254 722 000 000', rightX, 19.5, { align: 'right' });

  doc.setTextColor(7, 69, 4);
  doc.setFont('helvetica', 'bold');
  doc.text('Email: info@neemaheep.com  |  Web: www.neemaheep.com', rightX, 23, { align: 'right' });

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Doc Ref: ${refNumber}`, rightX, 26.5, { align: 'right' });

  // Dividing Letterhead Rule (Double Green & Gold)
  doc.setDrawColor(7, 69, 4);
  doc.setLineWidth(0.8);
  doc.line(marginX, 32, pageWidth - marginX, 32);

  doc.setDrawColor(192, 153, 27);
  doc.setLineWidth(0.4);
  doc.line(marginX, 33.2, pageWidth - marginX, 33.2);

  // Branch Network Bar
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(marginX, 34.5, contentWidth, 5.5, 1, 1, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.2);
  doc.roundedRect(marginX, 34.5, contentWidth, 5.5, 1, 1, 'S');

  doc.setTextColor(7, 69, 4);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'BRANCH NETWORK: EMBU HEADQUARTERS  •  MAUA  •  MERU  •  CHUKA  •  KERUGOYA  •  KITUI',
    pageWidth / 2,
    38.3,
    { align: 'center' }
  );

  // ==============================================================================
  // 2. DOCUMENT CONTROL & METADATA BAR
  // ==============================================================================

  // Document Title
  doc.setTextColor(7, 69, 4);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), marginX, 46);

  // Document Metadata Pill
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(marginX, 48.5, contentWidth, 7, 1.5, 1.5, 'F');

  doc.setTextColor(55, 65, 81);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`REF: ${refNumber}`, marginX + 3, 53);

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text(`DEPT: ${issuingDepartment}`, marginX + 55, 53);

  doc.text(`DATE ISSUED: ${issueDate}`, pageWidth - marginX - 60, 53);

  doc.setTextColor(7, 69, 4);
  doc.setFont('helvetica', 'bold');
  doc.text('CLASSIFICATION: OFFICIAL & CONFIDENTIAL', pageWidth - marginX - 3, 53, { align: 'right' });

  let currentY = 58;

  // Subtitle
  if (subtitle) {
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(subtitle, marginX, currentY);
    currentY += 6;
  }

  // Summary Metrics KPI Cards
  if (summaryMetrics && summaryMetrics.length > 0) {
    const cardGap = 2.5;
    const numCards = Math.min(summaryMetrics.length, 4);
    const cardWidth = (contentWidth - ((numCards - 1) * cardGap)) / numCards;
    const cardHeight = 11;

    summaryMetrics.slice(0, 4).forEach((metric, idx) => {
      const cardX = marginX + (idx * (cardWidth + cardGap));

      doc.setFillColor(250, 250, 250);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.5, 1.5, 'F');
      doc.setDrawColor(220, 225, 220);
      doc.setLineWidth(0.3);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.5, 1.5, 'S');

      // Top green accent bar on card
      doc.setFillColor(7, 69, 4);
      doc.rect(cardX, currentY, cardWidth, 0.8, 'F');

      doc.setTextColor(100, 110, 120);
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'bold');
      doc.text(metric.label.toUpperCase(), cardX + 2.5, currentY + 3.8);

      doc.setTextColor(7, 69, 4);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(String(metric.value), cardX + 2.5, currentY + 8.5);
    });

    currentY += cardHeight + 4;
  }

  // ==============================================================================
  // 3. DATA TABLE RENDERING
  // ==============================================================================

  autoTable(doc, {
    startY: currentY,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 69, 4],
      textColor: [192, 153, 27],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.2
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [35, 35, 35],
      cellPadding: 1.8
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248]
    },
    margin: { left: marginX, right: marginX, bottom: 28 },
    didDrawPage: (data) => {
      const pageIndex = (doc as any).internal.getNumberOfPages();
      const totalPagesExp = '{total_pages_count_string}';

      // RUNNING HEADER FOR PAGES > 1
      if (pageIndex > 1) {
        doc.setFillColor(7, 69, 4);
        doc.rect(0, 0, pageWidth, 3.5, 'F');

        doc.setTextColor(7, 69, 4);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('NEEMA HEEP MICROFINANCE', marginX, 8);

        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`•  ${title} (Ref: ${refNumber})`, marginX + 50, 8);

        doc.setTextColor(192, 153, 27);
        doc.setFont('helvetica', 'bold');
        doc.text(`Page ${pageIndex}`, pageWidth - marginX, 8, { align: 'right' });

        doc.setDrawColor(192, 153, 27);
        doc.setLineWidth(0.3);
        doc.line(marginX, 10.5, pageWidth - marginX, 10.5);
      }

      // RUNNING FOOTER ON ALL PAGES
      const footerY = pageHeight - 14;

      doc.setDrawColor(7, 69, 4);
      doc.setLineWidth(0.4);
      doc.line(marginX, footerY, pageWidth - marginX, footerY);

      doc.setDrawColor(192, 153, 27);
      doc.setLineWidth(0.2);
      doc.line(marginX, footerY + 0.8, pageWidth - marginX, footerY + 0.8);

      doc.setTextColor(90, 90, 90);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Neema HEEP Microfinance  |  Neema Plaza, Mama Ngina St, Embu  |  Tel: 0705 759 365  |  info@neemaheep.com',
        marginX,
        footerY + 4
      );

      doc.text(
        `Generated: ${generationTimestamp}  |  Official Confidential Record`,
        marginX,
        footerY + 7.5
      );

      doc.setTextColor(7, 69, 4);
      doc.setFont('helvetica', 'bold');
      doc.text(
        `Page ${pageIndex}`,
        pageWidth - marginX,
        footerY + 5.5,
        { align: 'right' }
      );
    }
  });

  // ==============================================================================
  // 4. OFFICIAL SEAL & EXECUTIVE SIGN-OFF BLOCK (LAST PAGE)
  // ==============================================================================

  if (showSignatureBlock) {
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : currentY + 20;

    // Check if we need a new page for signatures
    let sigY = finalY;
    if (sigY + 32 > pageHeight - 20) {
      doc.addPage();
      sigY = 24;
    }

    // 1. Dual-Ring Circular Official Corporate Stamp
    const stampX = pageWidth - marginX - 22;
    const stampCenterY = sigY + 12;

    doc.setDrawColor(7, 69, 4); // Forest Green
    doc.setLineWidth(0.8);
    doc.circle(stampX, stampCenterY, 13, 'S');

    doc.setDrawColor(192, 153, 27); // Gold
    doc.setLineWidth(0.4);
    doc.circle(stampX, stampCenterY, 11, 'S');

    doc.setTextColor(7, 69, 4);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text('NEEMA HEEP', stampX, stampCenterY - 4.5, { align: 'center' });

    doc.setTextColor(192, 153, 27);
    doc.setFontSize(4);
    doc.text('★ OFFICIAL VERIFIED STAMP ★', stampX, stampCenterY - 1, { align: 'center' });

    doc.setTextColor(7, 69, 4);
    doc.setFontSize(4.2);
    doc.text('EMBU HQ VERIFIED', stampX, stampCenterY + 2.8, { align: 'center' });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(3.8);
    doc.text(`AUDIT ${new Date().getFullYear()}`, stampX, stampCenterY + 6.5, { align: 'center' });

    // 2. Executive Sign-Off Lines
    const sigBoxWidth = (contentWidth - 55) / 2;

    // Signatory 1
    const sig1X = marginX;
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(sig1X, sigY + 14, sig1X + sigBoxWidth, sigY + 14);

    doc.setTextColor(7, 69, 4);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHORIZED CORPORATE SIGNATORY', sig1X, sigY + 18);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Managing Director / Credit Controller', sig1X, sigY + 21.5);
    doc.text(`Date: ${issueDate}`, sig1X, sigY + 25);

    // Signatory 2
    const sig2X = marginX + sigBoxWidth + 8;
    doc.line(sig2X, sigY + 14, sig2X + sigBoxWidth, sigY + 14);

    doc.setTextColor(7, 69, 4);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('INTERNAL AUDIT & COMPLIANCE', sig2X, sigY + 18);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Lead Compliance Officer', sig2X, sigY + 21.5);
    doc.text('Status: Verification Passed', sig2X, sigY + 25);
  }

  doc.save(filename);
}

/**
 * PRINT HTML REPORT ON OFFICIAL NEEMA HEEP LETTERHEAD
 * Used for instant browser popup printing (window.print()) with full
 * CSS-styled institutional letterhead, logo, official seal, and corporate footer.
 */
export function printHtmlReport({
  title,
  subtitle,
  columns,
  rows,
  summaryMetrics = [],
  referenceNumber,
  issuingDepartment = 'Operations & Credit Administration'
}: {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
  summaryMetrics?: SummaryMetric[];
  referenceNumber?: string;
  issuingDepartment?: string;
}) {
  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow popups to print reports.');
    return;
  }

  const refNumber = referenceNumber || generateInstitutionalRef('NH-AUD');
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const metricsHtml = summaryMetrics && summaryMetrics.length > 0
    ? `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 16px 0;">
        ${summaryMetrics.map(m => `
          <div style="background: #f8faf8; border: 1px solid #e5e7eb; border-top: 3px solid #074504; border-radius: 8px; padding: 10px 12px;">
            <div style="font-size: 9px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">${m.label}</div>
            <div style="font-size: 16px; font-weight: 900; color: #074504; margin-top: 3px;">${m.value}</div>
          </div>
        `).join('')}
      </div>
    `
    : '';

  const tableHeadHtml = columns.map(col =>
    `<th style="border: 1px solid #d1d5db; padding: 8px 10px; background-color: #074504; color: #C0991B; text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${col}</th>`
  ).join('');

  const tableRowsHtml = rows.map((row, rIdx) => {
    const bg = rIdx % 2 === 0 ? '#ffffff' : '#f9fafb';
    const cells = row.map(cell =>
      `<td style="border: 1px solid #e5e7eb; padding: 7px 10px; font-size: 11px; color: #1f2937;">${cell ?? ''}</td>`
    ).join('');
    return `<tr style="background-color: ${bg};">${cells}</tr>`;
  }).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title} - Neema HEEP Microfinance Official Report</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
            background: #ffffff;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
          }

          /* LETTERHEAD HEADER */
          .letterhead-top-bar {
            height: 6px;
            background: #074504;
            border-bottom: 2px solid #C0991B;
            margin: -20px -20px 14px -20px;
          }
          .letterhead-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 12px;
          }
          .brand-col {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo-box {
            width: 72px;
            height: 72px;
            border-radius: 10px;
            border: 2px solid #C0991B;
            padding: 2px;
            background: #ffffff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          }
          .logo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
          .brand-title {
            font-size: 19px;
            font-weight: 900;
            color: #074504;
            letter-spacing: -0.3px;
            margin: 0;
            text-transform: uppercase;
          }
          .brand-subtitle {
            font-size: 11px;
            font-weight: 800;
            color: #C0991B;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-top: 2px;
          }
          .brand-motto {
            font-size: 9.5px;
            font-style: italic;
            color: #555555;
            margin-top: 3px;
          }
          .brand-reg {
            font-size: 8.5px;
            color: #777777;
            margin-top: 2px;
          }

          /* CONTACT / HQ COL */
          .contact-col {
            text-align: right;
            font-size: 9px;
            color: #4b5563;
            line-height: 1.45;
          }
          .contact-col strong {
            color: #111827;
          }
          .contact-col a {
            color: #074504;
            text-decoration: none;
            font-weight: 700;
          }

          /* DIVIDER RULES */
          .divider-green {
            height: 2.5px;
            background: #074504;
            margin-top: 6px;
          }
          .divider-gold {
            height: 1.5px;
            background: #C0991B;
            margin-top: 1.5px;
            margin-bottom: 8px;
          }

          /* BRANCH BANNER */
          .branch-banner {
            background: #f8faf8;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            text-align: center;
            font-size: 8.5px;
            font-weight: 800;
            color: #074504;
            padding: 5px 8px;
            letter-spacing: 0.5px;
            margin-bottom: 14px;
          }

          /* DOCUMENT CONTROL BOX */
          .doc-control {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 14px;
          }
          .doc-control .ref {
            color: #074504;
            font-family: monospace;
            font-size: 11px;
          }
          .doc-title {
            font-size: 16px;
            font-weight: 900;
            color: #074504;
            text-transform: uppercase;
            margin: 10px 0 4px 0;
          }
          .doc-subtitle {
            font-size: 11px;
            color: #4b5563;
            font-style: italic;
            margin-bottom: 10px;
          }

          /* TABLE */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 24px;
          }

          /* FOOTER & SIGN-OFF */
          .signoff-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 24px;
            padding-top: 16px;
            page-break-inside: avoid;
          }
          .sign-box {
            width: 38%;
            border-top: 1.5px solid #6b7280;
            padding-top: 6px;
          }
          .sign-title {
            font-size: 10px;
            font-weight: 800;
            color: #074504;
            text-transform: uppercase;
          }
          .sign-sub {
            font-size: 8.5px;
            color: #6b7280;
            margin-top: 2px;
          }

          /* OFFICIAL CIRCULAR STAMP */
          .official-seal {
            border: 2.5px double #074504;
            border-radius: 50%;
            width: 95px;
            height: 95px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #074504;
            transform: rotate(-4deg);
            background: rgba(192, 153, 27, 0.08);
            border-color: #C0991B;
            box-shadow: 0 0 0 2px #074504;
          }
          .seal-top { font-size: 8px; font-weight: 900; color: #074504; letter-spacing: 0.5px; }
          .seal-mid { font-size: 6.5px; font-weight: 800; color: #C0991B; border-top: 1px solid #C0991B; border-bottom: 1px solid #C0991B; margin: 2px 0; width: 85%; }
          .seal-bot { font-size: 7px; font-weight: 800; color: #074504; }
          .seal-yr { font-size: 6px; color: #555555; margin-top: 1px; }

          .legal-footer {
            margin-top: 28px;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
            line-height: 1.5;
          }

          @media print {
            body { padding: 0; }
            .letterhead-top-bar { margin: 0 0 14px 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="letterhead-top-bar"></div>

        <!-- CORPORATE LETTERHEAD HEADER -->
        <div class="letterhead-container">
          <div class="brand-col">
            <div class="logo-box">
              <img src="/header_logo.jpeg" alt="Neema HEEP Logo" onerror="this.src='/NEEMA HEEP LOGO.jpeg';" />
            </div>
            <div>
              <div class="brand-title">Neema HEEP Microfinance</div>
              <div class="brand-subtitle">Housing & Economic Empowerment Programme</div>
              <div class="brand-motto">"Empowering Communities • Transforming Livelihoods"</div>
              <div class="brand-reg">Reg. No. CPR/2014/149811 • Licensed Microfinance Institution</div>
            </div>
          </div>
          <div class="contact-col">
            <div><strong>HEAD OFFICE:</strong> Neema Plaza, 3rd Floor, Mama Ngina St</div>
            <div>P.O. Box 2487 - 60100, Embu, Kenya</div>
            <div><strong>Tel:</strong> +254 705 759 365  |  +254 722 000 000</div>
            <div><strong>Email:</strong> <a href="mailto:info@neemaheep.com">info@neemaheep.com</a></div>
            <div><strong>Web:</strong> <a href="https://www.neemaheep.com">www.neemaheep.com</a></div>
          </div>
        </div>

        <div class="divider-green"></div>
        <div class="divider-gold"></div>

        <div class="branch-banner">
          BRANCH NETWORK: EMBU HEADQUARTERS  •  MAUA  •  MERU  •  CHUKA  •  KERUGOYA  •  KITUI
        </div>

        <div class="doc-title">${title}</div>
        ${subtitle ? `<div class="doc-subtitle">${subtitle}</div>` : ''}

        <div class="doc-control">
          <div><span style="color:#6b7280;">DOC REF:</span> <span class="ref">${refNumber}</span></div>
          <div><span style="color:#6b7280;">DEPARTMENT:</span> ${issuingDepartment}</div>
          <div><span style="color:#6b7280;">DATE:</span> ${issueDate}</div>
          <div style="color:#074504; font-weight:900;">OFFICIAL & CONFIDENTIAL</div>
        </div>

        ${metricsHtml}

        <!-- DATA TABLE -->
        <table>
          <thead>
            <tr>${tableHeadHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <!-- SIGN-OFF SECTION & OFFICIAL STAMP -->
        <div class="signoff-section">
          <div class="sign-box">
            <div class="sign-title">Authorized Corporate Signatory</div>
            <div class="sign-sub">Managing Director / Credit Controller</div>
            <div class="sign-sub">Date: ${issueDate}</div>
          </div>

          <div class="official-seal">
            <div class="seal-top">NEEMA HEEP</div>
            <div class="seal-mid">★ OFFICIAL STAMP ★</div>
            <div class="seal-bot">EMBU HQ VERIFIED</div>
            <div class="seal-yr">${new Date().getFullYear()} AUDIT</div>
          </div>

          <div class="sign-box" style="text-align: right;">
            <div class="sign-title">Internal Audit & Compliance</div>
            <div class="sign-sub">Risk & Legal Compliance Board</div>
            <div class="sign-sub">Status: Certified Complete</div>
          </div>
        </div>

        <!-- LEGAL FOOTER -->
        <div class="legal-footer">
          <div>Neema HEEP Microfinance  |  Neema Plaza, 3rd Floor, Mama Ngina Street, Embu  |  Customer Care: 0705 759 365</div>
          <div>This document is an official administrative publication of Neema HEEP Microfinance. Unauthorized duplication or alteration is strictly prohibited.</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

/**
 * PRINT SINGLE ITEM DOSSIER ON OFFICIAL NEEMA HEEP LETTERHEAD
 * For client inquiries, job candidates, credit leads, and individual scholar dossiers.
 */
export function printSingleItemDossier({
  title,
  category,
  date,
  senderName,
  senderEmail,
  senderPhone,
  metadata,
  content,
  referenceNumber
}: {
  title: string;
  category: string;
  date: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  metadata?: Record<string, string | number>;
  content: string;
  referenceNumber?: string;
}) {
  const printWindow = window.open('', '_blank', 'width=950,height=850');
  if (!printWindow) {
    alert('Please allow popups to print dossiers.');
    return;
  }

  const refNumber = referenceNumber || generateInstitutionalRef('NH-DOS');

  const metaHtml = metadata && Object.keys(metadata).length > 0
    ? Object.entries(metadata).map(([k, v]) => `
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 8px 12px; border-radius: 8px;">
          <div style="font-size: 9px; font-weight: 800; color: #4b5563; text-transform: uppercase;">${k.replace(/([A-Z])/g, ' $1')}</div>
          <div style="font-size: 13px; font-weight: 800; color: #074504; font-family: monospace; margin-top: 2px;">${v}</div>
        </div>
      `).join('')
    : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title} - Neema HEEP Microfinance Official Dossier</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 10mm; }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 24px;
            color: #1f2937;
            margin: 0;
            background: #ffffff;
            font-size: 12px;
          }
          .letterhead-top-bar {
            height: 6px;
            background: #074504;
            border-bottom: 2px solid #C0991B;
            margin: -24px -24px 16px -24px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 12px;
          }
          .brand-col {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo-box {
            width: 68px;
            height: 68px;
            border-radius: 10px;
            border: 2px solid #C0991B;
            padding: 2px;
            background: #fff;
          }
          .logo-box img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
          .brand-title { font-size: 18px; font-weight: 900; color: #074504; text-transform: uppercase; }
          .brand-tagline { font-size: 10px; color: #C0991B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .brand-motto { font-size: 9px; font-style: italic; color: #555; }
          .badge {
            display: inline-block;
            padding: 3px 10px;
            background: #074504;
            color: #C0991B;
            font-size: 9.5px;
            font-weight: 900;
            text-transform: uppercase;
            border-radius: 20px;
            margin-top: 6px;
          }
          .divider-green { height: 2px; background: #074504; margin-top: 6px; }
          .divider-gold { height: 1.5px; background: #C0991B; margin-top: 1.5px; margin-bottom: 12px; }

          .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          .label { font-size: 9.5px; font-weight: 800; color: #6b7280; text-transform: uppercase; }
          .val { font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px; }
          .body-text {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            font-size: 12.5px;
            line-height: 1.7;
            color: #1f2937;
            white-space: pre-wrap;
            margin-top: 16px;
          }

          .seal-stamp {
            border: 2.5px double #074504;
            border-radius: 50%;
            width: 85px;
            height: 85px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #074504;
            transform: rotate(-4deg);
            background: rgba(192, 153, 27, 0.08);
            border-color: #C0991B;
          }
          .footer {
            margin-top: 36px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .letterhead-top-bar { margin: 0 0 16px 0; }
          }
        </style>
      </head>
      <body>
        <div class="letterhead-top-bar"></div>

        <div class="header">
          <div class="brand-col">
            <div class="logo-box">
              <img src="/header_logo.jpeg" alt="Neema HEEP Logo" onerror="this.src='/NEEMA HEEP LOGO.jpeg';" />
            </div>
            <div>
              <div class="brand-title">Neema HEEP Microfinance</div>
              <div class="brand-tagline">Client Dossier & Verified Record</div>
              <div class="brand-motto">"Empowering Communities • Transforming Livelihoods"</div>
              <div class="badge">${category}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="seal-stamp">
              <div style="font-size: 7.5px; font-weight: 900; color: #074504;">NEEMA HEEP</div>
              <div style="font-size: 5.5px; font-weight: 800; color: #C0991B; border-top: 1px solid #C0991B; border-bottom: 1px solid #C0991B; margin: 1px 0; width: 90%;">★ OFFICIAL SEAL ★</div>
              <div style="font-size: 6px; font-weight: 800; color: #074504;">EMBU HQ VERIFIED</div>
            </div>
            <div style="font-size: 10px; color: #6b7280; text-align: right; line-height: 1.5;">
              <div><strong>Ref:</strong> <span style="font-family: monospace; color:#074504;">${refNumber}</span></div>
              <div><strong>Date:</strong> ${date}</div>
              <div>Printed: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div class="divider-green"></div>
        <div class="divider-gold"></div>

        <div class="card">
          <div style="font-size: 15px; font-weight: 900; color: #074504; margin-bottom: 12px;">${title}</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
            <div>
              <div class="label">Client / Applicant Name</div>
              <div class="val">${senderName}</div>
            </div>
            <div>
              <div class="label">Email Address</div>
              <div class="val" style="font-family: monospace;">${senderEmail}</div>
            </div>
            ${senderPhone ? `
            <div>
              <div class="label">Phone Contact</div>
              <div class="val" style="font-family: monospace;">${senderPhone}</div>
            </div>
            ` : ''}
          </div>
        </div>

        ${metaHtml ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 16px;">
          ${metaHtml}
        </div>
        ` : ''}

        <div class="label" style="margin-left: 2px;">Dossier Statement / Application Details</div>
        <div class="body-text">${content}</div>

        <div class="footer">
          Neema HEEP Microfinance | Neema Plaza, 3rd Floor, Mama Ngina Street, Embu | Tel: 0705 759 365 | Email: info@neemaheep.com
          <br />Confidential Client Record • Issued for Institutional Use Only
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

/**
 * Lead dossier booklet multi-item print
 */
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
            <div style="font-size: 8.5px; font-weight: 800; color: #4b5563; text-transform: uppercase;">${k.replace(/([A-Z])/g, ' $1')}</div>
            <div style="font-size: 11px; font-weight: 800; color: #074504; font-family: monospace; margin-top: 1px;">${v}</div>
          </div>
        `).join('')
      : '';

    return `
      <div class="lead-page ${index < items.length - 1 ? 'page-break' : ''}">
        <div class="header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 50px; height: 50px; border-radius: 8px; border: 2px solid #C0991B; padding: 2px; background: #fff;">
              <img src="/header_logo.jpeg" alt="Neema HEEP Logo" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" onerror="this.src='/NEEMA HEEP LOGO.jpeg';" />
            </div>
            <div>
              <div style="font-size: 17px; font-weight: 900; color: #074504; text-transform: uppercase;">Neema HEEP Microfinance</div>
              <div style="font-size: 10px; color: #C0991B; font-weight: 800; text-transform: uppercase;">Client Dossier (#${index + 1} of ${items.length})</div>
              <div style="display: inline-block; padding: 2px 8px; background: #074504; color: #C0991B; font-size: 8.5px; font-weight: 900; border-radius: 12px; margin-top: 3px;">${item.category}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="border: 2px double #074504; border-radius: 50%; width: 75px; height: 75px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #074504; transform: rotate(-4deg); background: rgba(192, 153, 27, 0.08); border-color: #C0991B;">
              <div style="font-size: 7px; font-weight: 900; color: #074504;">NEEMA HEEP</div>
              <div style="font-size: 5px; font-weight: 800; color: #C0991B; border-top: 1px solid #C0991B; border-bottom: 1px solid #C0991B; margin: 1px 0; width: 85%;">★ OFFICIAL SEAL ★</div>
              <div style="font-size: 5.5px; font-weight: 800; color: #074504;">EMBU HQ VERIFIED</div>
            </div>
            <div style="font-size: 9.5px; color: #6b7280; text-align: right; line-height: 1.4;">
              <div><strong>Ref:</strong> <span style="font-family: monospace; color:#074504;">${item.id}</span></div>
              <div><strong>Date:</strong> ${item.date}</div>
              ${item.status ? `<div style="font-weight: 900; color: #074504;">Status: ${item.status}</div>` : ''}
            </div>
          </div>
        </div>

        <div style="height: 2px; background: #074504; margin-top: 6px;"></div>
        <div style="height: 1.5px; background: #C0991B; margin-top: 1.5px; margin-bottom: 12px;"></div>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 13.5px; font-weight: 900; color: #074504; margin-bottom: 8px;">${item.title}</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div>
              <div style="font-size: 8.5px; font-weight: 800; color: #6b7280; text-transform: uppercase;">Client Name</div>
              <div style="font-size: 11.5px; font-weight: 800; color: #111827; margin-top: 1px;">${item.senderName}</div>
            </div>
            <div>
              <div style="font-size: 8.5px; font-weight: 800; color: #6b7280; text-transform: uppercase;">Email Address</div>
              <div style="font-size: 11.5px; font-weight: 800; color: #111827; margin-top: 1px; font-family: monospace;">${item.senderEmail}</div>
            </div>
            <div>
              <div style="font-size: 8.5px; font-weight: 800; color: #6b7280; text-transform: uppercase;">Phone Number</div>
              <div style="font-size: 11.5px; font-weight: 800; color: #111827; margin-top: 1px; font-family: monospace;">${item.senderPhone || 'N/A'}</div>
            </div>
          </div>
        </div>

        ${metaHtml ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-bottom: 12px; background: #f3f4f6; padding: 10px; border-radius: 8px;">
          ${metaHtml}
        </div>
        ` : ''}

        <div style="font-size: 9px; font-weight: 800; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Inquiry / Case Summary</div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; font-size: 11.5px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${item.content}</div>

        <div style="margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 8.5px; color: #9ca3af; text-align: center;">
          Neema HEEP Microfinance | Page ${index + 1} of ${items.length} | Neema Plaza, Mama Ngina St, Embu | Tel: 0705 759 365
        </div>
      </div>
    `;
  }).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title} - Neema HEEP Microfinance</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 10mm; }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 20px;
            color: #1f2937;
            margin: 0;
            background: #ffffff;
          }
          .lead-page { padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px dashed #d1d5db; }
          .page-break { page-break-after: always; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; }
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
            }, 350);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
