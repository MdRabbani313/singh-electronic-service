import { useMemo } from 'react';
import { ComplaintTicket, Technician, UserAccount } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle,
  ClockAlert,
  PackageSearch,
  UserCheck,
  CreditCard,
  Truck,
  TrendingUp,
  MessageSquare,
  Phone,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Wrench
} from 'lucide-react';
import { openWhatsApp, generateCustomerWhatsAppText } from '../utils/whatsapp';

interface DashboardViewProps {
  tickets: ComplaintTicket[];
  technicians: Technician[];
  activeUser: UserAccount;
  onSelectTicket: (ticket: ComplaintTicket) => void;
  onFilterByStatus: (status: string) => void;
  openNewTicketModal: () => void;
  setActiveTab: (tab: string) => void;
}

export function DashboardView({
  tickets,
  technicians,
  activeUser,
  onSelectTicket,
  onFilterByStatus,
  openNewTicketModal,
  setActiveTab
}: DashboardViewProps) {
  // Current date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Compute key KPI metrics
  const metrics = useMemo(() => {
    const overdueList = tickets.filter((t) => {
      if (t.status === 'Closed' || t.status === 'Delivered') return false;
      if (!t.followUp?.followUpDate) return false;
      return t.followUp.followUpDate < todayStr;
    });

    const todayFollowUpsList = tickets.filter((t) => {
      if (t.status === 'Closed' || t.status === 'Delivered') return false;
      return t.followUp?.followUpDate === todayStr;
    });

    const partsPendingList = tickets.filter((t) => t.status === 'Parts Pending');
    const customerApprovalList = tickets.filter((t) => t.status === 'Customer Approval Pending');
    const readyList = tickets.filter((t) => t.status === 'Ready' || t.status === 'Customer Informed');
    const paymentPendingList = tickets.filter((t) => t.status === 'Payment Pending' || (t.billing.paymentStatus !== 'Paid' && t.billing.balanceAmount > 0));
    const deliveryPendingList = tickets.filter((t) => t.delivery.deliveryStatus === 'Delivery Pending' || (t.status === 'Ready' && t.delivery.deliveryStatus !== 'Delivered'));
    const closedList = tickets.filter((t) => t.status === 'Closed');

    // Financial totals
    const totalRepairRevenue = tickets.reduce((acc, t) => acc + (t.billing.customerAmount || 0), 0);
    const totalTechnicianCost = tickets.reduce((acc, t) => acc + (t.billing.technicianCost || 0), 0);
    const totalGrossMargin = tickets.reduce((acc, t) => acc + (t.billing.grossMargin || 0), 0);
    const totalCommission = tickets.reduce((acc, t) => acc + (t.billing.technicianCommission || 0), 0);
    const totalPaidCollected = tickets.reduce((acc, t) => acc + (t.billing.paidAmount || 0), 0);
    const totalBalancePending = tickets.reduce((acc, t) => acc + (t.billing.balanceAmount || 0), 0);

    return {
      overdue: overdueList,
      todayFollowUps: todayFollowUpsList,
      partsPending: partsPendingList,
      customerApproval: customerApprovalList,
      ready: readyList,
      paymentPending: paymentPendingList,
      deliveryPending: deliveryPendingList,
      closed: closedList,
      totalRepairRevenue,
      totalTechnicianCost,
      totalGrossMargin,
      totalCommission,
      totalPaidCollected,
      totalBalancePending
    };
  }, [tickets, todayStr]);

  // Combined urgent tickets
  const urgentFollowUps = useMemo(() => {
    return [...metrics.overdue, ...metrics.todayFollowUps].slice(0, 6);
  }, [metrics.overdue, metrics.todayFollowUps]);

  // 8 Specific SOW KPI Cards
  const kpiCards = [
    {
      id: 'overdue',
      label: 'Overdue Follow-ups',
      count: metrics.overdue.length,
      description: 'Follow-up past scheduled date',
      icon: ClockAlert,
      color: 'text-red-700 bg-red-50 border-red-200',
      action: () => onFilterByStatus('OVERDUE')
    },
    {
      id: 'today',
      label: "Today's Follow-ups",
      count: metrics.todayFollowUps.length,
      description: 'Due for update or inspection today',
      icon: Calendar,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      action: () => onFilterByStatus('TODAY_FOLLOWUP')
    },
    {
      id: 'parts',
      label: 'Parts Pending',
      count: metrics.partsPending.length,
      description: 'Awaiting spare delivery or order',
      icon: PackageSearch,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      action: () => onFilterByStatus('Parts Pending')
    },
    {
      id: 'approval',
      label: 'Customer Approval Pending',
      count: metrics.customerApproval.length,
      description: 'Estimate sent, confirmation pending',
      icon: UserCheck,
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      action: () => onFilterByStatus('Customer Approval Pending')
    },
    {
      id: 'ready',
      label: 'Ready for Delivery',
      count: metrics.ready.length,
      description: 'Repair tested OK & customer informed',
      icon: CheckCircle,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      action: () => onFilterByStatus('Ready')
    },
    {
      id: 'payment',
      label: 'Payment Pending',
      count: metrics.paymentPending.length,
      description: `₹${metrics.totalBalancePending.toLocaleString('en-IN')} outstanding`,
      icon: CreditCard,
      color: 'text-yellow-800 bg-yellow-50 border-yellow-200',
      action: () => onFilterByStatus('Payment Pending')
    },
    {
      id: 'delivery',
      label: 'Delivery Pending',
      count: metrics.deliveryPending.length,
      description: 'Awaiting pickup or home handover',
      icon: Truck,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      action: () => onFilterByStatus('Delivery Pending')
    },
    {
      id: 'closed',
      label: 'Closed Tickets',
      count: metrics.closed.length,
      description: 'Payment collected & delivered',
      icon: CheckCircle,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
      action: () => onFilterByStatus('Closed')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Shop Location Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Singh Electronics Service Desk
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
              Korba Portal Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Kosabadi Main Road, Korba · Authorized multi-brand repair management &amp; tracking
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('tickets')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            View All Tickets
          </button>
          <button
            onClick={openNewTicketModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            + Register Complaint
          </button>
        </div>
      </div>

      {/* 8 Statement of Work Key KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
            Service Queue Status (8 Key Tracks)
          </h2>
          <span className="text-xs text-slate-500">
            Click any track to filter tickets
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={card.action}
                className="bg-white border border-slate-200 rounded-lg p-3 text-left hover:border-blue-400 hover:shadow-xs transition-all group focus:outline-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className={`w-7 h-7 rounded flex items-center justify-center ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-bold tabular-nums text-slate-900">
                    {card.count}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5 line-clamp-1">
                    {card.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {card.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Margin & Commission Summary (SOW Section 4) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Payment &amp; Financial Margins Overview
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('payments')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open Payment Ledger</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Total Customer Value
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-slate-900 mt-0.5 block">
              ₹{metrics.totalRepairRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400">Total billings logged</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Total Technician Cost
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-slate-700 mt-0.5 block">
              ₹{metrics.totalTechnicianCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400">Parts &amp; repair cost</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
              Gross Shop Margin
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-emerald-600 mt-0.5 block">
              ₹{metrics.totalGrossMargin.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600/80">At Shop margin profit</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-indigo-700 uppercase tracking-wider block">
              Tech Commissions
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-indigo-600 mt-0.5 block">
              ₹{metrics.totalCommission.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-indigo-600/80">At Home fixed basis</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Amount Collected
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-emerald-700 mt-0.5 block">
              ₹{metrics.totalPaidCollected.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400">UPI, Cash, Card</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block">
              Payment Pending
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-amber-600 mt-0.5 block">
              ₹{metrics.totalBalancePending.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-amber-600/80">Pending recovery</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Urgent Follow-ups & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Follow-up Reminders & Urgent Actions */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Urgent Follow-ups &amp; Reminders ({urgentFollowUps.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Today: {todayStr}
            </span>
          </div>

          {urgentFollowUps.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              All follow-up reminders are up to date!
            </div>
          ) : (
            <div className="space-y-3">
              {urgentFollowUps.map((ticket) => {
                const isOverdue = ticket.followUp?.followUpDate && ticket.followUp.followUpDate < todayStr;
                const tech = technicians.find((t) => t.id === ticket.assignedTechnicianId);

                return (
                  <div
                    key={ticket.id}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      isOverdue
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectTicket(ticket)}
                            className="font-mono font-bold text-blue-600 hover:underline"
                          >
                            {ticket.ticketNumber}
                          </button>
                          <StatusBadge status={ticket.status} size="sm" />
                          {isOverdue && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-100 text-red-800 rounded">
                              Overdue ({ticket.followUp?.followUpDate})
                            </span>
                          )}
                          {!isOverdue && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                              Due Today
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900 mt-1">
                          {ticket.customerName} · {ticket.mobile}
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {ticket.brand} {ticket.productCategory} ({ticket.model})
                        </div>
                        {ticket.followUp?.notes && (
                          <div className="text-slate-500 italic mt-1 bg-white/70 p-1.5 rounded border border-slate-200/60">
                            Reminder: "{ticket.followUp.notes}"
                          </div>
                        )}
                      </div>

                      {/* Quick action triggers */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            const text = generateCustomerWhatsAppText(ticket);
                            openWhatsApp(ticket.mobile, text);
                          }}
                          className="px-2 py-1 text-[11px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 shadow-2xs"
                          title="WhatsApp Customer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => onSelectTicket(ticket)}
                          className="px-2 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-900 text-white rounded flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity & Quick Action Complaints */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Recent Service Complaints
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('tickets')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => {
              const tech = technicians.find((t) => t.id === ticket.assignedTechnicianId);
              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {ticket.ticketNumber}
                      </span>
                      <StatusBadge status={ticket.status} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {ticket.date}
                      </span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-slate-900">
                      ₹{ticket.billing.customerAmount}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">
                        {ticket.customerName}
                      </span>
                      <span className="text-slate-400 mx-1">·</span>
                      <span className="text-slate-600">{ticket.brand} {ticket.productCategory}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {tech ? tech.name : 'Unassigned'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    Problem: {ticket.problemDescription}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
