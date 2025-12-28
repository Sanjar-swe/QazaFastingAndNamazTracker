import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PRAYERS, PrayerType } from './types';
import { convertDaysToTime, exportData, importData } from './utils';
import { Check, Plus, Minus, Flower, Edit2, X, Calendar, ChevronDown, Sprout, Leaf, TreeDeciduous, TreePine, Trees, Settings, Download, Upload, Info, Menu } from './icons';

export default function App() {
  // --- STATE ---
  
  // Namaz State
  const [totalNamazDays, setTotalNamazDays] = useState<number>(() => {
    const saved = localStorage.getItem('qaza_total_days');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedPrayersFull, setCompletedPrayersFull] = useState<PrayerType[]>(() => {
    const saved = localStorage.getItem('qaza_current_progress_full');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedPrayersKasr, setCompletedPrayersKasr] = useState<PrayerType[]>(() => {
    const saved = localStorage.getItem('qaza_current_progress_kasr');
    return saved ? JSON.parse(saved) : [];
  });

  const [isKasr, setIsKasr] = useState<boolean>(() => {
    const saved = localStorage.getItem('qaza_is_kasr');
    return saved === 'true';
  });

  // Fasting State
  const [fastingDays, setFastingDays] = useState<number>(() => {
    const saved = localStorage.getItem('qaza_fasting_days');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [missedRamadans, setMissedRamadans] = useState<number>(() => {
    const saved = localStorage.getItem('qaza_missed_ramadans');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Date Range State (only for Namaz now)
  const [dates, setDates] = useState(() => {
    const saved = localStorage.getItem('qaza_dates');
    return saved ? JSON.parse(saved) : {
      namazStart: '',
      namazEnd: ''
    };
  });

  const [showSettings, setShowSettings] = useState<'namaz' | 'fasting' | null>(null);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [highlightEdit, setHighlightEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('qaza_total_days', totalNamazDays.toString()); }, [totalNamazDays]);
  useEffect(() => { localStorage.setItem('qaza_current_progress_full', JSON.stringify(completedPrayersFull)); }, [completedPrayersFull]);
  useEffect(() => { localStorage.setItem('qaza_current_progress_kasr', JSON.stringify(completedPrayersKasr)); }, [completedPrayersKasr]);
  useEffect(() => { localStorage.setItem('qaza_is_kasr', isKasr.toString()); }, [isKasr]);
  useEffect(() => { localStorage.setItem('qaza_fasting_days', fastingDays.toString()); }, [fastingDays]);
  useEffect(() => { localStorage.setItem('qaza_missed_ramadans', missedRamadans.toString()); }, [missedRamadans]);
  useEffect(() => { localStorage.setItem('qaza_dates', JSON.stringify(dates)); }, [dates]);

  // --- EFFECT: Edit Icon Attention ---
  useEffect(() => {
    // If dates are empty, trigger attention animation after 7 seconds
    const hasNamazDates = dates.namazStart && dates.namazEnd;
    const hasFastingData = missedRamadans > 0;
    
    if (!hasNamazDates || !hasFastingData) {
      const timer = setTimeout(() => {
        setHighlightEdit(true);
        // Stop animating after a while to not be annoying
        setTimeout(() => setHighlightEdit(false), 5000); 
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []); // Run once on mount

  // --- HANDLERS ---
  const togglePrayer = (id: PrayerType) => {
    if (isKasr) {
      setCompletedPrayersKasr(prev => {
        if (prev.includes(id)) return prev.filter(p => p !== id);
        return [...prev, id];
      });
    } else {
      setCompletedPrayersFull(prev => {
        if (prev.includes(id)) return prev.filter(p => p !== id);
        return [...prev, id];
      });
    }
  };

  const handleNamazChange = (delta: number) => {
    setTotalNamazDays(prev => Math.max(0, prev + delta));
  };

  const handleFastingChange = (delta: number) => {
    setFastingDays(prev => Math.max(0, prev + delta));
  };

  const updateDate = (field: string, value: string) => {
    setDates(prev => ({ ...prev, [field]: value }));
    // If user interacts, stop highlighting
    setHighlightEdit(false);
  };

  const handleExportData = () => {
    exportData();
    setShowAppMenu(false);
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      alert('Data imported successfully! The page will reload.');
      window.location.reload();
    } catch (error) {
      alert('Failed to import data. Please check the file and try again.');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAppMenu(false);
  };

  // Auto-increment Namaz day
  useEffect(() => {
    if (completedPrayersFull.length === 6) {
      const timer = setTimeout(() => {
        setTotalNamazDays(prev => prev + 1);
        setCompletedPrayersFull([]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [completedPrayersFull]);

  useEffect(() => {
    if (completedPrayersKasr.length === 6) {
      const timer = setTimeout(() => {
        setTotalNamazDays(prev => prev + 1);
        setCompletedPrayersKasr([]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [completedPrayersKasr]);

  // --- CALCULATIONS ---
  const getDaysDiff = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // Simplified calculation for Fasting: 30 days per Ramadan
  const getFastingDebt = () => {
    return missedRamadans * 30;
  };

  // Progress Date Calculation (Reverse Chronological: End Date MINUS completed days)
  const getProgressDate = () => {
    // We use namazEnd as the starting point for calculating backwards
    if (!dates.namazEnd) return null;
    const end = new Date(dates.namazEnd);
    if (isNaN(end.getTime())) return null;
    
    // Subtract totalNamazDays from the end date to see "how far back" we have reached
    const reached = new Date(end);
    reached.setDate(end.getDate() - totalNamazDays);
    
    return reached.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
  };

  // Progress Ramadan Calculation for Fasting
  const getFastingProgressRamadan = () => {
    if (missedRamadans === 0) return null;
    
    // Calculate how many Ramadans have been completed
    const completedRamadans = Math.floor(fastingDays / 30);
    const remainingRamadans = missedRamadans - completedRamadans;
    
    if (remainingRamadans <= 0) return 'All Ramadans Completed!';
    return `${remainingRamadans} Ramadan${remainingRamadans > 1 ? 's' : ''} left`;
  };

  const progressDate = getProgressDate();
  const fastingProgressRamadan = getFastingProgressRamadan();

  const totalNamazDebt = getDaysDiff(dates.namazStart, dates.namazEnd);
  const remainingNamaz = Math.max(0, totalNamazDebt - totalNamazDays);
  const namazTimeDisplay = totalNamazDebt > 0 ? convertDaysToTime(remainingNamaz) : { years: 0, months: 0, days: 0 };

  const totalFastingDebt = getFastingDebt();
  const remainingFasting = Math.max(0, totalFastingDebt - fastingDays);
  const fastingTimeDisplay = totalFastingDebt > 0 ? convertDaysToTime(remainingFasting) : { years: 0, months: 0, days: 0 };

  return (
    <div className="min-h-screen bg-islamic-50 text-slate-800 font-sans selection:bg-islamic-200 overflow-x-hidden relative">
      
      {/* Background Decorations (Randomly placed) */}
      <BackgroundDecorations />

      <div className="max-w-md mx-auto min-h-screen flex flex-col relative px-4 py-6 z-10">
        
        {/* App Menu removed as per user request */}

        {/* Header - Timelines (Swapped: Fasting Left, Namaz Right) */}
        <header className="grid grid-cols-2 gap-4 mb-8 animate-fade-in-down">
          
           {/* Fasting Timeline (Left) - WHITE BACKGROUND */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xl shadow-slate-100 border border-white flex flex-col items-center justify-center group pt-6 pb-5">
            <button 
              onClick={() => setShowSettings('fasting')}
              className={`absolute top-2 right-2 bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-full z-20 transition-all active:scale-95 shadow-sm ${highlightEdit && missedRamadans === 0 ? 'animate-wink ring-2 ring-amber-300' : ''}`}
            >
              <Edit2 size={14} strokeWidth={2.5} />
            </button>

            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-white to-amber-50/50 pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-100/30 blur-2xl rounded-full pointer-events-none"></div>

            <h2 className="relative z-10 text-amber-500/80 text-[10px] font-bold uppercase tracking-widest mb-2">
              Fasting Left
            </h2>
            <div className="relative z-10 flex items-start space-x-1.5 rtl:space-x-reverse">
              <TimeUnit value={fastingTimeDisplay.years} label="Yrs" textColor="text-slate-700" labelColor="text-slate-400" />
              <div className="pt-1 text-slate-200 text-sm font-light italic">/</div>
              <TimeUnit value={fastingTimeDisplay.months} label="Mos" textColor="text-slate-700" labelColor="text-slate-400" />
              <div className="pt-1 text-slate-200 text-sm font-light italic">/</div>
              <TimeUnit value={fastingTimeDisplay.days} label="Days" textColor="text-slate-700" labelColor="text-slate-400" />
            </div>
          </div>

          {/* Namaz Timeline (Right) - GRADIENT BACKGROUND */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-islamic-500 to-islamic-600 p-4 shadow-xl shadow-islamic-200/50 flex flex-col items-center justify-center group pt-6 pb-5">
             <button 
              onClick={() => setShowSettings('namaz')}
              className={`absolute top-2 right-2 bg-islamic-800/20 hover:bg-islamic-800/30 text-white p-2 rounded-full z-20 transition-all active:scale-95 backdrop-blur-sm ${highlightEdit && !dates.namazStart ? 'animate-wink ring-2 ring-white/50' : ''}`}
            >
               <Edit2 size={14} strokeWidth={2.5} />
            </button>
            
            {/* Glossy effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 blur-xl rounded-full -ml-10 -mb-10 pointer-events-none"></div>

            <h2 className="relative z-10 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-2">
              Namaz Left
            </h2>
            <div className="relative z-10 flex items-start space-x-1.5 rtl:space-x-reverse text-white">
              <TimeUnit value={namazTimeDisplay.years} label="Yrs" />
              <div className="pt-1 text-white/40 text-sm font-light italic">/</div>
              <TimeUnit value={namazTimeDisplay.months} label="Mos" />
              <div className="pt-1 text-white/40 text-sm font-light italic">/</div>
              <TimeUnit value={namazTimeDisplay.days} label="Days" />
            </div>
          </div>

        </header>

        {/* Dual Counters Section (Swapped: Fasting Left, Namaz Right) */}
        <div className="flex justify-center items-start space-x-6 mb-12">
          
           {/* Left: Fasting Counter */}
           <div className="flex flex-col items-center relative z-10">
             <GrowthRing count={fastingDays} type="fasting" />
            <div className="w-36 h-36 rounded-full bg-white shadow-xl shadow-amber-100 flex flex-col items-center justify-center border-4 border-amber-50 z-10 relative">
              <span className="text-4xl font-bold text-amber-600 tabular-nums tracking-tight">
                {fastingDays}
              </span>
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Fasting
              </span>
              
              {/* Fasting Controls */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleFastingChange(-1); }}
                className="absolute -left-2 -bottom-2 z-20 w-10 h-10 rounded-full bg-white text-amber-500 border border-amber-200 shadow-lg flex items-center justify-center active:scale-90 transition-transform hover:bg-amber-50"
                aria-label="Decrease fasting count"
              >
                <Minus size={20} strokeWidth={3} />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handleFastingChange(1); }}
                className="absolute -right-2 -top-2 z-20 w-14 h-14 rounded-full bg-amber-500 text-white border-4 border-white shadow-xl flex items-center justify-center active:scale-90 transition-transform hover:bg-amber-600"
                aria-label="Increase fasting count"
              >
                <Plus size={28} strokeWidth={3} />
              </button>
            </div>
             {/* Fasting Progress Display */}
            <div className="mt-3 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Progress</span>
                <div className="text-base font-semibold text-amber-600 mt-0.5 min-h-[1.5em]">
                    {fastingProgressRamadan || 'Set Ramadans'}
                </div>
            </div>
          </div>

          {/* Right: Namaz Counter */}
          <div className="flex flex-col items-center relative z-10">
            <GrowthRing count={totalNamazDays} type="namaz" />
            <div className="w-36 h-36 rounded-full bg-white shadow-xl shadow-islamic-100 flex flex-col items-center justify-center border-4 border-islamic-50 z-10 relative">
              <span className="text-4xl font-bold text-islamic-600 tabular-nums tracking-tight">
                {totalNamazDays}
              </span>
              <span className="text-islamic-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Namaz
              </span>

              {/* Namaz Controls */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleNamazChange(-1); }}
                className="absolute -left-2 -bottom-2 z-20 w-10 h-10 rounded-full bg-white text-islamic-600 border border-islamic-100 shadow-lg flex items-center justify-center active:scale-90 transition-transform hover:bg-islamic-50"
                aria-label="Decrease namaz count"
              >
                <Minus size={20} strokeWidth={3} />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handleNamazChange(1); }}
                className="absolute -right-2 -top-2 z-20 w-14 h-14 rounded-full bg-islamic-500 text-white border-4 border-white shadow-xl flex items-center justify-center active:scale-90 transition-transform hover:bg-islamic-600"
                aria-label="Increase namaz count"
              >
                <Plus size={28} strokeWidth={3} />
              </button>

            </div>
            {/* Progress Date Display */}
            <div className="mt-3 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recovered back to</span>
                <div className="text-base font-semibold text-islamic-700 mt-0.5 min-h-[1.5em]">
                    {progressDate || 'Set End Date'}
                </div>
            </div>
          </div>

        </div>

        {/* Qasr Switch */}
        <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm py-2 px-5 rounded-full shadow-sm border border-islamic-100">
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors ${!isKasr ? 'text-islamic-700' : 'text-slate-400'}`}>Full</span>
              <button 
                onClick={() => setIsKasr(!isKasr)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isKasr ? 'bg-islamic-500' : 'bg-slate-200'}`}
              >
                <span className="sr-only">Enable Qasr Prayer</span>
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isKasr ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors ${isKasr ? 'text-islamic-700' : 'text-slate-400'}`}>Qasr</span>
            </div>
        </div>

        {/* Prayer Checkpoints Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1 content-start pb-2" dir="rtl">
          {PRAYERS.map((prayer) => {
            const isCompleted = isKasr ? completedPrayersKasr.includes(prayer.id) : completedPrayersFull.includes(prayer.id);
            const rakatCount = isKasr ? prayer.rakatsQasr : prayer.rakatsFull;
            
            return (
              <button
                key={prayer.id}
                onClick={() => togglePrayer(prayer.id)}
                className={`
                  relative overflow-hidden rounded-xl p-4 flex flex-col items-start justify-between h-20 transition-all duration-100 active:scale-95 shadow-sm border
                  ${isCompleted 
                    ? 'bg-islamic-500 border-islamic-600 text-white shadow-islamic-200' 
                    : 'bg-white border-rose-100 text-rose-900 shadow-sm'}
                `}
              >
                {/* Background Decoration for unchecked */}
                {!isCompleted && <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -mr-8 -mt-8 -z-0"></div>}
                
                <div className="flex justify-between w-full items-center z-10">
                  <span className={`font-bold text-base ${isCompleted ? 'text-white' : 'text-slate-700'}`}>
                    {prayer.label}
                  </span>
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors
                    ${isCompleted ? 'bg-white border-white text-islamic-600' : 'border-rose-200 bg-white'}
                  `}>
                    {isCompleted && <Check size={12} strokeWidth={4} />}
                  </div>
                </div>
                
                <div className="mt-auto z-10">
                   <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-islamic-100' : 'text-slate-400'}`}>
                    {rakatCount} Rakats
                   </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative overflow-hidden">
             {/* Decorative Bg */}
            <div className={`absolute top-0 left-0 w-full h-2 ${showSettings === 'namaz' ? 'bg-islamic-500' : 'bg-amber-500'}`}></div>

            <button 
              onClick={() => setShowSettings(null)} 
              className="absolute top-3 right-3 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 z-10 transition-colors active:scale-95"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {showSettings === 'namaz' ? (
              // NAMAZ MODAL - Date Pickers
              <>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-islamic-700 pr-8">
                  <Calendar size={20} />
                  Set Namaz Period
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                       Start of Missed Period
                    </label>
                    <DateSelector 
                      value={dates.namazStart}
                      onChange={(val) => updateDate('namazStart', val)}
                    />
                    <p className="text-[10px] text-slate-400 mt-2 pl-1">e.g., Date of puberty (Baligh)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                       End of Missed Period
                    </label>
                    <DateSelector 
                      value={dates.namazEnd}
                      onChange={(val) => updateDate('namazEnd', val)}
                    />
                    <p className="text-[10px] text-slate-400 mt-2 pl-1">e.g., Date you started praying regularly</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setShowSettings(null)}
                    className="px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-islamic-100 active:scale-95 transition-transform bg-islamic-600 hover:bg-islamic-700"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              // FASTING MODAL - Simple Questions
              <>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-amber-600 pr-8">
                  <Calendar size={20} />
                  Set Fasting Debt
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      How many Ramadan months did you miss after puberty?
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={missedRamadans}
                      onChange={(e) => setMissedRamadans(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 text-slate-700 py-4 px-4 rounded-xl focus:outline-none font-semibold text-2xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                      inputMode="numeric"
                    />
                    <p className="text-xs text-slate-500 mt-2 pl-1">Each Ramadan month = 30 fasting days</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      How many Qaza fasting days have you completed since last Ramadan?
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={fastingDays}
                      onChange={(e) => setFastingDays(Math.max(0, Math.min(30, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 text-slate-700 py-4 px-4 rounded-xl focus:outline-none font-semibold text-2xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                      inputMode="numeric"
                    />
                    <p className="text-xs text-slate-500 mt-2 pl-1">Maximum 30 days (one Ramadan month)</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setShowSettings(null)}
                    className="px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-amber-100 active:scale-95 transition-transform bg-amber-500 hover:bg-amber-600"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* App Menu Dropdown */}
      {showAppMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowAppMenu(false)}>
          <div 
            className="absolute top-20 right-4 bg-white rounded-xl shadow-2xl p-2 w-56 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <Download size={18} className="text-islamic-600" />
              <span className="font-medium text-slate-700">Export Backup</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <Upload size={18} className="text-islamic-600" />
              <span className="font-medium text-slate-700">Import Backup</span>
            </button>
            
            <div className="h-px bg-slate-200 my-2" />
            
            <button
              onClick={() => { setShowAbout(true); setShowAppMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <Info size={18} className="text-islamic-600" />
              <span className="font-medium text-slate-700">About</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportData}
        className="hidden"
      />

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-islamic-500 to-amber-500"></div>

            <button 
              onClick={() => setShowAbout(false)} 
              className="absolute top-3 right-3 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 z-10 transition-colors active:scale-95"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="pr-8">
              <h3 className="text-xl font-bold mb-2 text-islamic-700 flex items-center gap-2">
                <Info size={22} />
                Qaza Tracker
              </h3>
              <p className="text-sm text-slate-500 mb-4">Version 1.0.0</p>

              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  <h4 className="font-bold text-slate-700 mb-1">📿 Track Your Qaza</h4>
                  <p>Keep track of missed prayers (Namaz) and fasting days with ease. Set your missed period and watch your progress grow.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 mb-1">💾 Backup Your Data</h4>
                  <p>Export your progress to a JSON file and import it anytime. Your data is stored locally on your device.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 mb-1">🌙 Works Offline</h4>
                  <p>No internet connection required. All your data stays on your device.</p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-400">
                    Made with ❤️ for the Muslim community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

// --- SUB-COMPONENTS ---

function BackgroundDecorations() {
  const elements = useMemo(() => {
    // Generate static random positions once
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // %
      top: Math.random() * 100, // %
      size: 16 + Math.random() * 24, // px
      rotation: Math.random() * 360,
      opacity: 0.03 + Math.random() * 0.05, // Very low opacity to not interfere with text
      type: Math.floor(Math.random() * 3), // 0: Flower, 1: Leaf, 2: Sprout
      color: Math.random() > 0.5 ? 'text-islamic-300' : 'text-amber-200' // Randomize between theme colors
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute ${el.color}`}
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            transform: `rotate(${el.rotation}deg)`,
            opacity: el.opacity,
            width: el.size,
            height: el.size
          }}
        >
          {el.type === 0 && <Flower size="100%" />}
          {el.type === 1 && <Leaf size="100%" />}
          {el.type === 2 && <Sprout size="100%" />}
        </div>
      ))}
    </div>
  );
}

function DateSelector({ value, onChange }: { value: string, onChange: (date: string) => void }) {
  const currentYear = new Date().getFullYear();
  // Generate ranges
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

  // Parse current value
  // We use UTC parsing to avoid timezone shifts if possible, or just string parsing
  const [yStr, mStr, dStr] = value ? value.split('-') : ['','',''];
  
  const selectedYear = yStr ? parseInt(yStr) : '';
  const selectedMonth = mStr ? parseInt(mStr) - 1 : ''; // 0-indexed for logic
  const selectedDay = dStr ? parseInt(dStr) : '';

  const handleChange = (type: 'day'|'month'|'year', val: string) => {
    let d = typeof selectedDay === 'number' ? selectedDay : 1;
    let m = typeof selectedMonth === 'number' ? selectedMonth : 0; // Default Jan
    let y = typeof selectedYear === 'number' ? selectedYear : currentYear;

    if (type === 'day') d = parseInt(val);
    if (type === 'month') m = parseInt(val);
    if (type === 'year') y = parseInt(val);

    // Validate Day against Month/Year
    // Create date with day 0 to get last day of previous month (so m+1, 0)
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    if (d > daysInMonth) d = daysInMonth;

    // Format output YYYY-MM-DD
    const newMStr = (m + 1).toString().padStart(2, '0');
    const newDStr = d.toString().padStart(2, '0');
    onChange(`${y}-${newMStr}-${newDStr}`);
  };

  return (
    <div className="flex gap-2 w-full">
      {/* DAY */}
      <div className="relative flex-1">
        <select 
          value={selectedDay}
          onChange={(e) => handleChange('day', e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-500 font-medium text-sm"
        >
          <option value="" disabled>Day</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* MONTH */}
      <div className="relative flex-[1.5]">
        <select 
          value={selectedMonth}
          onChange={(e) => handleChange('month', e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-500 font-medium text-sm"
        >
          <option value="" disabled>Month</option>
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* YEAR */}
      <div className="relative flex-[1.5]">
        <select 
          value={selectedYear}
          onChange={(e) => handleChange('year', e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-500 font-medium text-sm"
        >
          <option value="" disabled>Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label, textColor, labelColor }: { value: number; label: string, textColor?: string, labelColor?: string }) {
  // Now defaults to white for standard usage in colored cards
  return (
    <div className="flex flex-col items-center">
      <span className={`text-2xl font-bold leading-none ${textColor || 'text-white'}`}>{value}</span>
      <span className={`text-[9px] font-bold uppercase mt-1 ${labelColor || 'text-white/80'}`}>{label}</span>
    </div>
  );
}

// Visual component that renders leaves/flowers based on progress count
function GrowthRing({ count, type }: { count: number; type: 'namaz' | 'fasting' }) {
  // Determine growth stage based on count
  // Stage 0: 0 days
  // Stage 1: 1-7 days (Sprouting)
  // Stage 2: 7-30 days (Growing)
  // Stage 3: 30-90 days (Blooming)
  // Stage 4: 90+ days (Flourishing)

  const getOpacity = (threshold: number) => {
    // Hidden (scale-0) until reached, then pop in (scale-100)
    return count >= threshold ? 'opacity-100 scale-100' : 'opacity-0 scale-0';
  };

  if (type === 'namaz') {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none -z-0">
           {/* 1. Sprout - Top Left (Safe) */}
           <div className={`absolute top-1 left-2 transition-all duration-700 ease-out text-lime-500 ${getOpacity(1)}`}>
            <Sprout size={18} className="transform -rotate-12" />
           </div>

           {/* 2. Leaf - Bottom Right (Safe) */}
           <div className={`absolute bottom-2 right-1 transition-all duration-700 ease-out delay-100 text-emerald-500 ${getOpacity(10)}`}>
            <Leaf size={20} className="transform rotate-12" />
           </div>

           {/* 3. Small Tree - Left Side (Safe) */}
           <div className={`absolute top-1/2 -left-2 -translate-y-1/2 transition-all duration-700 ease-out delay-200 text-green-600 ${getOpacity(30)}`}>
            <TreeDeciduous size={18} className="transform -rotate-12" />
           </div>

           {/* 4. Pine Tree - Bottom Center-Right (Safe) */}
           <div className={`absolute -bottom-1 right-8 transition-all duration-700 ease-out delay-300 text-green-700 ${getOpacity(60)}`}>
            <TreePine size={22} className="transform rotate-6" />
           </div>
           
           {/* 5. Forest - Top Center-Left (Safe) */}
            <div className={`absolute -top-2 left-8 transition-all duration-700 ease-out delay-500 text-green-800 ${getOpacity(100)}`}>
            <Trees size={24} className="transform -rotate-6" />
           </div>

          {/* Ring */}
          <div className="absolute inset-0 border border-dashed border-islamic-400 rounded-full opacity-30" />
        </div>
    )
  }

  // Fasting (Flowers)
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-0">
       {/* 1. Pink Flower - Top Left (Safe) */}
       <div className={`absolute top-1 left-2 transition-all duration-700 ease-out text-pink-500 ${getOpacity(1)}`}>
        <Flower size={18} className="transform -rotate-12" />
       </div>

       {/* 2. Purple Flower - Bottom Right (Safe) */}
       <div className={`absolute bottom-2 right-1 transition-all duration-700 ease-out delay-100 text-purple-500 ${getOpacity(10)}`}>
        <Flower size={22} className="transform rotate-12" />
       </div>

       {/* 3. Amber Flower - Left Side (Safe) */}
       <div className={`absolute top-1/2 -left-2 -translate-y-1/2 transition-all duration-700 ease-out delay-200 text-amber-500 ${getOpacity(30)}`}>
        <Flower size={16} className="transform -rotate-45" />
       </div>

       {/* 4. Sky Flower - Bottom Center-Right (Safe) */}
       <div className={`absolute -bottom-1 right-8 transition-all duration-700 ease-out delay-300 text-sky-500 ${getOpacity(60)}`}>
        <Flower size={20} className="transform rotate-180" />
       </div>
       
       {/* 5. Rose Flower - Top Center-Left (Safe) */}
        <div className={`absolute -top-1 left-8 transition-all duration-700 ease-out delay-500 text-rose-500 ${getOpacity(100)}`}>
        <Flower size={24} className="transform rotate-45" />
       </div>

      {/* Subtle ring track - Matches the counter theme */}
      <div className={`absolute inset-0 border border-dashed border-amber-400 rounded-full opacity-30`} />
    </div>
  );
}