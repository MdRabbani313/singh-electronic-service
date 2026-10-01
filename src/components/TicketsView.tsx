import { useState, useMemo } from 'react';
import {
  ComplaintTicket,
  Technician,
  ServiceCentre,
  ComplaintStatus,
  WarrantyStatus,
  ProductLocation,
  ComplaintType,
  PaymentStatus
} from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  MessageSquare,
  Phone,
  Printer,
  ChevronDown,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import {
  openWhatsApp,
  generateTechnicianWhatsAppText,
  generateCustomerWhatsAppText
} from '../utils/whatsapp';

interface TicketsViewProps {
  tickets: ComplaintTicket[];
  technicians: Technician[];
  serviceCentres: ServiceCentre[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSelectTicket: (ticket: ComplaintTicket) => void;
  openNewTicketModal: () => void;
  onPrintTicket: (ticket: ComplaintTicket) => void;
}

const ALL_STATUSES: ComplaintStatus[] = [
  'Complaint Received',
  'Technician/Service Centre Assigned',
  'Technician Attended',
  'Diagnosis/Estimate Pending',
  'Customer Approval Pending',
  'Parts Pending',
  'Repair in Progress',
  'Ready',
  'Customer Informed',
  'Payment Pending',
  'Delivered',
  'Closed',
  'On Hold'
];

export function TicketsView({
  tickets,
  technicians,
  serviceCentres,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onSelectTicket,
  openNewTicketModal,
  onPrintTicket
}: TicketsViewProps) {
  // Additional filters
  const [technicianFilter, setTechnicianFilter] = useState<string>('ALL');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [complaintTypeFilter, setComplaintTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc'>('date_desc');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Global search: customer name, mobile, ticket number, product, model, company login number
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = t.customerName.toLowerCase().includes(query);
        const matchesMobile = t.mobile.includes(query) || (t.alternateMobile && t.alternateMobile.includes(query));
        const matchesTicket = t.ticketNumber.toLowerCase().includes(query);
        const matchesProduct = t.productCategory.toLowerCase().includes(query);
        const matchesBrand = t.brand.toLowerCase().includes(query);
        const matchesModel = t.model.toLowerCase().includes(query);
        const matchesCompanyId = t.companyLoginNumber?.toLowerCase().includes(query);
        const matchesArea = t.area.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesMobile &&
          !matchesTicket &&
          !matchesProduct &&
          !matchesBrand &&
          !matchesModel &&
          !matchesCompanyId &&
          !matchesArea
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'OVERDUE') {
          if (t.status === 'Closed' || t.status === 'Delivered') return false;
          if (!t.followUp?.followUpDate || t.followUp.followUpDate >= todayStr) return false;
        } else if (statusFilter === 'TODAY_FOLLOWUP') {
          if (t.status === 'Closed' || t.status === 'Delivered') return false;
          if (t.followUp?.followUpDate !== todayStr) return false;
        } else if (statusFilter === 'Delivery Pending') {
          if (t.delivery.deliveryStatus !== 'Delivery Pending' && t.status !== 'Ready') return false;
        } else {
          if (t.status !== statusFilter) return false;
        }
      }

      // Technician filter
      if (technicianFilter !== 'ALL') {
        if (t.assignedTechnicianId !== technicianFilter && t.assignedServiceCentreId !== technicianFilter) {
          return false;
        }
      }

      // Product category filter
      if (productCategoryFilter !== 'ALL') {
        if (t.productCategory !== productCategoryFilter) return false;
      }

      // Warranty filter
      if (warrantyFilter !== 'ALL') {
        if (t.warrantyStatus !== warrantyFilter) return false;
      }

      // Payment status filter
      if (paymentStatusFilter !== 'ALL') {
        if (t.billing.paymentStatus !== paymentStatusFilter) return false;
      }

      // Location filter
      if (locationFilter !== 'ALL') {
        if (t.productLocation !== locationFilter) return false;
      }

