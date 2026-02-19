
import React, { useState, useEffect, useRef } from 'react';
import { FoodItem, UserProfile, DailyStats, AppTab, HealthGoal, AuthUser, AppTheme } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import MealPlanner from './components/MealPlanner';
import ChatBot from './components/ChatBot';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  // Default user session to bypass login screen
  const [user, setUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem('nutrilens_session');
    return saved ? JSON.parse(saved) : { email: 'guest@nutrilens.ai', name: 'Nidin & Team' };
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutrilens_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist for legacy sessions
      if (!parsed.gender) parsed.gender = 'Male';
      if (!parsed.activityLevel) parsed.activityLevel = 'Moderately Active';
      if (!parsed.theme) parsed.theme = 'light';
      return parsed;
    }
    return {
      name: 'Nidin & Team',
      gender: 'Male',
      dailyGoal: 2200,
      proteinGoal: 150,
      carbsGoal: 250,
      fatGoal: 70,
      weight: 75,
      height: 180,
      age: 28,
      activityLevel: 'Moderately Active',
      goal: 'Maintain',
      allergies: [],
      preferences: [],
      waterReminderEnabled: false,
      waterReminderInterval: 60,
      theme: 'light'
    };
  });

  const [dailyStats, setDailyStats] = useState<DailyStats>(() => {
    const saved = localStorage.getItem('nutrilens_daily_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.date === today) return parsed;
    }
    return {
      date: new Date().toISOString().split('T')[0],
      calories: 0,
      water: 0,
      items: []
    };
  });

  // Background reminder effect
  const reminderTimerRef = useRef<number | null>(null);

  // Synchronize theme with document element
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  useEffect(() => {
    if (profile.waterReminderEnabled && user) {
      if (reminderTimerRef.current) window.clearInterval(reminderTimerRef.current);

      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      reminderTimerRef.current = window.setInterval(() => {
        const notify = () => {
          if (Notification.permission === 'granted') {
            new Notification('Time to Hydrate! 💧', {
              body: 'Stay healthy and take a sip of water.',
              icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png'
            });
          } else {
            alert("Reminder: It's time to drink water! 💧");
          }
        };
        notify();
      }, profile.waterReminderInterval * 60 * 1000);
    }

    return () => {
      if (reminderTimerRef.current) window.clearInterval(reminderTimerRef.current);
    };
  }, [profile.waterReminderEnabled, profile.waterReminderInterval, user]);

  useEffect(() => {
    localStorage.setItem('nutrilens_daily_stats', JSON.stringify(dailyStats));
  }, [dailyStats]);

  useEffect(() => {
    localStorage.setItem('nutrilens_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nutrilens_session', JSON.stringify(user));
    }
  }, [user]);

  const handleAddWater = () => {
    setDailyStats(prev => ({ ...prev, water: prev.water + 1 }));
  };

  const handleRemoveWater = () => {
    setDailyStats(prev => ({ ...prev, water: Math.max(0, prev.water - 1) }));
  };

  const handleFoodLogged = (item: FoodItem) => {
    setDailyStats(prev => ({
      ...prev,
      calories: prev.calories + item.calories,
      items: [...prev.items, item]
    }));
    setActiveTab(AppTab.DASHBOARD);
  };

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data?")) {
      localStorage.removeItem('nutrilens_profile');
      localStorage.removeItem('nutrilens_daily_stats');
      localStorage.removeItem('nutrilens_session');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      {activeTab === AppTab.DASHBOARD && (
        <Dashboard 
          stats={dailyStats} 
          profile={profile}
          onAddWater={handleAddWater}
          onRemoveWater={handleRemoveWater}
          onUpdateProfile={updateProfileField}
          onNavigateToLog={() => setActiveTab(AppTab.LOG)}
          onNavigateToProfile={() => setActiveTab(AppTab.PROFILE)}
        />
      )}

      {activeTab === AppTab.PLANNER && (
        <MealPlanner profile={profile} />
      )}

      {activeTab === AppTab.SCAN && (
        <Scanner 
          onFoodLogged={handleFoodLogged} 
          onCancel={() => setActiveTab(AppTab.DASHBOARD)} 
        />
      )}

      {activeTab === AppTab.CHAT && (
        <ChatBot profile={profile} />
      )}

      {activeTab === AppTab.LOG && (
        <div className="tab-content p-6 pb-32">
           <header className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Activity Log</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Everything you've enjoyed today</p>
           </header>

           <div className="space-y-4">
              {dailyStats.items.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
                   <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-3xl flex items-center justify-center mb-6">
                      <i className="fa-solid fa-plate-wheat text-4xl"></i>
                   </div>
                   <p className="text-slate-400 dark:text-slate-500 font-bold">Your log is empty.</p>
                   <p className="text-slate-300 dark:text-slate-600 text-xs mt-2 px-6">Start by scanning a meal or drink to see it listed here.</p>
                </div>
              ) : (
                dailyStats.items.slice().reverse().map(item => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-4 hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-all active:scale-[0.98]">
                     <div className="w-18 h-18 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <i className="fa-solid fa-utensils text-emerald-200 dark:text-emerald-800 text-2xl"></i>}
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-black text-slate-800 dark:text-slate-100 tracking-tight">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <div className="flex gap-2 mt-2">
                           <span className="text-[9px] font-black bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-lg">P: {item.protein}g</span>
                           <span className="text-[9px] font-black bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg">C: {item.carbs}g</span>
                           <span className="text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg">F: {item.fat}g</span>
                        </div>
                     </div>
                     <div className="text-right flex flex-col justify-center shrink-0">
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{item.calories}</p>
                        <p className="text-[9px] text-slate-300 dark:text-slate-600 font-black uppercase mt-1">kcal</p>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      {activeTab === AppTab.PROFILE && (
        <Profile 
          profile={profile} 
          user={user} 
          onUpdateProfile={updateProfileField} 
          onLogout={handleReset} 
        />
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
