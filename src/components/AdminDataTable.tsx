import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Download, FileSpreadsheet, 
  FileText, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, Eye, Edit3, Trash2, 
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { ColumnDef, downloadExcel, downloadCSV } from '../lib/excelReportExport';
import ReportModal from './ReportModal';

export interface AdminColumnDef<T = any> extends ColumnDef {
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface AdminFilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}

export interface AdminDataTableProps<T = any> {
  title: string;
  moduleName: string;
  submoduleName: string;
  columns: AdminColumnDef<T>[];
  data: T[];
  loading?: boolean;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  searchFields?: (keyof T | string)[];
  filters?: AdminFilterGroup[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (filterKey: string, value: string) => void;
  pageSize?: number;
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  rowActions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    customActions?: {
      label: string;
      icon: React.ReactNode;
      onClick: (row: T) => void;
      className?: string;
    }[];
  };
  summaryMetrics?: { label: string; value: string | number; color?: string }[];
  emptyMessage?: string;
}

export function AdminDataTable<T extends Record<string, any>>({
  title,
  moduleName,
  submoduleName,
  columns,
  data,
  loading = false,
  onRefresh,
  searchPlaceholder = 'Search records...',
  searchFields = [],
  filters = [],
  activeFilters = {},
  onFilterChange,
  pageSize = 10,
  primaryAction,
  rowActions,
  summaryMetrics = [],
  emptyMessage = 'No matching records found in database.'
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    filters.forEach(f => {
      init[f.key] = activeFilters[f.key] || f.defaultValue || 'All';
    });
    return init;
  });

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);

  // Sync external filters
  React.useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      setLocalFilters(prev => ({ ...prev, ...activeFilters }));
    }
  }, [activeFilters]);

  const handleFilterSelect = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  // Filter and Search logic
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fieldsToSearch = searchFields.length > 0 
          ? searchFields 
          : columns.map(c => c.key);
        
        const match = fieldsToSearch.some(field => {
          const val = row[field as string];
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
          return String(val).toLowerCase().includes(q);
        });

        if (!match) return false;
      }

      // 2. Filter Groups
      for (const [fKey, fVal] of Object.entries(localFilters)) {
        if (!fVal || fVal === 'All' || fVal === 'ALL') continue;
        const rowVal = row[fKey];
        if (rowVal === null || rowVal === undefined) return false;
        if (String(rowVal).toLowerCase() !== String(fVal).toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, localFilters, searchFields, columns]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('desc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleExportExcel = () => {
    downloadExcel(`${submoduleName}_Export`, columns, sortedData);
  };

  const handleExportCSV = () => {
    downloadCSV(`${submoduleName}_Export`, columns, sortedData);
  };

  // Compile active filter description for report header
  const filterDesc = useMemo(() => {
    const parts: string[] = [];
    if (searchQuery.trim()) parts.push(`Search: "${searchQuery}"`);
    Object.entries(localFilters).forEach(([k, v]) => {
      if (v && v !== 'All') {
        const filterGroup = filters.find(f => f.key === k);
        parts.push(`${filterGroup?.label || k}: ${v}`);
      }
    });
    return parts.length > 0 ? parts.join(' | ') : 'All Records (No Filters)';
  }, [searchQuery, localFilters, filters]);

  return (
    <div className="space-y-4">
      
      {/* Top Action & Filter Toolbar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        
        {/* Row 1: Title, Counts & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-[#074504] uppercase tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                {sortedData.length} of {data.length} records
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Live database connection to Supabase • Filter, inspect, and export verified records.
            </p>
          </div>

          {/* Action Buttons: Excel, CSV, Report, + Primary */}
          <div className="flex items-center gap-2 flex-wrap">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                title="Refresh Table from Database"
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#074504]' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200"
            >
              <Download className="w-3.5 h-3.5 text-[#074504]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="px-3.5 py-2 bg-white/80 hover:bg-white text-[#074504] border border-[#074504]/30 font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Print Report</span>
            </button>

            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="px-4 py-2 bg-[#C0991B] hover:bg-[#a98514] text-[#074504] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ml-1"
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Search Input & Filter Dropdowns */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-[#C0991B] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {filters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#C0991B]" /> Filters:
              </span>
              {filters.map(filter => (
                <div key={filter.key} className="flex items-center gap-1.5">
                  <select
                    value={localFilters[filter.key] || 'All'}
                    onChange={e => handleFilterSelect(filter.key, e.target.value)}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504] outline-none cursor-pointer focus:border-[#C0991B]"
                  >
                    <option value="All">{filter.label}: All</option>
                    {filter.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#074504] animate-spin" />
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Fetching records from Supabase...
            </p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-black text-gray-700 uppercase">{emptyMessage}</p>
            <p className="text-xs text-gray-400 font-medium">
              Try adjusting your search terms or clearing active filters to see more results.
            </p>
            {(searchQuery || Object.values(localFilters).some(v => v !== 'All')) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  const reset: Record<string, string> = {};
                  filters.forEach(f => reset[f.key] = 'All');
                  setLocalFilters(reset);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#074504] text-[#C0991B] text-[10px] font-black uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">#</th>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      className={`p-4 ${col.sortable !== false ? 'cursor-pointer select-none hover:bg-[#053203]' : ''} ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className={`flex items-center gap-1.5 ${
                        col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{col.label}</span>
                        {col.sortable !== false && (
                          sortKey === col.key ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-[#C0991B]" /> : <ArrowDown className="w-3 h-3 text-[#C0991B]" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                  {rowActions && (
                    <th className="p-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-800">
                {paginatedData.map((row, idx) => {
                  const absoluteIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={row.id || idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 text-center font-bold text-gray-400 bg-gray-50/30">
                        {absoluteIdx}
                      </td>
                      {columns.map(col => {
                        const cellVal = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`p-4 ${
                              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {col.render ? (
                              col.render(row, idx)
                            ) : (
                              cellVal === null || cellVal === undefined ? (
                                <span className="text-gray-300 italic">—</span>
                              ) : typeof cellVal === 'boolean' ? (
                                cellVal ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">Yes</span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-black uppercase">No</span>
                                )
                              ) : (
                                <span className="font-semibold text-gray-900">{String(cellVal)}</span>
                              )
                            )}
                          </td>
                        );
                      })}
                      {rowActions && (
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {rowActions.onView && (
                              <button
                                type="button"
                                onClick={() => rowActions.onView!(row)}
                                title="View Record Details"
                                className="p-1.5 bg-gray-100 hover:bg-[#074504] hover:text-[#C0991B] rounded-lg text-gray-700 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {rowActions.onEdit && (
                              <button
                                type="button"
                                onClick={() => rowActions.onEdit!(row)}
                                title="Edit Record"
                                className="p-1.5 bg-gray-100 hover:bg-[#C0991B] hover:text-[#074504] rounded-lg text-gray-700 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {rowActions.customActions?.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => act.onClick(row)}
                                title={act.label}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${act.className || 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                              >
                                {act.icon}
                              </button>
                            ))}
                            {rowActions.onDelete && (
                              <button
                                type="button"
                                onClick={() => rowActions.onDelete!(row)}
                                title="Delete Record"
                                className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && sortedData.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-gray-600">
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
              {sortedData.length !== data.length && (
                <span className="text-gray-400 font-normal"> (filtered from {data.length} total)</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-black text-[#074504]">
                Page {currentPage} of {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formal Management Audit & Reporting Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={`${title} Management Report`}
        moduleName={moduleName}
        submoduleName={submoduleName}
        summaryMetrics={summaryMetrics}
        columns={columns}
        data={sortedData}
        filterDescription={filterDesc}
      />

    </div>
  );
}
export default AdminDataTable;
