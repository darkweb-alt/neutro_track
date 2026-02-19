
import React, { useState, useEffect } from 'react';
import { generateMealPlan, generateWeeklyMealPlan } from '../services/geminiService';
import { DailyMealPlan, WeeklyMealPlan, UserProfile } from '../types';

interface MealPlannerProps {
  profile: UserProfile;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [dailyPlan, setDailyPlan] = useState<DailyMealPlan | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    const savedDaily = localStorage.getItem('nutrilens_daily_plan');
    const savedWeekly = localStorage.getItem('nutrilens_weekly_plan');
    if (savedDaily) setDailyPlan(JSON.parse(savedDaily));
    if (savedWeekly) setWeeklyPlan(JSON.parse(savedWeekly));
  }, []);

  const handleGenerateDaily = async () => {
    setLoading(true);
    try {
      const plan = await generateMealPlan(profile);
      setDailyPlan(plan);
      localStorage.setItem('nutrilens_daily_plan', JSON.stringify(plan));
    } catch (error) {
      alert("Failed to generate daily plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWeekly = async () => {
    setLoading(true);
    try {
      const plan = await generateWeeklyMealPlan(profile);
      setWeeklyPlan(plan);
      localStorage.setItem('nutrilens_weekly_plan', JSON.stringify(plan));
      setSelectedDayIndex(0);
    } catch (error) {
      alert("Failed to generate weekly plan.");
    } finally {
      setLoading(false);
    }
  };

  const activePlan = viewMode === 'daily' ? dailyPlan : weeklyPlan?.days[selectedDayIndex];

  return (
    <div className="tab-content p-6 pb-32 space-y-6">
      {/* Header & Toggle */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Smart Planner</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">AI-curated nutrition</p>
          </div>
          <button 
            onClick={viewMode === 'daily' ? handleGenerateDaily : handleGenerateWeekly}
            disabled={loading}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <i className={`fa-solid fa-arrows-rotate text-lg ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button 
            onClick={() => setViewMode('daily')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'daily' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Daily Plan
          </button>
          <button 
            onClick={() => setViewMode('weekly')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'weekly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Weekly Plan
          </button>
        </div>
      </div>

      {/* Weekly Day Selector */}
      {viewMode === 'weekly' && weeklyPlan && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          {weeklyPlan.days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-none w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
                selectedDayIndex === idx ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-800'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-tighter">{day.dayName.substring(0, 3)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty States */}
      {!activePlan && !loading && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i className={`fa-solid ${viewMode === 'daily' ? 'fa-calendar-day' : 'fa-calendar-week'} text-3xl`}></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            {viewMode === 'daily' ? 'Get Daily Recommendations' : 'Generate Full Week'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
            Let our AI optimize your meals for {profile.goal.toLowerCase()}.
          </p>
          <button 
            onClick={viewMode === 'daily' ? handleGenerateDaily : handleGenerateWeekly}
            className="w-full py-4 bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
          >
            Generate Now
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 h-48 animate-pulse border border-slate-100 dark:border-slate-800" />
          ))}
        </div>
      )}

      {/* Plan Display */}
      {activePlan && !loading && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {viewMode === 'daily' ? "Today's Suggestions" : `${activePlan.dayName} Details`}
            </span>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">{activePlan.totalCalories} kcal Total</span>
            </div>
          </div>
          
          {activePlan.meals.map((meal, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 group hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block ${
                    meal.type === 'Breakfast' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 
                    meal.type === 'Lunch' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 
                    meal.type === 'Dinner' ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {meal.type}
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight leading-tight">{meal.name}</h4>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-2 px-3 rounded-2xl text-right">
                  <p className="font-black text-slate-800 dark:text-white leading-none">{meal.calories}</p>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1">kcal</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">Protein</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white">{meal.macros.protein}g</p>
                </div>
                <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">Carbs</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white">{meal.macros.carbs}g</p>
                </div>
                <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">Fat</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white">{meal.macros.fat}g</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Key Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ing, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Tips Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-5 transition-colors">
        <div className="w-14 h-14 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-lightbulb text-2xl"></i>
        </div>
        <div className="flex flex-col justify-center">
          <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Planning Tip</h5>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
            Generating a <span className="text-indigo-600 dark:text-indigo-400 font-bold">Weekly Plan</span> helps with grocery shopping and consistency!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
