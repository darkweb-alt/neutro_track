
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { DailyStats, UserProfile, AppTab } from '../types';

interface DashboardProps {
  stats: DailyStats;
  profile: UserProfile;
  onAddWater: () => void;
  onRemoveWater: () => void;
  onUpdateProfile: (field: keyof UserProfile, value: any) => void;
  onNavigateToLog: () => void;
  onNavigateToProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, profile, onAddWater, onRemoveWater, onUpdateProfile, onNavigateToLog, onNavigateToProfile }) => {
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const caloriePercent = Math.min((stats.calories / profile.dailyGoal) * 100, 100);
  
  const weeklyData = [
    { day: 'Mon', cal: 1850 },
    { day: 'Tue', cal: 2100 },
    { day: 'Wed', cal: 1950 },
    { day: 'Thu', cal: stats.calories },
    { day: 'Fri', cal: 1700 },
    { day: 'Sat', cal: 2200 },
    { day: 'Sun', cal: 1800 },
  ];

  const intervals = [
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '3h', value: 180 }
  ];

  // Circle dimensions for a smaller w-44 h-44 container
  const size = 176; // 44 * 4
  const center = size / 2;
  const radius = center - 12; // Adjusted for stroke width
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="tab-content space-y-6 pb-32 px-5 pt-8">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, <span className="text-emerald-600">{profile.name}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mt-0.5">Ready to fuel your body?</p>
        </div>
        <button 
          onClick={onNavigateToProfile}
          className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 active:scale-95 transition-all"
          aria-label="Profile Customization"
        >
          <i className="fa-solid fa-user-gear text-lg"></i>
        </button>
      </header>

      {/* Main Stats Card - Made more compact */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 border border-slate-50 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-44 h-44 relative flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle 
                  cx={center} cy={center} r={radius} 
                  stroke="currentColor" strokeWidth="6" fill="transparent" 
                  className="text-slate-50 dark:text-slate-800/50" 
                />
                <circle 
                  cx={center} cy={center} r={radius} 
                  stroke="currentColor" strokeWidth="10" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={circumference - (circumference * caloriePercent) / 100} 
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out" 
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mb-0.5">Calories Left</span>
                <h3 className="text-4xl font-black text-[#0A1128] dark:text-white leading-tight transition-colors">
                  {Math.max(0, profile.dailyGoal - stats.calories)}
                </h3>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase mt-0.5 tracking-tight">
                  {stats.calories}KCAL IN
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-slate-800 dark:text-white tracking-tight">Weekly Intensity</h4>
          <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg uppercase tracking-wider">Last 7 Days</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} dy={10} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: profile.theme === 'dark' ? '#0f172a' : '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', color: profile.theme === 'dark' ? '#fff' : '#000'}} 
                cursor={{stroke: '#e2e8f0', strokeWidth: 1}}
              />
              <Area type="monotone" dataKey="cal" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trackers Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
          <button 
            onClick={() => setShowReminderSettings(!showReminderSettings)}
            className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all ${profile.waterReminderEnabled ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}
          >
            <i className={`fa-solid ${profile.waterReminderEnabled ? 'fa-bell' : 'fa-bell-slash'} text-[10px]`}></i>
          </button>

          {showReminderSettings && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20 p-4 flex flex-col animate-fadeIn">
               <button onClick={() => setShowReminderSettings(false)} className="absolute top-4 right-4 text-slate-400">
                  <i className="fa-solid fa-xmark"></i>
               </button>
               <h5 className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 mt-2 mb-4 tracking-widest">Reminders</h5>
               <div className="flex flex-col gap-2.5 w-full">
                  <button 
                    onClick={() => onUpdateProfile('waterReminderEnabled', !profile.waterReminderEnabled)}
                    className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${profile.waterReminderEnabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                  >
                    {profile.waterReminderEnabled ? 'On' : 'Off'}
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                     {intervals.map(int => (
                       <button
                        key={int.value}
                        onClick={() => onUpdateProfile('waterReminderInterval', int.value)}
                        className={`py-1.5 rounded-lg text-[9px] font-black transition-all ${profile.waterReminderInterval === int.value ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}
                       >
                         {int.label}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          )}

          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3">
            <i className="fa-solid fa-droplet text-base"></i>
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-[9px] font-extrabold uppercase tracking-widest">Hydration</span>
          <div className="flex items-baseline gap-0.5 my-1.5">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.water}</h3>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">/ 8</span>
          </div>
          <div className="flex gap-1.5 w-full mt-1.5">
            <button onClick={onAddWater} className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all">
              <i className="fa-solid fa-plus text-[10px]"></i>
            </button>
            <button onClick={onRemoveWater} className="w-9 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all">
              <i className="fa-solid fa-minus text-[10px]"></i>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500 text-[9px] font-extrabold uppercase tracking-widest block mb-4 text-center">Macros</span>
          <div className="space-y-3">
             <MacroBar label="Prot" color="bg-orange-400" value={stats.items.reduce((acc, i) => acc + (i.protein || 0), 0)} goal={profile.proteinGoal} />
             <MacroBar label="Carb" color="bg-emerald-400" value={stats.items.reduce((acc, i) => acc + (i.carbs || 0), 0)} goal={profile.carbsGoal} />
             <MacroBar label="Fat" color="bg-indigo-400" value={stats.items.reduce((acc, i) => acc + (i.fat || 0), 0)} goal={profile.fatGoal} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-extrabold text-slate-800 dark:text-white text-base tracking-tight">Today's Fuel</h4>
          <button 
            onClick={onNavigateToLog}
            className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full active:scale-95 transition-all"
          >
            History
          </button>
        </div>
        {stats.items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Log your first meal to see stats here</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {stats.items.slice(-3).reverse().map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[1.25rem] p-3.5 flex items-center gap-3.5 border border-slate-50 dark:border-slate-800 shadow-sm hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors">
                 <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-inner">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-bowl-food text-slate-300 dark:text-slate-600"></i></div>}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</h5>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.calories}</span>
                    <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase leading-none">kcal</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MacroBar: React.FC<{ label: string; color: string; value: number; goal: number }> = ({ label, color, value, goal }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
      <span>{label}</span>
      <span className="text-slate-600 dark:text-slate-400">{Math.round(value)}g / {goal}g</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-700 ease-out rounded-full`} 
        style={{ width: `${Math.min((value / goal) * 100, 100)}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
