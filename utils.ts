export const convertDaysToTime = (totalDays: number) => {
  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;
  
  return { years, months, days };
};

// Backup & Restore utilities
export const exportData = () => {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    qaza_total_days: localStorage.getItem('qaza_total_days'),
    qaza_current_progress_full: localStorage.getItem('qaza_current_progress_full'),
    qaza_current_progress_kasr: localStorage.getItem('qaza_current_progress_kasr'),
    qaza_is_kasr: localStorage.getItem('qaza_is_kasr'),
    qaza_fasting_days: localStorage.getItem('qaza_fasting_days'),
    qaza_missed_ramadans: localStorage.getItem('qaza_missed_ramadans'),
    qaza_dates: localStorage.getItem('qaza_dates'),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qaza-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.version) {
          throw new Error('Invalid backup file');
        }

        // Restore all data
        if (data.qaza_total_days) localStorage.setItem('qaza_total_days', data.qaza_total_days);
        if (data.qaza_current_progress_full) localStorage.setItem('qaza_current_progress_full', data.qaza_current_progress_full);
        if (data.qaza_current_progress_kasr) localStorage.setItem('qaza_current_progress_kasr', data.qaza_current_progress_kasr);
        if (data.qaza_is_kasr) localStorage.setItem('qaza_is_kasr', data.qaza_is_kasr);
        if (data.qaza_fasting_days) localStorage.setItem('qaza_fasting_days', data.qaza_fasting_days);
        if (data.qaza_missed_ramadans) localStorage.setItem('qaza_missed_ramadans', data.qaza_missed_ramadans);
        if (data.qaza_dates) localStorage.setItem('qaza_dates', data.qaza_dates);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};