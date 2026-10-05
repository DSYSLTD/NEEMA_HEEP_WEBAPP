import writeXlsxFile from 'write-excel-file/browser';
import Papa from 'papaparse';

export interface ColumnDef {
  key: string;
  label: string;
  type?: 'string' | 'number' | 'date';
}

export interface SummaryMetric {
  label: string;
  value: string | number;
  change?: string;
  color?: string;
}

/**
 * Sanitizes a cell value to prevent CSV / Excel formula injection.
 * If user text starts with =, +, -, @, \t, or \r, prepend a single quote (').
 */
export function sanitizeCellValue(val: any): string {
  if (val === null || val === undefined) return '';
  let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  const trimmed = str.trimStart();
  if (trimmed.length > 0 && ['=', '+', '-', '@', '\t', '\r'].includes(trimmed[0])) {
    return `'${str}`;
  }
  return str;
}

/**
 * Export data to true Excel (.xlsx) file with styled forest green bold header row.
 * Automatically falls back to UTF-8 BOM CSV if xlsx encoding encounters any issues.
 */
export async function downloadExcel(
  filename: string,
  columns: ColumnDef[],
  rows: any[]
): Promise<void> {
  const cleanFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}`;

  try {
    const headerRow = columns.map(col => ({
      value: col.label,
      fontWeight: 'bold',
      backgroundColor: '#074504',
      color: '#FFFFFF'
    }));

    const dataRows = rows.map(row =>
      columns.map(col => {
        let val = row[col.key];
        const sanitized = sanitizeCellValue(val);
        return {
          value: sanitized
        };
      })
    );

    const schema = [headerRow, ...dataRows];

    const result = (writeXlsxFile as any)(schema);
    if (result && typeof result.toFile === 'function') {
      await result.toFile(`${cleanFilename}.xlsx`);
    } else if (result && typeof result.then === 'function') {
      await result;
    } else {
      downloadCSV(cleanFilename, columns, rows);
    }
  } catch (err) {
    console.warn("Falling back to Excel-compatible CSV export:", err);
    downloadCSV(cleanFilename, columns, rows);
  }
}

/**
 * Export data to UTF-8 BOM CSV with formula injection protection that opens
 * seamlessly in Microsoft Excel, LibreOffice, and Google Sheets.
 */
export function downloadCSV(
  filename: string,
  columns: ColumnDef[],
  rows: any[]
): void {
  const cleanFilename = filename.endsWith('.csv') ? filename.replace(/\.csv$/, '') : filename;
  const formattedRows = rows.map(row => {
    const item: Record<string, any> = {};
    columns.forEach(col => {
      let val = row[col.key];
      item[col.label] = sanitizeCellValue(val);
    });
    return item;
  });

  const csv = Papa.unparse(formattedRows);
  // Prepend UTF-8 BOM for Microsoft Excel auto-detection
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanFilename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Backward compatibility alias
export const downloadExcelCSV = downloadCSV;
