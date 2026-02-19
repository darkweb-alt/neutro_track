
import React, { useState } from 'react';
import { UserProfile, HealthGoal, ActivityLevel, Gender, AuthUser, AppTheme } from '../types';

interface ProfileProps {
  profile: UserProfile;
  user: AuthUser;
  onUpdateProfile: (field: keyof UserProfile, value: any) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, user, onUpdateProfile, onLogout }) => {
  const [newAllergy, setNewAllergy] = useState('');
  const [newPref, setNewPref] = useState('');

  // Harris-Benedict Equation for BMR calculation
  const calculateBMR = () => {
    let bmr = 0;
    if (profile.gender === 'Male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    const activityMultipliers: Record<ActivityLevel, number> = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725
    };

    let maintenance = bmr * activityMultipliers[profile.activityLevel];
    
    if (profile.goal === 'Weight Loss') maintenance -= 500;
    if (profile.goal === 'Muscle Gain') maintenance += 300;

    return Math.round(maintenance);
  };

  const handleApplySuggested = () => {
    const suggested = calculateBMR();
    onUpdateProfile('dailyGoal', suggested);
    // Rough macro split: 30% Protein, 40% Carbs, 30% Fat
    onUpdateProfile('proteinGoal', Math.round((suggested * 0.3) / 4));
    onUpdateProfile('carbsGoal', Math.round((suggested * 0.4) / 4));
    onUpdateProfile('fatGoal', Math.round((suggested * 0.3) / 9));
  };

  const addAllergy = () => {
    if (newAllergy && !profile.allergies.includes(newAllergy)) {
      onUpdateProfile('allergies', [...profile.allergies, newAllergy]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (item: string) => {
    onUpdateProfile('allergies', profile.allergies.filter(a => a !== item));
  };

  const addPref = () => {
    if (newPref && !profile.preferences.includes(newPref)) {
      onUpdateProfile('preferences', [...profile.preferences, newPref]);
      setNewPref('');
    }
  };

  const removePref = (item: string) => {
    onUpdateProfile('preferences', profile.preferences.filter(p => p !== item));
  };

  const toggleTheme = () => {
    const nextTheme: AppTheme = profile.theme === 'light' ? 'dark' : 'light';
    onUpdateProfile('theme', nextTheme);
  };

  return (
    <div className="tab-content p-6 pb-32 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Manage your health footprint</p>
        </div>
        <button 
          onClick={onLogout}
          title="Reset All Data"
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 active:scale-90 transition-all border border-rose-100/50 dark:border-rose-900/30"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      {/* Identity Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-emerald-500/20 transform -rotate-3 border-4 border-white dark:border-slate-800">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-center w-full">
            <input 
              value={profile.name}
              onChange={(e) => onUpdateProfile('name', e.target.value)}
              className="text-2xl font-black text-center bg-transparent border-b-2 border-transparent focus:border-emerald-500 outline-none w-full px-4 py-1 transition-all text-slate-900 dark:text-white"
            />
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">Active Profile</p>
          </div>
        </div>
      </div>

      {/* Physical Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Body Metrics</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Age</span>
              <input type="number" value={profile.age} onChange={(e) => onUpdateProfile('age', Number(e.target.value))} className="w-12 bg-transparent text-right font-black text-slate-700 dark:text-slate-200 outline-none" />
            </div>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Weight (kg)</span>
              <input type="number" value={profile.weight} onChange={(e) => onUpdateProfile('weight', Number(e.target.value))} className="w-12 bg-transparent text-right font-black text-slate-700 dark:text-slate-200 outline-none" />
            </div>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Height (cm)</span>
              <input type="number" value={profile.height} onChange={(e) => onUpdateProfile('height', Number(e.target.value))} className="w-12 bg-transparent text-right font-black text-slate-700 dark:text-slate-200 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Lifestyle</p>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1">Gender</span>
              <select value={profile.gender} onChange={(e) => onUpdateProfile('gender', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 text-xs outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1">Activity</span>
              <select value={profile.activityLevel} onChange={(e) => onUpdateProfile('activityLevel', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 text-xs outline-none">
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Strategy Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">Nutrition Strategy</h4>
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1.5 rounded-full border border-emerald-500/20 dark:border-emerald-500/30 uppercase tracking-widest">Target Active</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Health Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Weight Loss', 'Maintain', 'Muscle Gain'] as HealthGoal[]).map(g => (
                  <button 
                    key={g} 
                    onClick={() => onUpdateProfile('goal', g)}
                    className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-tight transition-all border ${profile.goal === g ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Suggested Daily Intake</p>
                  <h5 className="text-3xl font-black text-slate-900 dark:text-white">{calculateBMR()} <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase">kcal</span></h5>
                </div>
                <button 
                  onClick={handleApplySuggested}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                >
                  Apply AI Target
                </button>
              </div>
              <div className="h-px bg-slate-200 dark:bg-white/10 w-full"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-orange-500 dark:text-orange-400 uppercase">Protein</p>
                  <input type="number" value={profile.proteinGoal} onChange={(e) => onUpdateProfile('proteinGoal', Number(e.target.value))} className="w-full bg-transparent text-slate-900 dark:text-white font-black outline-none text-lg" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 uppercase">Carbs</p>
                  <input type="number" value={profile.carbsGoal} onChange={(e) => onUpdateProfile('carbsGoal', Number(e.target.value))} className="w-full bg-transparent text-slate-900 dark:text-white font-black outline-none text-lg" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase">Fat</p>
                  <input type="number" value={profile.fatGoal} onChange={(e) => onUpdateProfile('fatGoal', Number(e.target.value))} className="w-full bg-transparent text-slate-900 dark:text-white font-black outline-none text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allergies & Preferences Tags */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <h4 className="text-slate-900 dark:text-white font-black tracking-tight">Allergies & Restrictions</h4>
            <div className="flex gap-2">
              <input 
                placeholder="Add e.g. Peanuts" 
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500 transition-all dark:text-white"
              />
              <button onClick={addAllergy} className="w-12 h-12 bg-slate-900 dark:bg-slate-800 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map(a => (
                <span key={a} className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 animate-fadeIn border dark:border-rose-900/30">
                  {a}
                  <button onClick={() => removeAllergy(a)}><i className="fa-solid fa-xmark text-[10px]"></i></button>
                </span>
              ))}
              {profile.allergies.length === 0 && <p className="text-slate-300 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest px-1">None specified</p>}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

          <div className="space-y-4">
            <h4 className="text-slate-900 dark:text-white font-black tracking-tight">Preferred Cuisines</h4>
            <div className="flex gap-2">
              <input 
                placeholder="Add e.g. Vegan" 
                value={newPref}
                onChange={(e) => setNewPref(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPref()}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500 transition-all dark:text-white"
              />
              <button onClick={addPref} className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.map(p => (
                <span key={p} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 animate-fadeIn border dark:border-emerald-900/30">
                  {p}
                  <button onClick={() => removePref(p)}><i className="fa-solid fa-xmark text-[10px]"></i></button>
                </span>
              ))}
              {profile.preferences.length === 0 && <p className="text-slate-300 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest px-1">No preferences added</p>}
            </div>
          </div>
        </div>
      </div>

      {/* App Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h4 className="text-slate-900 dark:text-white font-black tracking-tight">App Experience</h4>
        
        {/* Water Reminder Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-droplet"></i>
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">Water Reminders</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Smart Push Notifications</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdateProfile('waterReminderEnabled', !profile.waterReminderEnabled)}
            className={`w-12 h-6 rounded-full transition-all relative ${profile.waterReminderEnabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.waterReminderEnabled ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <i className={`fa-solid ${profile.theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">Dark Mode</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Adjust Visuals</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-all relative ${profile.theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-[0.3em]">NutriLens v2.0 • Build with ❤️</p>
      </div>
    </div>
  );
};

export default Profile;
