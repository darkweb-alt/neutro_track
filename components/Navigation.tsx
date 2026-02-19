
import React from 'react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.DASHBOARD, icon: 'fa-home-alt', label: 'Home' },
    { id: AppTab.PLANNER, icon: 'fa-calendar-alt', label: 'Plan' },
    { id: AppTab.SCAN, icon: 'fa-camera', label: 'Scan', special: true },
    { id: AppTab.LOG, icon: 'fa-list-ul', label: 'Log' },
    { id: AppTab.CHAT, icon: 'fa-comment-dots', label: 'Ask' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pointer-events-none z-[60]">
      <nav className="max-w-md mx-auto h-18 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-slate-950/50 flex justify-around items-center px-1 pointer-events-auto overflow-hidden transition-colors duration-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 h-14 transition-all duration-300 ${
              tab.special 
                ? 'bg-emerald-500 text-white !flex-none w-14 rounded-2xl shadow-lg shadow-emerald-500/30 mx-1'
                : activeTab === tab.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
            }`}
          >
            <i className={`fa-solid ${tab.icon} ${tab.special ? 'text-lg' : 'text-base'}`}></i>
            {!tab.special && (
              <span className={`text-[8px] mt-1 font-black uppercase tracking-tighter transition-opacity duration-300 ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-0'
              }`}>
                {tab.label}
              </span>
            )}
            {activeTab === tab.id && !tab.special && (
              <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
