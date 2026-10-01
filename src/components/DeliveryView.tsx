import { useState, useMemo } from 'react';
import { ComplaintTicket, UserAccount } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Truck,
  CheckCircle,
  Clock,
  MessageSquare,
  Printer,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { openWhatsApp, generateCustomerWhatsAppText } from '../utils/whatsapp';

interface DeliveryViewProps {
  tickets: ComplaintTicket[];
  activeUser: UserAccount;
  onUpdateTicket: (updated: ComplaintTicket) => void;
  onSelectTicket: (ticket: ComplaintTicket) => void;
  onPrintTicket: (ticket: ComplaintTicket) => void;
}

export function DeliveryView({
  tickets,
  activeUser,
  onUpdateTicket,
  onSelectTicket,
  onPrintTicket
}: DeliveryViewProps) {
  const [activeStage, setActiveStage] = useState<'all' | 'ready' | 'informed' | 'pending' | 'delivered'>('all');

  // Categorize tickets into delivery lifecycle stages
  const deliveryData = useMemo(() => {
    const ready = tickets.filter(
      (t) => (t.status === 'Ready' || t.delivery.deliveryStatus === 'Ready') && t.status !== 'Closed' && t.delivery.deliveryStatus !== 'Delivered'
    );
    const informed = tickets.filter(
      (t) => t.status === 'Customer Informed' || (t.delivery.isCustomerInformed && t.delivery.deliveryStatus !== 'Delivered')
    );
    const pending = tickets.filter(
      (t) => t.delivery.deliveryStatus === 'Delivery Pending' && t.status !== 'Closed'
    );
    const delivered = tickets.filter(
      (t) => t.delivery.deliveryStatus === 'Delivered' || t.status === 'Delivered' || t.status === 'Closed'
    );

    return { ready, informed, pending, delivered };
  }, [tickets]);

  // Fast action: Mark Customer Informed
  const handleMarkCustomerInformed = (ticket: ComplaintTicket) => {
    const now = new Date().toISOString();
    const updated: ComplaintTicket = {
      ...ticket,
      status: 'Customer Informed',
      delivery: {
        ...ticket.delivery,
        isCustomerInformed: true,
        customerInformedDate: now,
        customerInformedNotes: `Informed by ${activeUser.name} via WhatsApp`
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: now,
          action: 'Customer Informed for Pickup / Delivery',
          userName: activeUser.name,
          userRole: activeUser.role,
          previousStatus: ticket.status,
          newStatus: 'Customer Informed'
        },
        ...ticket.timeline
      ]
    };

    onUpdateTicket(updated);
    // Also trigger WhatsApp
    const text = generateCustomerWhatsAppText(updated);
    openWhatsApp(ticket.mobile, text);
  };

  // Fast action: Mark as Delivered and Close
  const handleMarkDeliveredAndClosed = (ticket: ComplaintTicket) => {
    if (ticket.billing.balanceAmount > 0) {
      const confirmProceed = confirm(
        `Ticket has an outstanding balance of ₹${ticket.billing.balanceAmount}. Proceed to mark Delivered and collect balance?`
      );
      if (!confirmProceed) return;
    }

    const now = new Date().toISOString();
    const updated: ComplaintTicket = {
      ...ticket,
      status: 'Closed',
      delivery: {
        ...ticket.delivery,
        deliveryStatus: 'Delivered',
        deliveryDate: now,
        deliveredBy: activeUser.name,
        deliveredTo: ticket.customerName,
        deliveryRemarks: 'Delivered and closed at counter'
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: now,
          action: 'Product Delivered & Ticket Closed',
          userName: activeUser.name,
          userRole: activeUser.role,
          previousStatus: ticket.status,
          newStatus: 'Closed',
          details: `Delivered by ${activeUser.name} to ${ticket.customerName}.`
        },
        ...ticket.timeline
      ]
    };

    onUpdateTicket(updated);
  };

  const getFilteredList = () => {
    if (activeStage === 'ready') return deliveryData.ready;
    if (activeStage === 'informed') return deliveryData.informed;
    if (activeStage === 'pending') return deliveryData.pending;
    if (activeStage === 'delivered') return deliveryData.delivered;
    return [...deliveryData.ready, ...deliveryData.informed, ...deliveryData.pending];
  };

  const currentList = getFilteredList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Delivery Management &amp; Gate Pass</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage flow: Ready → Customer Informed → Delivery Pending → Delivered &amp; Closed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
            {deliveryData.ready.length + deliveryData.informed.length + deliveryData.pending.length} In Delivery Pipeline
          </span>
        </div>
      </div>

      {/* 4 Stage Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            id: 'ready',
            label: '1. Ready for Delivery',
            count: deliveryData.ready.length,
            color: 'border-blue-300 text-blue-700 bg-blue-50/50'
          },
          {
            id: 'informed',
            label: '2. Customer Informed',
            count: deliveryData.informed.length,
            color: 'border-teal-300 text-teal-700 bg-teal-50/50'
          },
          {
            id: 'pending',
            label: '3. Delivery Pending',
            count: deliveryData.pending.length,
            color: 'border-amber-300 text-amber-700 bg-amber-50/50'
          },
          {
            id: 'delivered',
            label: '4. Delivered / Closed',
            count: deliveryData.delivered.length,
            color: 'border-slate-300 text-slate-700 bg-slate-50/50'
          }
        ].map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id as any)}
            className={`border rounded-lg p-3 text-left transition-all ${stage.color} ${
              activeStage === stage.id ? 'ring-2 ring-blue-500 shadow-xs' : 'hover:opacity-90'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider block">
              {stage.label}
            </div>
            <div className="text-2xl font-extrabold tabular-nums mt-1">
              {stage.count}
            </div>
            <span className="text-[11px] opacity-80 block mt-0.5">
              Click to view tickets
            </span>
          </button>
        ))}
      </div>

      {/* Stage Action Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Viewing:</span>
          <span className="font-semibold text-blue-600 uppercase tracking-wide">
            {activeStage === 'all' ? 'All Active Deliveries' : `${activeStage} tickets`} ({currentList.length})
          </span>
        </div>

        {activeStage !== 'all' && (
          <button
            onClick={() => setActiveStage('all')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset to All Active
          </button>
        )}
      </div>

      {/* Delivery Cards / Table */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            No tickets currently in this delivery phase.
          </div>
        ) : (
          currentList.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-400 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Ticket & Customer Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onSelectTicket(ticket)}
                    className="font-mono font-bold text-blue-600 hover:underline text-xs"
                  >
                    {ticket.ticketNumber}
                  </button>
                  <StatusBadge status={ticket.status} size="sm" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    Date: {ticket.date}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    📍 {ticket.productLocation}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-900 mt-1">
                  {ticket.customerName} · <span className="font-mono text-slate-600">{ticket.mobile}</span>
                </div>

                <div className="text-xs text-slate-600">
                  {ticket.brand} {ticket.productCategory} ({ticket.model || 'Standard'}) · Fault: {ticket.problemDescription}
                </div>

                {ticket.accessoriesReceived.length > 0 && (
                  <div className="text-[11px] text-slate-500">
                    Accessories to return: <span className="font-semibold text-slate-700">{ticket.accessoriesReceived.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Middle Column: Payment Status */}
              <div className="text-left md:text-right shrink-0">
                <div className="text-xs font-bold text-slate-900 font-mono">
                  Bill Total: ₹{ticket.billing.customerAmount}
                </div>
                <div className="text-xs font-mono text-emerald-600 font-semibold">
                  Paid: ₹{ticket.billing.paidAmount}
                </div>
                {ticket.billing.balanceAmount > 0 ? (
                  <div className="text-xs font-bold font-mono text-amber-700 mt-0.5">
                    Payable: ₹{ticket.billing.balanceAmount}
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                    ✓ Full Payment Cleared
                  </div>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Print Gate Pass */}
                <button
                  onClick={() => onPrintTicket(ticket)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1"
                  title="Print Gate Pass & Receipt"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Gate Pass</span>
                </button>

                {/* Mark Informed & Send WhatsApp */}
                {!ticket.delivery.isCustomerInformed && (
                  <button
                    onClick={() => handleMarkCustomerInformed(ticket)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inform Customer</span>
                  </button>
                )}

                {/* Mark Delivered & Close */}
                {ticket.status !== 'Closed' && ticket.delivery.deliveryStatus !== 'Delivered' && (
                  <button
                    onClick={() => handleMarkDeliveredAndClosed(ticket)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-2xs"
                  >
                    Mark Delivered &amp; Close
                  </button>
                )}

                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="px-2.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-medium"
                >
                  Open Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
