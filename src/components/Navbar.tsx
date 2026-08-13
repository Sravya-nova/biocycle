import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../i18n/translations';
import { 
  Recycle, 
  LayoutDashboard, 
  PlusCircle, 
  Sparkles, 
  Activity, 
  Calculator, 
  History, 
  Globe, 
  Menu, 
  X,
  RotateCcw
} from 'lucide-react';
import { resetStorageToDefaults } from '../services/storageService';

export type NavTab = 
  | 'dashboard' 
  | 'add-batch' 
  | 'recommendation' 
  | 'process-monitor' 
  | 'impact-calculator' 
  | 'batch-history';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'add-batch', label: t.navAddBatch, icon: PlusCircle },
    { id: 'recommendation', label: t.navRecommendation, icon: Sparkles },
    { id: 'process-monitor', label: t.navMonitor, icon: Activity },
    { id: 'impact-calculator', label: t.navCalculator, icon: Calculator },
    { id: 'batch-history', label: t.navHistory, icon: History },
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default initial state?')) {
      resetStorageToDefaults();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#07130e]/90 border-b border-emerald-900/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Plain Language Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-md group-hover:scale-105 transition-transform">
              <Recycle className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight block">
                {t.appName}
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold hidden sm:block">
                {t.appTagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#040e0a] p-1.5 rounded-2xl border border-emerald-900/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-emerald-950/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector & Reset Data */}
          <div className="flex items-center space-x-3">
            
            {/* Global Language Selector Dropdown */}
            <div className="relative flex items-center bg-[#040e0a] border border-emerald-700/60 rounded-xl px-2.5 py-1.5 text-xs font-bold">
              <Globe className="h-4 w-4 text-emerald-400 mr-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-emerald-300 font-extrabold focus:outline-none cursor-pointer text-xs pr-1"
                aria-label="Language Selector"
              >
                <option value="en" className="bg-[#08150e] text-white">English (Simple)</option>
                <option value="hi" className="bg-[#08150e] text-white">हिंदी (Hindi)</option>
                <option value="te" className="bg-[#08150e] text-white">తెలుగు (Telugu)</option>
                <option value="es" className="bg-[#08150e] text-white">Español (Spanish)</option>
              </select>
            </div>

            {/* Reset Data Icon Button */}
            <button
              onClick={handleResetData}
              title="Reset Storage to Seed Demo Data"
              className="p-2 text-gray-400 hover:text-emerald-300 hover:bg-emerald-950/50 rounded-xl transition-all border border-transparent hover:border-emerald-800/40 hidden sm:block"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Mobile Drawer Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-emerald-950/60 border border-emerald-900/50"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#05110c] border-b border-emerald-900/60 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-emerald-950 shadow-md'
                    : 'text-gray-300 hover:bg-emerald-950/50 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
