import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Sparkles, 
  Activity, 
  Calculator, 
  History, 
  Sprout, 
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
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onResetData }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-batch', label: 'Add Waste Batch', icon: PlusCircle },
    { id: 'recommendation', label: 'Recommendation', icon: Sparkles },
    { id: 'process-monitor', label: 'Process Monitor', icon: Activity },
    { id: 'impact-calculator', label: 'Impact Calculator', icon: Calculator },
    { id: 'batch-history', label: 'Batch History', icon: History }
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleResetClick = () => {
    if (window.confirm('Reset all waste batches and sensor logs to demo seed data?')) {
      resetStorageToDefaults();
      onResetData();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09120e]/90 backdrop-blur-md border-b border-emerald-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950">
              <Sprout className="h-6 w-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Bio<span className="text-emerald-400">Cycle</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">Bio-Tech</span>
              </div>
              <p className="text-xs text-emerald-300/60 hidden sm:block">Organic Waste Conversion & Monitoring</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                      : 'text-gray-300 hover:text-white hover:bg-emerald-950/40'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Reset Demo Data & Mobile Menu Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetClick}
              title="Reset to Demo Data"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 rounded-lg transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-emerald-950/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c1813] border-b border-emerald-800/40 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40'
                    : 'text-gray-300 hover:bg-emerald-950/50 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
