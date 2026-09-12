import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Crop, RotateCw, FlipHorizontal, FlipVertical, Sliders, 
  Save, Undo, Redo, Eye, Image as ImageIcon, 
  Check, Lock, Unlock, ShieldAlert 
} from 'lucide-react';
import { MediaItem, ImageEditOptions } from '../../types/dam';

interface Props {
  media: MediaItem;
  onClose: () => void;
  onSave: (updatedItem: MediaItem, newImageDataUrl?: string) => void;
}

export function ImageEditorModal({ media, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust' | 'watermark'>('crop');
  
  // Transform & Adjust States
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3' | '3:2' | '9:16'>('free');
  
  // Watermark
  const [watermarkText, setWatermarkText] = useState('Neema HEEP Official');
  const [watermarkPos, setWatermarkPos] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'center'>('bottom-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [enableWatermark, setEnableWatermark] = useState(false);

  // Preview / Before-After
  const [showOriginal, setShowOriginal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Canvas with Filters & Transforms
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = media.src;

    img.onload = () => {
      // Dimensions
      const w = img.width;
      const h = img.height;

      canvas.width = rotation % 180 === 0 ? w : h;
      canvas.height = rotation % 180 === 0 ? h : w;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;

      // Transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();

      // Watermark Overlay
      if (enableWatermark && watermarkText.trim()) {
        ctx.save();
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 8;

        const textWidth = ctx.measureText(watermarkText).width;
        let x = canvas.width - textWidth - 30;
        let y = canvas.height - 30;

        if (watermarkPos === 'bottom-left') {
          x = 30;
          y = canvas.height - 30;
        } else if (watermarkPos === 'top-right') {
          x = canvas.width - textWidth - 30;
          y = 50;
        } else if (watermarkPos === 'center') {
          x = (canvas.width - textWidth) / 2;
          y = canvas.height / 2;
        }

        ctx.fillText(watermarkText, x, y);
        ctx.restore();
      }
    };
  }, [media.src, rotation, flipH, flipV, brightness, contrast, saturation, blur, enableWatermark, watermarkText, watermarkPos, watermarkOpacity]);

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setEnableWatermark(false);
  };

  const handleSaveEditedImage = (asNewCopy = false) => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/webp', 0.92);
      
      const updatedItem: MediaItem = {
        ...media,
        displayName: asNewCopy ? `${media.displayName} (Edited)` : media.displayName,
        status: 'Optimized',
        formattedSize: '1.20 MB',
        webpUrl: dataUrl,
        src: dataUrl,
        thumbnailUrl: dataUrl
      };

      setTimeout(() => {
        setIsProcessing(false);
        onSave(updatedItem, dataUrl);
      }, 500);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200">
        {/* Editor Top Bar */}
        <div className="bg-[#074504] text-white p-4 px-6 flex items-center justify-between border-b border-[#C0991B]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C0991B] text-[#074504] flex items-center justify-center font-black">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Canvas Image Editor & Optimizer
              </h3>
              <p className="text-[11px] text-[#C0991B] font-medium truncate max-w-sm">
                Editing: {media.displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              title="Hold to view original unedited asset"
            >
              <Eye className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Hold for Before</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Main Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden bg-gray-900">
          {/* Canvas Viewport Area */}
          <div className="md:col-span-2 p-6 flex items-center justify-center relative overflow-hidden bg-slate-950/90">
            {showOriginal ? (
              <img
                src={media.src}
                alt="Original"
                className="max-h-[65vh] max-w-full object-contain shadow-2xl rounded-lg"
              />
            ) : (
              <canvas
                ref={canvasRef}
                className="max-h-[65vh] max-w-full object-contain shadow-2xl rounded-lg border border-white/10"
              />
            )}

            {showOriginal && (
              <div className="absolute top-4 left-4 bg-[#C0991B] text-[#074504] text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                Original Unedited Asset
              </div>
            )}
          </div>

          {/* Tools & Controls Sidebar */}
          <div className="bg-white p-6 border-l border-gray-200 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Tool Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-2xl text-xs font-extrabold">
                <button
                  onClick={() => setActiveTab('crop')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'crop' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Crop className="w-3.5 h-3.5" /> Transform
                </button>
                <button
                  onClick={() => setActiveTab('adjust')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'adjust' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Adjust
                </button>
                <button
                  onClick={() => setActiveTab('watermark')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'watermark' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Watermark
                </button>
              </div>

              {/* Transform Controls Tab */}
              {activeTab === 'crop' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Rotation & Flip
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-[#074504] flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" /> 90°
                    </button>
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`p-2.5 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        flipH ? 'bg-emerald-100 border-[#074504] text-[#074504]' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" /> Flip H
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`p-2.5 border rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        flipV ? 'bg-emerald-100 border-[#074504] text-[#074504]' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" /> Flip V
                    </button>
                  </div>

                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider pt-2">
                    Aspect Ratio Lock
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs font-extrabold">
                    {['free', '1:1', '16:9', '4:3', '3:2', '9:16'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio as any)}
                        className={`p-2 rounded-xl border text-center transition-all uppercase cursor-pointer ${
                          aspectRatio === ratio
                            ? 'bg-[#074504] text-white border-[#074504]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjustments Tab */}
              {activeTab === 'adjust' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-gray-800 mb-1">
                      <span>Brightness</span>
                      <span className="text-[#074504] font-mono">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-[#074504]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-gray-800 mb-1">
                      <span>Contrast</span>
                      <span className="text-[#074504] font-mono">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-[#074504]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-gray-800 mb-1">
                      <span>Saturation</span>
                      <span className="text-[#074504] font-mono">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-[#074504]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-gray-800 mb-1">
                      <span>Blur</span>
                      <span className="text-[#074504] font-mono">{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-[#074504]"
                    />
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Reset All Adjustments
                  </button>
                </div>
              )}

              {/* Watermark Tab */}
              {activeTab === 'watermark' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-900 uppercase tracking-wide">
                      Enable Watermark
                    </label>
                    <input
                      type="checkbox"
                      checked={enableWatermark}
                      onChange={(e) => setEnableWatermark(e.target.checked)}
                      className="w-4 h-4 accent-[#074504] rounded cursor-pointer"
                    />
                  </div>

                  {enableWatermark && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full p-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Position
                        </label>
                        <select
                          value={watermarkPos}
                          onChange={(e) => setWatermarkPos(e.target.value as any)}
                          className="w-full p-2.5 text-xs font-medium border border-gray-200 rounded-xl"
                        >
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="center">Center Overlay</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                          <span>Opacity</span>
                          <span>{watermarkOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                          className="w-full accent-[#074504]"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Save Buttons Footer */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => handleSaveEditedImage(false)}
                disabled={isProcessing}
                className="w-full py-3 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-[#C0991B]/40 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Exporting WebP...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#C0991B]" />
                    <span>Overwrite & Save WebP</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSaveEditedImage(true)}
                disabled={isProcessing}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Save as New Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
