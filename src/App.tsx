/**
 * Service & Complaint Management Portal for Singh Electronics, Korba
 * Multi-Brand Electronics Sales & Service Care
 */

import { useState, useEffect } from 'react';
import {
  ComplaintTicket,
  Technician,
  ServiceCentre,
  UserAccount,
  SystemSettings
} from './types';
import {
  loadTickets,
  saveTickets,
  loadTechnicians,
  saveTechnicians,
  loadServiceCentres,
  saveServiceCentres,
  loadUsers,
  saveUsers,
  loadActiveUser,
  saveActiveUser,
  loadSettings,
  saveSettings
} from './utils/storage';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TicketsView } from './components/TicketsView';
import { TechniciansView } from './components/TechniciansView';
import { PaymentsView } from './components/PaymentsView';
import { DeliveryView } from './components/DeliveryView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { TicketDetailModal } from './components/TicketDetailModal';
import { NewTicketModal } from './components/NewTicketModal';
import { PrintJobSheetModal } from './components/PrintJobSheetModal';

export default function App() {
  // Persistent state
  const [tickets, setTickets] = useState<ComplaintTicket[]>(() => loadTickets());
  const [technicians, setTechnicians] = useState<Technician[]>(() => loadTechnicians());
  const [serviceCentres, setServiceCentres] = useState<ServiceCentre[]>(() => loadServiceCentres());
  const [users, setUsers] = useState<UserAccount[]>(() => loadUsers());
  const [activeUser, setActiveUser] = useState<UserAccount>(() => loadActiveUser());
  const [settings, setSettings] = useState<SystemSettings>(() => loadSettings());

  // Navigation & Modal state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState<boolean>(false);
  const [ticketToPrint, setTicketToPrint] = useState<ComplaintTicket | null>(null);

  // Global search & filter triggers
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Sync to local storage
  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  useEffect(() => {
    saveTechnicians(technicians);
  }, [technicians]);

  useEffect(() => {
    saveServiceCentres(serviceCentres);
  }, [serviceCentres]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveActiveUser(activeUser);
  }, [activeUser]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Handle adding new ticket
  const handleAddTicket = (newTicket: ComplaintTicket) => {
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    setSelectedTicket(newTicket);
  };

  // Handle updating existing ticket
  const handleUpdateTicket = (updatedTicket: ComplaintTicket) => {
    const updated = tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
    setTickets(updated);
    if (selectedTicket?.id === updatedTicket.id) {
      setSelectedTicket(updatedTicket);
    }
  };

  // Handle dashboard quick filter
  const handleDashboardFilter = (status: string) => {
    setStatusFilter(status);
    setActiveTab('tickets');
  };

  // Reset demo data handler
  const handleResetData = () => {
    setTickets(loadTickets());
    setTechnicians(loadTechnicians());
    setServiceCentres(loadServiceCentres());
    setUsers(loadUsers());
    setActiveUser(loadActiveUser());
    setSettings(loadSettings());
    setStatusFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNewTicketModal={() => setIsNewTicketOpen(true)}
        users={users}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'tickets') {
            setActiveTab('tickets');
          }
        }}
        ticketCount={tickets.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            tickets={tickets}
            technicians={technicians}
            activeUser={activeUser}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            onFilterByStatus={handleDashboardFilter}
            openNewTicketModal={() => setIsNewTicketOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tickets' && (
          <TicketsView
            tickets={tickets}
            technicians={technicians}
            serviceCentres={serviceCentres}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            openNewTicketModal={() => setIsNewTicketOpen(true)}
            onPrintTicket={(ticket) => setTicketToPrint(ticket)}
          />
        )}

        {activeTab === 'technicians' && (
          <TechniciansView
            technicians={technicians}
            serviceCentres={serviceCentres}
            tickets={tickets}
            onAddTechnician={(tech) => setTechnicians([...technicians, tech])}
            onUpdateTechnician={(tech) =>
              setTechnicians(technicians.map((t) => (t.id === tech.id ? tech : t)))
            }
            onAddServiceCentre={(sc) => setServiceCentres([...serviceCentres, sc])}
            onUpdateServiceCentre={(sc) =>
              setServiceCentres(serviceCentres.map((s) => (s.id === sc.id ? sc : s)))
            }
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView
            tickets={tickets}
            activeUser={activeUser}
            onUpdateTicket={handleUpdateTicket}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryView
            tickets={tickets}
            activeUser={activeUser}
            onUpdateTicket={handleUpdateTicket}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            onPrintTicket={(ticket) => setTicketToPrint(ticket)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView tickets={tickets} technicians={technicians} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            users={users}
            activeUser={activeUser}
            settings={settings}
            onUpdateUsers={setUsers}
            onUpdateSettings={setSettings}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Ticket Details & Action Drawer / Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          technicians={technicians}
          serviceCentres={serviceCentres}
          activeUser={activeUser}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={handleUpdateTicket}
          onPrintTicket={(ticket) => setTicketToPrint(ticket)}
        />
      )}

      {/* Register New Complaint Modal */}
      {isNewTicketOpen && (
        <NewTicketModal
          existingTickets={tickets}
          technicians={technicians}
          serviceCentres={serviceCentres}
          settings={settings}
          activeUser={activeUser}
          onClose={() => setIsNewTicketOpen(false)}
          onAddTicket={handleAddTicket}
        />
      )}

      {/* Printable Job Sheet / Gate Pass Receipt Modal */}
      {ticketToPrint && (
        <PrintJobSheetModal
          ticket={ticketToPrint}
          settings={settings}
          onClose={() => setTicketToPrint(null)}
        />
      )}

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong className="text-slate-800">Singh Electronics</strong> · Multi-Brand Sales &amp; Service Portal, Kosabadi, Korba (C.G.) - 495677
          </div>
          <div className="flex items-center gap-3">
            <span>Helpline: +91 98261 99880 / 07759-224488</span>
            <span>·</span>
            <span>Current Staff: <strong className="text-slate-700">{activeUser.name} ({activeUser.role})</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
