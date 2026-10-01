import { useState, useMemo } from 'react';
import { ComplaintTicket, UserAccount, PaymentMode } from '../types';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Receipt
} from 'lucide-react';

interface PaymentsViewProps {
  tickets: ComplaintTicket[];
  activeUser: UserAccount;
  onUpdateTicket: (updated: ComplaintTicket) => void;
  onSelectTicket: (ticket: ComplaintTicket) => void;
}

export function PaymentsView({
  tickets,
  activeUser,
  onUpdateTicket,
  onSelectTicket
}: PaymentsViewProps) {
  const [filterType, setFilterType] = useState<'ALL' | 'Shop' | 'Home'>('ALL');
  const [payStatusFilter, setPayStatusFilter] = useState<'ALL' | 'Paid' | 'Partial' | 'Unpaid'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment recording modal
  const [activeTicketForPay, setActiveTicketForPay] = useState<ComplaintTicket | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<PaymentMode>('UPI');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // Totals
  const summary = useMemo(() => {
    let customerTotal = 0;
    let techCostTotal = 0;
    let shopMarginTotal = 0;
    let commissionTotal = 0;
    let paidTotal = 0;
    let balanceTotal = 0;

    tickets.forEach((t) => {
      customerTotal += t.billing.customerAmount || 0;
      techCostTotal += t.billing.technicianCost || 0;
      shopMarginTotal += t.billing.grossMargin || 0;
      commissionTotal += t.billing.technicianCommission || 0;
      paidTotal += t.billing.paidAmount || 0;
      balanceTotal += t.billing.balanceAmount || 0;
    });

    return {
      customerTotal,
      techCostTotal,
      shopMarginTotal,
      commissionTotal,
      paidTotal,
      balanceTotal
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filterType !== 'ALL' && t.billing.repairType !== filterType) {
        return false;
      }
      if (payStatusFilter !== 'ALL' && t.billing.paymentStatus !== payStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.customerName.toLowerCase().includes(q);
        const matchesMobile = t.mobile.includes(q);
        const matchesTicket = t.ticketNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesMobile && !matchesTicket) return false;
      }
      return true;
    });
  }, [tickets, filterType, payStatusFilter, searchQuery]);

  const handleOpenPayModal = (ticket: ComplaintTicket) => {
    setActiveTicketForPay(ticket);
    setPayAmount(ticket.billing.balanceAmount || 0);
    setPayMode('UPI');
    setPayRef('');
    setPayNotes('');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketForPay || payAmount <= 0) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: Number(payAmount),
      mode: payMode,
      referenceNo: payRef || undefined,
      collectedBy: activeUser.name,
      notes: payNotes || undefined
    };

    const newPayments = [...(activeTicketForPay.billing.payments || []), newTx];
    const newPaidAmount = newPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const newBalance = Math.max(0, activeTicketForPay.billing.customerAmount - newPaidAmount);
    const newPayStatus: 'Paid' | 'Partial' | 'Unpaid' =
      newPaidAmount >= activeTicketForPay.billing.customerAmount
        ? 'Paid'
        : newPaidAmount > 0
        ? 'Partial'
        : 'Unpaid';

    const updated: ComplaintTicket = {
      ...activeTicketForPay,
      billing: {
        ...activeTicketForPay.billing,
        paidAmount: newPaidAmount,
        balanceAmount: newBalance,
        paymentStatus: newPayStatus,
        payments: newPayments
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: `Payment of ₹${payAmount} collected (${payMode})`,
          userName: activeUser.name,
          userRole: activeUser.role,
          details: `Reference: ${payRef || 'Direct'}, Balance: ₹${newBalance}`
        },
        ...activeTicketForPay.timeline
      ]
    };

    onUpdateTicket(updated);
    setActiveTicketForPay(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Payment &amp; Financial Margins Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            SOW Rules: At Shop (Margin on repair cost) · At Home (Fixed commission per job)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {filteredTickets.length} Ledger entries
          </span>
        </div>
      </div>

      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Customer Amount
          </span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-slate-900 mt-1 block">
            ₹{summary.customerTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Total billings</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Technician Cost
          </span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-slate-700 mt-1 block">
            ₹{summary.techCostTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Parts &amp; labor cost</span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
            Shop Gross Margin
          </span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-emerald-700 mt-1 block">
            ₹{summary.shopMarginTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-600">Customer - Tech - Handling</span>
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-indigo-800 block tracking-wider">
            Tech Commission
          </span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-indigo-700 mt-1 block">
            ₹{summary.commissionTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-indigo-600">Home visit earnings</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Collected (Paid)
          </span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-emerald-600 mt-1 block">
            ₹{summary.paidTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Cash, UPI, Card</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
            Pending Balance
          </span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-amber-700 mt-1 block">
            ₹{summary.balanceTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-amber-600">To be recovered</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, mobile, ticket #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Repair Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-semibold"
          >
            <option value="ALL">All Repair Types</option>
            <option value="Shop">At Shop (Margin Basis)</option>
            <option value="Home">At Home (Commission Basis)</option>
          </select>

          {/* Payment Status */}
          <select
            value={payStatusFilter}
            onChange={(e) => setPayStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-semibold"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial Paid</option>
            <option value="Paid">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Ticket &amp; Customer</th>
                <th className="p-3">Repair Type</th>
                <th className="p-3 text-right">Customer Amount</th>
                <th className="p-3 text-right">Tech Cost</th>
                <th className="p-3 text-right">Handling / Commission</th>
                <th className="p-3 text-right">Gross Margin</th>
                <th className="p-3 text-right">Paid / Balance</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No payment records match filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket & Customer */}
                    <td className="p-3 align-middle">
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className="font-mono font-bold text-blue-600 hover:underline block text-left"
                      >
                        {ticket.ticketNumber}
                      </button>
                      <span className="font-semibold text-slate-900 block mt-0.5">
                        {ticket.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {ticket.mobile}
                      </span>
                    </td>

                    {/* Repair Type */}
                    <td className="p-3 align-middle whitespace-nowrap">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                          ticket.billing.repairType === 'Shop'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {ticket.billing.repairType === 'Shop' ? '🏢 At Shop (Margin)' : '🏠 At Home (Commission)'}
                      </span>
                    </td>

                    {/* Customer Amount */}
                    <td className="p-3 align-middle text-right font-mono font-bold text-slate-900 tabular-nums">
                      ₹{ticket.billing.customerAmount}
                    </td>

                    {/* Tech Cost */}
                    <td className="p-3 align-middle text-right font-mono text-slate-700 tabular-nums">
                      ₹{ticket.billing.technicianCost}
                    </td>

                    {/* Handling or Commission */}
                    <td className="p-3 align-middle text-right font-mono text-slate-600 tabular-nums">
                      {ticket.billing.repairType === 'Shop' ? (
                        <span>₹{ticket.billing.handlingCharge} (Handling)</span>
                      ) : (
                        <span className="text-indigo-600">₹{ticket.billing.technicianCommission} (Comm.)</span>
                      )}
                    </td>

                    {/* Gross Margin */}
                    <td className="p-3 align-middle text-right font-mono font-bold text-emerald-700 tabular-nums">
                      ₹{ticket.billing.grossMargin}
                    </td>

                    {/* Paid / Balance */}
                    <td className="p-3 align-middle text-right tabular-nums">
                      <div className="font-mono font-semibold text-emerald-600">
                        Paid: ₹{ticket.billing.paidAmount}
                      </div>
                      {ticket.billing.balanceAmount > 0 && (
                        <div className="font-mono text-[11px] text-amber-700 font-bold">
                          Bal: ₹{ticket.billing.balanceAmount}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3 align-middle whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          ticket.billing.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.billing.paymentStatus === 'Partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ticket.billing.paymentStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-3 align-middle text-center whitespace-nowrap">
                      {ticket.billing.balanceAmount > 0 ? (
                        <button
                          onClick={() => handleOpenPayModal(ticket)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs"
                        >
                          + Record Pay
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {activeTicketForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Record Payment for {activeTicketForPay.ticketNumber}
                </h3>
                <span className="text-xs text-slate-500">
                  {activeTicketForPay.customerName} · Pending: ₹{activeTicketForPay.billing.balanceAmount}
                </span>
              </div>
              <button onClick={() => setActiveTicketForPay(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Amount to Receive (₹) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Payment Mode *</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold"
                >
                  <option value="UPI">UPI (PhonePe, GPay, Paytm, BHIM)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Transaction Ref / UTR / Receipt #</label>
                <input
                  type="text"
                  placeholder="e.g. PhonePe 9921820 / Cash slip"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Payment Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Final settlement on delivery"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTicketForPay(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                >
                  Confirm &amp; Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