      // Complaint type filter
      if (complaintTypeFilter !== 'ALL') {
        if (t.complaintType !== complaintTypeFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'amount_desc') {
        return (b.billing.customerAmount || 0) - (a.billing.customerAmount || 0);
      }
      return 0;
    });
  }, [
    tickets,
    searchQuery,
    statusFilter,
    technicianFilter,
    productCategoryFilter,
    warrantyFilter,
    paymentStatusFilter,
    locationFilter,
    complaintTypeFilter,
    sortBy,
    todayStr
  ]);

  // Unique product categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => set.add(t.productCategory));
    return Array.from(set);
  }, [tickets]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTechnicianFilter('ALL');
    setProductCategoryFilter('ALL');
    setWarrantyFilter('ALL');
    setPaymentStatusFilter('ALL');
    setLocationFilter('ALL');
    setComplaintTypeFilter('ALL');
  };

  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    technicianFilter !== 'ALL' ||
    productCategoryFilter !== 'ALL' ||
    warrantyFilter !== 'ALL' ||
    paymentStatusFilter !== 'ALL' ||
    locationFilter !== 'ALL' ||
    complaintTypeFilter !== 'ALL' ||
    searchQuery !== '';

  return (
    <div className="space-y-4">
      {/* Title & View Switcher Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Service Complaints &amp; Job Tickets
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 tabular-nums">
              {filteredTickets.length} / {tickets.length} Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full lifecycle tracking: intake, assignment, diagnosis, approval, parts, delivery &amp; margin
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
          </div>

          <button
            onClick={openNewTicketModal}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Complaint</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Filter Bar (SOW: multiple filters by status, date, technician, product, warranty, payment status and complaint type) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 space-y-3">
        {/* Search & Main Row */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, mobile, ticket #, product, or company login number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quick status dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="OVERDUE">🚨 Overdue Follow-ups</option>
              <option value="TODAY_FOLLOWUP">📅 Due Today</option>
              <option disabled>──────────</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Technician filter */}
            <select
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="ALL">All Technicians &amp; SC</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  Tech: {t.name}
                </option>
              ))}
              {serviceCentres.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  SC: {sc.name}
                </option>
              ))}
            </select>

            {/* Warranty filter */}
            <select
              value={warrantyFilter}
              onChange={(e) => setWarrantyFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="ALL">All Warranties</option>
              <option value="In Warranty">In Warranty</option>
              <option value="Out of Warranty">Out of Warranty</option>
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-medium text-slate-800"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Chips Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">More filters:</span>

          {/* Product category */}
          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="px-2 py-1 text-[11px] bg-slate-100 border border-slate-200 rounded focus:outline-hidden"
          >
            <option value="ALL">Category: All</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Product Location */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-2 py-1 text-[11px] bg-slate-100 border border-slate-200 rounded focus:outline-hidden"
          >
            <option value="ALL">Location: All</option>
            <option value="Shop">Shop</option>
            <option value="Customer Home">Customer Home</option>
            <option value="Service Centre">Service Centre</option>
          </select>

          {/* Complaint Type */}
          <select
            value={complaintTypeFilter}
            onChange={(e) => setComplaintTypeFilter(e.target.value)}
            className="px-2 py-1 text-[11px] bg-slate-100 border border-slate-200 rounded focus:outline-hidden"
          >
            <option value="ALL">Job Type: All</option>
            <option value="Shop Repair">Shop Repair</option>
            <option value="Home Visit">Home Visit</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-2 py-1 text-[11px] bg-slate-100 border border-slate-200 rounded focus:outline-hidden"
          >
            <option value="ALL">Payment: All</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Ticket # &amp; Date</th>
                  <th className="py-2.5 px-3">Customer Details</th>
                  <th className="py-2.5 px-3">Product &amp; Fault</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Technician / SC</th>
                  <th className="py-2.5 px-3">Warranty &amp; Location</th>
                  <th className="py-2.5 px-3 text-right">Amount / Margin</th>
                  <th className="py-2.5 px-3 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No complaints match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const tech = technicians.find((t) => t.id === ticket.assignedTechnicianId);
                    const sc = serviceCentres.find((s) => s.id === ticket.assignedServiceCentreId);
                    const isOverdue =
                      ticket.status !== 'Closed' &&
                      ticket.status !== 'Delivered' &&
                      ticket.followUp?.followUpDate &&
                      ticket.followUp.followUpDate < todayStr;

                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Ticket & Date */}
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <button
                            onClick={() => onSelectTicket(ticket)}
                            className="font-mono font-bold text-blue-600 hover:text-blue-800 hover:underline block text-left"
                          >
                            {ticket.ticketNumber}
                          </button>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {ticket.date}
                          </span>
                          {ticket.companyLoginNumber && (
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-mono block mt-1 w-fit" title="Company Brand Portal ID">
                              {ticket.companyLoginNumber}
                            </span>
                          )}
                        </td>

                        {/* Customer */}
                        <td className="py-2.5 px-3 align-top">
                          <div className="font-semibold text-slate-900">
                            {ticket.customerName}
                          </div>
                          <div className="text-slate-500 font-mono text-[11px]">
                            {ticket.mobile}
                          </div>
                          <div className="text-slate-400 text-[11px] truncate max-w-[180px]">
                            {ticket.area}
                          </div>
                        </td>

                        {/* Product & Fault */}
                        <td className="py-2.5 px-3 align-top max-w-[220px]">
                          <div className="font-semibold text-slate-800">
                            {ticket.brand} {ticket.productCategory}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            Model: {ticket.model || 'N/A'}
                          </div>
                          <div className="text-slate-600 text-[11px] line-clamp-1 italic mt-0.5">
                            "{ticket.problemDescription}"
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <StatusBadge status={ticket.status} size="sm" />
                          {isOverdue && (
                            <span className="block text-[10px] text-red-600 font-bold mt-1">
                              ⚠️ Follow-up Overdue
                            </span>
                          )}
                        </td>

                        {/* Technician / SC */}
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          {ticket.assignedType === 'technician' && tech ? (
                            <div>
                              <span className="font-medium text-slate-800 block">
                                {tech.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                📞 {tech.mobile}
                              </span>
                            </div>
                          ) : ticket.assignedType === 'service_centre' && sc ? (
                            <div>
                              <span className="font-medium text-purple-800 block">
                                {sc.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Authorized SC
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Warranty & Location */}
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {ticket.warrantyStatus === 'In Warranty' ? (
                              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                In Warranty
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500">
                                Out of Warranty
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            📍 {ticket.productLocation}
                          </div>
                        </td>

                        {/* Amount / Margin */}
                        <td className="py-2.5 px-3 align-top text-right whitespace-nowrap">
                          <div className="font-bold tabular-nums text-slate-900">
                            ₹{ticket.billing.customerAmount}
                          </div>
                          {ticket.billing.grossMargin > 0 && (
                            <div className="text-[10px] text-emerald-600 font-medium">
                              Margin: ₹{ticket.billing.grossMargin}
                            </div>
                          )}
                          <div className="mt-0.5">
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                ticket.billing.paymentStatus === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ticket.billing.paymentStatus === 'Partial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {ticket.billing.paymentStatus}
                            </span>
                          </div>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-2.5 px-3 align-top text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {/* WhatsApp to Technician */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const text = generateTechnicianWhatsAppText(ticket, tech || sc);
                                const phone = tech ? tech.mobile : sc ? sc.phone : ticket.mobile;
                                openWhatsApp(phone, text);
                              }}
                              className="p-1 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Send Job WhatsApp to Technician"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>

                            {/* Print Job Sheet */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPrintTicket(ticket);
                              }}
                              className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Print Job Sheet / Gate Pass"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Open Details */}
                            <button
                              onClick={() => onSelectTicket(ticket)}
                              className="px-2 py-0.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded"
                            >
                              Open
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: '1. New & Assigned',
              statuses: ['Complaint Received', 'Technician/Service Centre Assigned', 'Technician Attended'],
              color: 'border-blue-300 bg-blue-50/30'
            },
            {
              title: '2. Diagnosis & Parts',
              statuses: ['Diagnosis/Estimate Pending', 'Customer Approval Pending', 'Parts Pending'],
              color: 'border-amber-300 bg-amber-50/30'
            },
            {
              title: '3. Repair & Testing',
              statuses: ['Repair in Progress', 'On Hold'],
              color: 'border-purple-300 bg-purple-50/30'
            },
            {
              title: '4. Ready, Delivery & Closed',
              statuses: ['Ready', 'Customer Informed', 'Payment Pending', 'Delivered', 'Closed'],
              color: 'border-emerald-300 bg-emerald-50/30'
            }
          ].map((column) => {
            const colTickets = filteredTickets.filter((t) => column.statuses.includes(t.status));
            return (
              <div
                key={column.title}
                className={`border rounded-lg p-3 ${column.color} flex flex-col max-h-[750px]`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    {column.title}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                  {colTickets.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No tickets in this phase
                    </div>
                  ) : (
                    colTickets.map((ticket) => {
                      const tech = technicians.find((t) => t.id === ticket.assignedTechnicianId);
                      return (
                        <div
                          key={ticket.id}
                          onClick={() => onSelectTicket(ticket)}
                          className="bg-white border border-slate-200 hover:border-blue-400 rounded-md p-3 shadow-2xs cursor-pointer transition-all hover:shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-blue-600">
                              {ticket.ticketNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {ticket.date}
                            </span>
                          </div>

                          <div className="font-semibold text-slate-900 text-xs mt-1">
                            {ticket.customerName}
                          </div>
                          <div className="text-slate-600 text-xs">
                            {ticket.brand} {ticket.productCategory}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <StatusBadge status={ticket.status} size="sm" />
                            <span className="font-bold text-xs tabular-nums text-slate-800">
                              ₹{ticket.billing.customerAmount}
                            </span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{tech ? tech.name : 'Unassigned'}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const text = generateTechnicianWhatsAppText(ticket, tech);
                                openWhatsApp(tech ? tech.mobile : ticket.mobile, text);
                              }}
                              className="text-emerald-600 hover:underline flex items-center gap-0.5"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
