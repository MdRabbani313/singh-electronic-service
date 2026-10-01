import { useState } from 'react';
import { UserAccount } from '../types';
import {
  Wrench,
  Plus,
  Users,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openNewTicketModal: () => void;
  users: UserAccount[];
  activeUser: UserAccount;
  setActiveUser: (user: UserAccount) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ticketCount: number;
}

export function Header({
  activeTab,
  setActiveTab,
  openNewTicketModal,
  users,
  activeUser,
  setActiveUser,
  searchQuery,
  setSearchQuery,
  ticketCount
}: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tickets', label: `Complaints (${ticketCount})` },
    { id: 'technicians', label: 'Technicians & SC' },
    { id: 'payments', label: 'Payment Ledger' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'reports', label: 'Reports & Export' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark / brand title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Singh Electronics
                </span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Service &amp; Complaint Portal · Korba
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Text with subtle hover and active state) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Search, User Switcher & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <div className="relative hidden md:block w-48 xl:w-56">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ticket, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Active User Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200/70 transition-colors"
                title="Switch active user to test permissions"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                  {activeUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-semibold text-slate-800 truncate max-w-[90px] block">
                    {activeUser.name}
                  </span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  activeUser.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {activeUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active User (3-4 Users)
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setActiveUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        activeUser.id === u.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.title}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        u.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-1 text-[11px] text-slate-400">
                    Role controls margin &amp; commission editing access.
                  </div>
                </div>
              )}
            </div>

            {/* + New Complaint CTA */}
            <button
              onClick={openNewTicketModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Complaint</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Subnav */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
