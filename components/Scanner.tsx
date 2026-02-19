
import React, { useState, useRef } from 'react';
import { recognizeFood } from '../services/geminiService';
import { FoodItem } from '../types';

interface ScannerProps {
  onFoodLogged: (item: FoodItem) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onFoodLogged, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<Partial<FoodItem> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setIsProcessing(true);
    try {
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const foodData = await recognizeFood(base64Data);
      setResult(foodData);
    } catch (err) {
      alert("Failed to recognize food. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmLog = () => {
    if (result) {
      onFoodLogged({
        id: Date.now().toString(),
        name: result.name || 'Unknown Food',
        calories: result.calories || 0,
        protein: result.protein || 0,
        carbs: result.carbs || 0,
        fat: result.fat || 0,
        ingredients: result.ingredients || [],
        timestamp: Date.now(),
        imageUrl: previewUrl || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950 transition-colors">
      {/* Simple Header */}
      <div className="p-6 flex justify-between items-center relative z-20 shrink-0">
        <button 
          onClick={onCancel} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 active:scale-90 transition-all"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <span className="font-black text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
          Analyze Food
        </span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center p-6 space-y-8 pb-32">
          {!previewUrl ? (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <div className="w-48 h-48 bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] flex items-center justify-center mb-10 border border-emerald-100 dark:border-emerald-900/20">
                <i className="fa-solid fa-camera-viewfinder text-5xl text-emerald-500"></i>
              </div>
              
              <div className="space-y-2 mb-10">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Food Vision AI</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Snap a photo to see nutritional facts instantly.</p>
              </div>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black py-4 px-8 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                <i className="fa-solid fa-camera"></i>
                Select Photo
              </button>
              
              <input type="file" ref={fileInputRef} onChange={handleCapture} accept="image/*" capture="environment" className="hidden" />
            </div>
          ) : (
            <div className="w-full space-y-8 animate-fadeIn">
              {/* Simplified Image Preview Container */}
              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <img src={previewUrl} className={`w-full h-full object-cover transition-all duration-500 ${isProcessing ? 'blur-[2px] opacity-70 grayscale-[0.2]' : 'opacity-100'}`} />
                
                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-[4px]">
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest animate-pulse">Analyzing...</p>
                  </div>
                )}
              </div>

              {result && !isProcessing && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 space-y-8 animate-fadeIn border border-slate-50 dark:border-slate-800 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Identified Meal</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{result.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-emerald-600 dark:text-emerald-400 font-black text-xl">{result.calories}</span>
                       <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Kcal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">Protein</p>
                        <p className="font-black text-slate-800 dark:text-white text-lg">{result.protein}g</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">Carbs</p>
                        <p className="font-black text-slate-800 dark:text-white text-lg">{result.carbs}g</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">Fat</p>
                        <p className="font-black text-slate-800 dark:text-white text-lg">{result.fat}g</p>
                     </div>
                  </div>

                  {result.ingredients && result.ingredients.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Main Ingredients</p>
                      <div className="flex flex-wrap gap-2">
                        {result.ingredients.map((ing, i) => (
                          <span key={i} className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                     <button 
                      onClick={() => { setPreviewUrl(null); setResult(null); }}
                      className="flex-1 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                     >
                       Retry
                     </button>
                     <button 
                      onClick={confirmLog}
                      className="flex-[2] py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                     >
                       Add to Diary
                     </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
