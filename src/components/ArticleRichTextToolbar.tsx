import React, { useState } from 'react';
import {
  Bold, Italic, Underline, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Table, Link as LinkIcon,
  RotateCcw, RotateCw, Search, Maximize2, Minimize2,
  Palette, Paintbrush, Type, Check, X, RefreshCw
} from 'lucide-react';

export interface ArticleRichTextToolbarProps {
  content: string;
  onChange: (newContent: string) => void;
  placeholder?: string;
  blockType?: string;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function ArticleRichTextToolbar({
  content,
  onChange,
  placeholder = 'Write content here...',
  blockType = 'paragraph',
  showToast,
}: ArticleRichTextToolbarProps) {
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [fontSize, setFontSize] = useState('14px');
  const [textColor, setTextColor] = useState('#111827');
  const [bgColor, setBgColor] = useState('transparent');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper to update state and record undo history
  const updateContent = (newVal: string) => {
    onChange(newVal);
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(newVal);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      onChange(prev);
      if (showToast) showToast('Undo action', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      onChange(next);
      if (showToast) showToast('Redo action', 'info');
    }
  };

  const applyWrap = (prefix: string, suffix: string, defaultTxt: string = 'text') => {
    updateContent(`${content} ${prefix}${defaultTxt}${suffix} `);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g. https://neemaheep.org):', 'https://');
    if (url) {
      const label = prompt('Enter link label:', 'Click here');
      updateContent(`${content} [${label || 'Link'}](${url})`);
      if (showToast) showToast('Link inserted', 'success');
    }
  };

  const handleInsertTable = () => {
    const tableMd = `\n\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Data Cell 1 | Data Cell 2 | Data Cell 3 |\n| Data Cell 4 | Data Cell 5 | Data Cell 6 |\n\n`;
    updateContent(content + tableMd);
    if (showToast) showToast('3x2 Table inserted', 'success');
  };

  const handleInsertList = (type: 'bullet' | 'number' | 'check') => {
    if (type === 'bullet') {
      updateContent(`${content}\n• Item 1\n• Item 2\n• Item 3\n`);
    } else if (type === 'number') {
      updateContent(`${content}\n1. First item\n2. Second item\n3. Third item\n`);
    } else {
      updateContent(`${content}\n[ ] Pending action item\n[x] Completed impact milestone\n`);
    }
    if (showToast) showToast(`Inserted ${type} list`, 'info');
  };

  const handleFindReplace = () => {
    if (!findQuery) return;
    if (!content.includes(findQuery)) {
      if (showToast) showToast(`"${findQuery}" not found in content`, 'error');
      return;
    }
    const updated = content.split(findQuery).join(replaceQuery);
    updateContent(updated);
    if (showToast) showToast(`Replaced occurrences of "${findQuery}" with "${replaceQuery}"`, 'success');
  };

  const textColors = [
    { name: 'Default Dark', value: '#111827' },
    { name: 'Brand Green', value: '#074504' },
    { name: 'Brand Gold', value: '#C0991B' },
    { name: 'Muted Gray', value: '#4B5563' },
    { name: 'Ruby Red', value: '#DC2626' },
    { name: 'Sapphire Blue', value: '#2563EB' },
  ];

  const bgColors = [
    { name: 'None', value: 'transparent' },
    { name: 'Gold Highlight', value: '#FEF3C7' },
    { name: 'Green Highlight', value: '#D1FAE5' },
    { name: 'Blue Highlight', value: '#DBEAFE' },
    { name: 'Amber Soft', value: '#FFEDD5' },
  ];

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 p-6 bg-white flex flex-col space-y-4 overflow-y-auto animate-in zoom-in-95 duration-200'
    : 'space-y-2';

  return (
    <div className={containerClasses}>
      {/* Top Rich Text Formatting Toolbar */}
      <div className="p-2.5 rounded-2xl border flex flex-wrap items-center justify-between gap-1.5 transition-all bg-gradient-to-r from-gray-50 via-amber-50/30 to-emerald-50/20 border-gray-200 shadow-xs">
        {/* Formatting Group: Bold, Italic, Underline, Highlight */}
        <div className="flex items-center gap-1 border-r border-gray-200/80 pr-2">
          <button
            type="button"
            onClick={() => applyWrap('**', '**', 'bold text')}
            className="p-1.5 hover:bg-white hover:text-[#074504] text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('*', '*', 'italic text')}
            className="p-1.5 hover:bg-white hover:text-[#074504] text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<u>', '</u>', 'underlined text')}
            className="p-1.5 hover:bg-white hover:text-[#074504] text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Underline (<u>text</u>)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyWrap('<mark class="bg-[#C0991B]/30 px-1 rounded">', '</mark>', 'highlighted text')}
            className="p-1.5 hover:bg-[#C0991B] hover:text-white text-[#C0991B] rounded-xl transition-all cursor-pointer bg-amber-50"
            title="Highlight Text"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment Group */}
        <div className="flex items-center gap-1 border-r border-gray-200/80 pr-2">
          <button
            type="button"
            onClick={() => { setAlignment('left'); applyWrap('<div align="left">\n', '\n</div>'); }}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              alignment === 'left' ? 'bg-[#074504] text-white' : 'hover:bg-white text-gray-700'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setAlignment('center'); applyWrap('<div align="center">\n', '\n</div>'); }}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              alignment === 'center' ? 'bg-[#074504] text-white' : 'hover:bg-white text-gray-700'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setAlignment('right'); applyWrap('<div align="right">\n', '\n</div>'); }}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              alignment === 'right' ? 'bg-[#074504] text-white' : 'hover:bg-white text-gray-700'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setAlignment('justify'); applyWrap('<div align="justify">\n', '\n</div>'); }}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              alignment === 'justify' ? 'bg-[#074504] text-white' : 'hover:bg-white text-gray-700'
            }`}
            title="Align Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1 border-r border-gray-200/80 pr-2">
          <Type className="w-3.5 h-3.5 text-[#C0991B]" />
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="p-1 text-[11px] font-bold border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-[#C0991B]"
          >
            <option value="12px">12px (Small)</option>
            <option value="14px">14px (Regular)</option>
            <option value="16px">16px (Large)</option>
            <option value="18px">18px (XL)</option>
            <option value="24px">24px (Title)</option>
          </select>
        </div>

        {/* Color & Background Picker Popovers */}
        <div className="flex items-center gap-1 border-r border-gray-200/80 pr-2 relative">
          <button
            type="button"
            onClick={() => { setShowColorPicker(!showColorPicker); setShowBgPicker(false); }}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            title="Text Color"
          >
            <Palette className="w-3.5 h-3.5 text-[#074504]" />
            <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: textColor }} />
          </button>

          {showColorPicker && (
            <div className="absolute top-8 left-0 z-20 p-2 bg-white rounded-xl border border-gray-200 shadow-xl flex items-center gap-1.5 animate-in fade-in duration-150">
              {textColors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setTextColor(c.value);
                    applyWrap(`<span style="color: ${c.value}">`, '</span>', 'colored text');
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => { setShowBgPicker(!showBgPicker); setShowColorPicker(false); }}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            title="Background Color"
          >
            <Paintbrush className="w-3.5 h-3.5 text-[#C0991B]" />
            <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: bgColor === 'transparent' ? '#ffffff' : bgColor }} />
          </button>

          {showBgPicker && (
            <div className="absolute top-8 left-6 z-20 p-2 bg-white rounded-xl border border-gray-200 shadow-xl flex items-center gap-1.5 animate-in fade-in duration-150">
              {bgColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setBgColor(c.value);
                    if (c.value !== 'transparent') {
                      applyWrap(`<span style="background-color: ${c.value}">`, '</span>', 'bg highlighted text');
                    }
                    setShowBgPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-[8px]"
                  style={{ backgroundColor: c.value === 'transparent' ? '#ffffff' : c.value }}
                  title={c.name}
                >
                  {c.value === 'transparent' && '×'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lists & Tables */}
        <div className="flex items-center gap-1 border-r border-gray-200/80 pr-2">
          <button
            type="button"
            onClick={() => handleInsertList('bullet')}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertList('number')}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertList('check')}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Checklist"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
          </button>
          <button
            type="button"
            onClick={handleInsertTable}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Insert Table"
          >
            <Table className="w-3.5 h-3.5 text-blue-600" />
          </button>
          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#C0991B]" />
          </button>
        </div>

        {/* History (Undo / Redo) & Search */}
        <div className="flex items-center gap-1 border-r border-gray-200/80 pr-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIdx === 0}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 hover:bg-white text-gray-700 rounded-xl transition-all disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowFindReplace(!showFindReplace)}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              showFindReplace ? 'bg-[#C0991B] text-white' : 'hover:bg-white text-gray-700'
            }`}
            title="Find & Replace"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-[#074504] hover:text-white text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Toggle Fullscreen Editor"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Find & Replace Drawer */}
      {showFindReplace && (
        <div className="p-3 bg-amber-50 border border-[#C0991B]/40 rounded-2xl flex flex-col sm:flex-row items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex-1 flex items-center gap-2 w-full">
            <span className="text-[10px] font-black uppercase text-[#074504] shrink-0">Find:</span>
            <input
              type="text"
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              placeholder="Search term..."
              className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded-lg bg-white"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 w-full">
            <span className="text-[10px] font-black uppercase text-[#074504] shrink-0">Replace:</span>
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replacement text..."
              className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded-lg bg-white"
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleFindReplace}
              className="px-3 py-1 bg-[#074504] text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#C0991B]" /> Replace All
            </button>
            <button
              type="button"
              onClick={() => setShowFindReplace(false)}
              className="p-1 text-gray-500 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Rich Text Textarea Canvas */}
      <div className="relative rounded-2xl border transition-all bg-white border-gray-200 p-3 focus-within:ring-2 focus-within:ring-[#074504]">
        <textarea
          rows={isFullscreen ? 20 : blockType === 'heading' ? 2 : blockType === 'paragraph' ? 6 : 3}
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder={placeholder}
          style={{
            fontSize,
            color: textColor,
            backgroundColor: bgColor,
            textAlign: alignment,
          }}
          className="w-full font-sans font-medium outline-none resize-y leading-relaxed"
        />
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] font-bold text-gray-400">
          <span className="flex items-center gap-1">
            <Type className="w-3 h-3 text-[#C0991B]" /> {content.length} characters | {content.split(/\s+/).filter(Boolean).length} words
          </span>
          <span>Rich Text Enabled</span>
        </div>
      </div>
    </div>
  );
}
