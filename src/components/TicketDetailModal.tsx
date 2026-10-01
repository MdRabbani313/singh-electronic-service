import { useState } from 'react';
import {
  ComplaintTicket,
  Technician,
  ServiceCentre,
  UserAccount,
  ComplaintStatus,
  WarrantyStatus,
  ProductLocation,
  ComplaintType,
  PaymentMode,
  PartItem,
  PaymentTransaction
} from '../types';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Phone,
  MessageSquare,
  Printer,
  Calendar,
  Clock,
  User,
  MapPin,
  Wrench,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Truck,
  Plus,
  Trash2,
  Upload,
  History,
  ShieldCheck,
  ShieldAlert,
  Send,
  Building
} from 'lucide-react';
import {
  openWhatsApp,
  generateTechnicianWhatsAppText,
  generateCustomerWhatsAppText
} from '../utils/whatsapp';

interface TicketDetailModalProps {
  ticket: ComplaintTicket;
  technicians: Technician[];
  serviceCentres: ServiceCentre[];
  activeUser: UserAccount;
  onClose: () => void;
  onUpdateTicket: (updated: ComplaintTicket) => void;
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

export function TicketDetailModal({
  ticket,
  technicians,
  serviceCentres,
  activeUser,
  onClose,
  onUpdateTicket,
  onPrintTicket
}: TicketDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'diagnosis' | 'billing' | 'delivery' | 'timeline'>('details');

  // Form states
  const [status, setStatus] = useState<ComplaintStatus>(ticket.status);
  const [assignedType, setAssignedType] = useState(ticket.assignedType);
  const [assignedTechnicianId, setAssignedTechnicianId] = useState(ticket.assignedTechnicianId || '');
  const [assignedServiceCentreId, setAssignedServiceCentreId] = useState(ticket.assignedServiceCentreId || '');
  const [companyLoginNumber, setCompanyLoginNumber] = useState(ticket.companyLoginNumber || '');
  const [remarks, setRemarks] = useState(ticket.remarks);
  const [followUpDate, setFollowUpDate] = useState(ticket.followUp?.followUpDate || '');
  const [followUpNotes, setFollowUpNotes] = useState(ticket.followUp?.notes || '');
  const [warrantyStatus, setWarrantyStatus] = useState<WarrantyStatus>(ticket.warrantyStatus);
  const [productLocation, setProductLocation] = useState<ProductLocation>(ticket.productLocation);

  // Diagnosis state
  const [faultFound, setFaultFound] = useState(ticket.diagnosis.faultFound || '');
  const [estimateAmount, setEstimateAmount] = useState<number>(ticket.diagnosis.estimateAmount || ticket.billing.customerAmount || 0);
  const [technicianNotes, setTechnicianNotes] = useState(ticket.diagnosis.technicianNotes || '');
  const [parts, setParts] = useState<PartItem[]>(ticket.diagnosis.partsRequired || []);
  const [tentativeReadyDate, setTentativeReadyDate] = useState(ticket.diagnosis.tentativeReadyDate || '');

  // Part form temp
  const [newPartName, setNewPartName] = useState('');
  const [newPartCost, setNewPartCost] = useState<number>(0);
  const [newPartStatus, setNewPartStatus] = useState<'Available' | 'Ordered' | 'Pending'>('Available');
  const [newPartTracking, setNewPartTracking] = useState('');

  // Customer approval
  const [approvalStatus, setApprovalStatus] = useState(ticket.customerApproval.status);
  const [approvalRemarks, setApprovalRemarks] = useState(ticket.customerApproval.remarks || '');

  // Billing state
  const [repairType, setRepairType] = useState<'Shop' | 'Home'>(ticket.billing.repairType);
  const [technicianCost, setTechnicianCost] = useState<number>(ticket.billing.technicianCost || 0);
  const [customerAmount, setCustomerAmount] = useState<number>(ticket.billing.customerAmount || 0);
  const [handlingCharge, setHandlingCharge] = useState<number>(ticket.billing.handlingCharge || 0);
  const [technicianCommission, setTechnicianCommission] = useState<number>(ticket.billing.technicianCommission || 0);
  const [payments, setPayments] = useState<PaymentTransaction[]>(ticket.billing.payments || []);

  // New payment form
  const [newPayAmount, setNewPayAmount] = useState<number>(0);
  const [newPayMode, setNewPayMode] = useState<PaymentMode>('UPI');
  const [newPayRef, setNewPayRef] = useState('');
  const [newPayNotes, setNewPayNotes] = useState('');

  // Delivery state
  const [deliveryStatus, setDeliveryStatus] = useState(ticket.delivery.deliveryStatus);
  const [deliveryDate, setDeliveryDate] = useState(ticket.delivery.deliveryDate || '');
  const [deliveredBy, setDeliveredBy] = useState(ticket.delivery.deliveredBy || activeUser.name);
  const [deliveredTo, setDeliveredTo] = useState(ticket.delivery.deliveredTo || ticket.customerName);
  const [deliveryRemarks, setDeliveryRemarks] = useState(ticket.delivery.deliveryRemarks || '');
  const [customerInformed, setCustomerInformed] = useState(ticket.delivery.isCustomerInformed);

  // Attachments
  const [attachments, setAttachments] = useState(ticket.attachments || []);

  // Handle image upload via base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bill' | 'photo' | 'fault') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        url,
        type,
        timestamp: new Date().toISOString()
      };
      setAttachments([...attachments, newAtt]);
    };
    reader.readAsDataURL(file);
  };

  // Add a part to required list
  const handleAddPart = () => {
    if (!newPartName.trim()) return;
    const item: PartItem = {
      id: `p-${Date.now()}`,
      partName: newPartName,
      partCost: Number(newPartCost) || 0,
      status: newPartStatus,
      orderDate: newPartStatus === 'Ordered' ? new Date().toISOString().split('T')[0] : undefined,
      trackingNo: newPartTracking || undefined
    };
    setParts([...parts, item]);
    setNewPartName('');
    setNewPartCost(0);
    setNewPartTracking('');
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  // Record payment
  const handleAddPayment = () => {
    if (newPayAmount <= 0) return;
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: Number(newPayAmount),
      mode: newPayMode,
      referenceNo: newPayRef || undefined,
      collectedBy: activeUser.name,
      notes: newPayNotes || undefined
    };
    setPayments([...payments, newTx]);
    setNewPayAmount(0);
    setNewPayRef('');
    setNewPayNotes('');
  };

  // Dynamic calculations
  const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const balance = Math.max(0, customerAmount - totalPaid);
  const paymentStatus: 'Paid' | 'Partial' | 'Unpaid' =
    totalPaid >= customerAmount && customerAmount > 0
      ? 'Paid'
      : totalPaid > 0
      ? 'Partial'
      : 'Unpaid';

  // Gross Margin: At Shop -> customerAmount - technicianCost - handlingCharge
  // At Home -> customerAmount - technicianCommission
  const calculatedMargin =
    repairType === 'Shop'
      ? customerAmount - technicianCost - handlingCharge
      : customerAmount - technicianCommission;

  // Save changes
  const handleSave = () => {
    const isStatusChanged = status !== ticket.status;
    const isTechChanged = assignedTechnicianId !== ticket.assignedTechnicianId;
    const isPayAdded = payments.length > (ticket.billing.payments?.length || 0);

    const now = new Date().toISOString();
    const timelineUpdates = [...ticket.timeline];

    if (isStatusChanged) {
      timelineUpdates.unshift({
        id: `tl-${Date.now()}-1`,
        timestamp: now,
        action: `Status changed to ${status}`,
        userName: activeUser.name,
        userRole: activeUser.role,
        previousStatus: ticket.status,
        newStatus: status
      });
    }

    if (isTechChanged) {
      const assignedTech = technicians.find((t) => t.id === assignedTechnicianId);
      timelineUpdates.unshift({
        id: `tl-${Date.now()}-2`,
        timestamp: now,
        action: `Assigned to ${assignedTech ? assignedTech.name : 'new technician'}`,
        userName: activeUser.name,
        userRole: activeUser.role
      });
    }

    if (isPayAdded) {
      timelineUpdates.unshift({
        id: `tl-${Date.now()}-3`,
        timestamp: now,
        action: `Payment recorded (Total Paid: ₹${totalPaid})`,
        userName: activeUser.name,
        userRole: activeUser.role
      });
    }

    const updated: ComplaintTicket = {
      ...ticket,
      status,
      assignedType,
      assignedTechnicianId: assignedTechnicianId || undefined,
      assignedServiceCentreId: assignedServiceCentreId || undefined,
      companyLoginNumber: companyLoginNumber || undefined,
      remarks,
      warrantyStatus,
      productLocation,
      attachments,
      diagnosis: {
        faultFound,
        estimateAmount,
        technicianNotes,
        partsRequired: parts,
        tentativeReadyDate
      },
      customerApproval: {
        status: approvalStatus,
        approvedAmount: approvalStatus === 'Approved' ? customerAmount : undefined,
        approvedAt: approvalStatus === 'Approved' ? now : undefined,
        remarks: approvalRemarks
      },
      billing: {
        repairType,
        technicianCost,
        customerAmount,
        handlingCharge,
        technicianCommission,
        grossMargin: calculatedMargin,
        paymentStatus,
        paidAmount: totalPaid,
        balanceAmount: balance,
        payments
      },
      delivery: {
        isReady: status === 'Ready' || deliveryStatus === 'Ready' || deliveryStatus === 'Delivered',
        readyDate: status === 'Ready' && !ticket.delivery.readyDate ? now : ticket.delivery.readyDate,
        isCustomerInformed: customerInformed,
        customerInformedDate: customerInformed ? now : undefined,
        deliveryStatus,
        deliveryDate: deliveryStatus === 'Delivered' ? (deliveryDate || now) : undefined,
        deliveredBy,
        deliveredTo,
        deliveryRemarks
      },
      followUp: {
        followUpDate: followUpDate || undefined,
        notes: followUpNotes || undefined,
        isResolved: status === 'Closed' || status === 'Delivered'
      },
      timeline: timelineUpdates
    };

    onUpdateTicket(updated);
    onClose();
  };

  const assignedTech = technicians.find((t) => t.id === assignedTechnicianId);
  const assignedSC = serviceCentres.find((s) => s.id === assignedServiceCentreId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {ticket.ticketNumber}
                </span>
                <StatusBadge status={status} size="md" />
                <span className="text-xs text-slate-500 font-medium">
                  {ticket.date}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                {ticket.customerName} · {ticket.mobile} · {ticket.brand} {ticket.productCategory}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Job Sheet */}
            <button
              onClick={() => onPrintTicket(ticket)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md flex items-center gap-1.5 shadow-2xs"
              title="Print Job Sheet / Gate Pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Job Sheet</span>
            </button>

            {/* WhatsApp to Technician */}
            <button
              onClick={() => {
                const text = generateTechnicianWhatsAppText(ticket, assignedTech || assignedSC);
                const phone = assignedTech ? assignedTech.mobile : ticket.mobile;
                openWhatsApp(phone, text);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Tech</span>
            </button>

            {/* WhatsApp to Customer */}
            <button
              onClick={() => {
                const text = generateCustomerWhatsAppText(ticket);
                openWhatsApp(ticket.mobile, text);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Customer</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold">
          {[
            { id: 'details', label: '1. Ticket Details & Assignment' },
            { id: 'diagnosis', label: '2. Diagnosis, Parts & Approval' },
            { id: 'billing', label: '3. Payment & Margins' },
            { id: 'delivery', label: '4. Delivery & Closing' },
            { id: 'timeline', label: '5. Activity Timeline' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* TAB 1: DETAILS & ASSIGNMENT */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Quick Status Bar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Change Status:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Follow-up Date:</span>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Follow-up notes..."
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-48"
                  />
                </div>
              </div>

              {/* Grid: Customer & Product */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Customer Information */}
                <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <User className="w-4 h-4 text-blue-600" />
                    Customer Details
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Customer Name</span>
                      <span className="font-semibold text-slate-800 text-sm">{ticket.customerName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Mobile</span>
                      <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                        <span>{ticket.mobile}</span>
                        <a
                          href={`tel:${ticket.mobile}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {ticket.alternateMobile && (
                      <div>
                        <span className="text-slate-400 block text-[11px]">Alternate Phone</span>
                        <span className="font-mono text-slate-700">{ticket.alternateMobile}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-400 block text-[11px]">Area in Korba</span>
                      <span className="font-semibold text-slate-800">{ticket.area}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Address</span>
                    <span className="text-slate-700">{ticket.address}</span>
                  </div>
                </div>

                {/* Product & Warranty */}
                <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Product &amp; Location
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Brand &amp; Category</span>
                      <span className="font-semibold text-slate-800">{ticket.brand} · {ticket.productCategory}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Model Number</span>
                      <span className="font-mono font-semibold text-slate-800">{ticket.model || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Serial Number</span>
                      <span className="font-mono text-slate-700">{ticket.serialNumber || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Job Type</span>
                      <span className="font-semibold text-slate-800">{ticket.complaintType}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Warranty Status</span>
                      <select
                        value={warrantyStatus}
                        onChange={(e) => setWarrantyStatus(e.target.value as WarrantyStatus)}
                        className="mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                      >
                        <option value="In Warranty">In Warranty</option>
                        <option value="Out of Warranty">Out of Warranty</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Product Location</span>
                      <select
                        value={productLocation}
                        onChange={(e) => setProductLocation(e.target.value as ProductLocation)}
                        className="mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                      >
                        <option value="Shop">Shop</option>
                        <option value="Customer Home">Customer Home</option>
                        <option value="Service Centre">Service Centre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Accessories Received</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ticket.accessoriesReceived.length > 0 ? (
                        ticket.accessoriesReceived.map((acc, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700">
                            {acc}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reported Problem & Remarks */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Customer Reported Problem:</span>
                <p className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-amber-950 font-medium">
                  {ticket.problemDescription}
                </p>

                <div className="pt-2">
                  <span className="font-bold text-slate-700 block text-xs mb-1">Staff / Intake Remarks:</span>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    placeholder="Enter additional remarks or accessories..."
                  />
                </div>
              </div>

              {/* Technician & Service Centre Assignment (SOW Section 2) */}
              <div className="p-4 border border-blue-200 bg-blue-50/20 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                    Technician Assignment &amp; Brand Portal Mapping
                  </h4>
                  <span className="text-[11px] text-blue-700 font-medium">
                    1-Click WhatsApp Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-500 block text-[11px] mb-1">Assign To:</label>
                    <select
                      value={assignedType}
                      onChange={(e) => setAssignedType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value="technician">Shop Technician</option>
                      <option value="service_centre">Company Authorized SC</option>
                      <option value="unassigned">Unassigned</option>
                    </select>
                  </div>

                  {assignedType === 'technician' && (
                    <div>
                      <label className="text-slate-500 block text-[11px] mb-1">Select Technician:</label>
                      <select
                        value={assignedTechnicianId}
                        onChange={(e) => setAssignedTechnicianId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                      >
                        <option value="">-- Choose Technician --</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.specialties.join(', ')})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {assignedType === 'service_centre' && (
                    <div>
                      <label className="text-slate-500 block text-[11px] mb-1">Select Service Centre:</label>
                      <select
                        value={assignedServiceCentreId}
                        onChange={(e) => setAssignedServiceCentreId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                      >
                        <option value="">-- Choose Service Centre --</option>
                        {serviceCentres.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            {sc.name} ({sc.authorizedBrands.join(', ')})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-slate-500 block text-[11px] mb-1">
                      Company Login / Portal Job #:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SAM-KB-8821 / LG-GSFS-401"
                      value={companyLoginNumber}
                      onChange={(e) => setCompanyLoginNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                {assignedTech && (
                  <div className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">
                        Assigned Tech: {assignedTech.name} · {assignedTech.mobile}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        Brand ID: {assignedTech.companyLoginNumber}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const text = generateTechnicianWhatsAppText(ticket, assignedTech);
                        openWhatsApp(assignedTech.mobile, text);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Job on WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Attachments & Photos (SOW: Attachment support bill and photos) */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                    Attachments &amp; Inspection Photos ({attachments.length})
                  </h4>

                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Bill / Photo</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'photo')}
                      />
                    </label>
                  </div>
                </div>

                {attachments.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 italic">
                    No attachments uploaded. Click "+ Bill / Photo" to upload purchase bill or product condition photos.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {attachments.map((att) => (
                      <div key={att.id} className="border border-slate-200 rounded overflow-hidden group relative">
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-24 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-1.5 bg-slate-50 text-[10px] text-slate-600 truncate flex items-center justify-between">
                          <span className="truncate">{att.name}</span>
                          <button
                            onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                            className="text-red-500 hover:text-red-700 ml-1"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DIAGNOSIS, PARTS & APPROVAL */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-5">
              {/* Diagnosis Finding */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                  Technician Diagnosis &amp; Estimate
                </h4>

                <div>
                  <label className="text-slate-600 block text-xs font-semibold mb-1">
                    Fault Detected / Root Cause:
                  </label>
                  <textarea
                    rows={2}
                    value={faultFound}
                    onChange={(e) => setFaultFound(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    placeholder="e.g. Backlight LED strip failure / Defrost bimetal short circuit / Drain motor damaged..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Repair Estimate to Customer (₹):
                    </label>
                    <input
                      type="number"
                      value={estimateAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEstimateAmount(val);
                        setCustomerAmount(val); // Keep customer amount synced
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Tentative Ready Date:
                    </label>
                    <input
                      type="date"
                      value={tentativeReadyDate}
                      onChange={(e) => setTentativeReadyDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block text-xs font-semibold mb-1">
                    Technician Inspection Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    placeholder="Notes regarding testing, components, or voltage readings..."
                  />
                </div>
              </div>

              {/* Spare Parts Tracking (SOW: parts-pending tracking) */}
              <div className="p-4 border border-rose-200 bg-rose-50/20 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                    Required Spare Parts List ({parts.length})
                  </h4>
                  <span className="text-[11px] text-rose-700 font-semibold">
                    Parts Pending Tracking
                  </span>
                </div>

                {/* Add new part form */}
                <div className="p-3 bg-white border border-slate-200 rounded-md grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-slate-500 text-[10px] block mb-0.5">Part Name &amp; Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. LG 43 Backlight Kit"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 text-[10px] block mb-0.5">Part Cost (₹)</label>
                    <input
                      type="number"
                      placeholder="Cost"
                      value={newPartCost}
                      onChange={(e) => setNewPartCost(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 text-[10px] block mb-0.5">Availability</label>
                    <select
                      value={newPartStatus}
                      onChange={(e) => setNewPartStatus(e.target.value as any)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                    >
                      <option value="Available">Available</option>
                      <option value="Ordered">Ordered</option>
                      <option value="Pending">Pending / Sourcing</option>
                    </select>
                  </div>

                  <div>
                    <button
                      onClick={handleAddPart}
                      className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                    >
                      + Add Part
                    </button>
                  </div>
                </div>

                {/* Parts list table */}
                {parts.length === 0 ? (
                  <div className="py-3 text-center text-slate-400 italic">
                    No spare parts required or listed yet.
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-2">Part Description</th>
                          <th className="p-2">Cost (₹)</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parts.map((p) => (
                          <tr key={p.id}>
                            <td className="p-2 font-medium text-slate-800">{p.partName}</td>
                            <td className="p-2 tabular-nums font-mono">₹{p.partCost}</td>
                            <td className="p-2">
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  p.status === 'Available'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : p.status === 'Ordered'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() => handleRemovePart(p.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Customer Approval Tracking (SOW: Customer approval tracking) */}
              <div className="p-4 border border-amber-200 bg-amber-50/20 rounded-lg space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                  Customer Estimate Approval
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Customer Decision:
                    </label>
                    <select
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold"
                    >
                      <option value="Pending">Approval Pending</option>
                      <option value="Approved">Approved by Customer</option>
                      <option value="Rejected">Rejected / Cancelled</option>
                      <option value="Negotiation">Price Renegotiation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Approval Remarks / Call Notes:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Customer agreed on phone call for Rs 2600"
                      value={approvalRemarks}
                      onChange={(e) => setApprovalRemarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING & MARGINS (SOW Section 4) */}
          {activeTab === 'billing' && (
            <div className="space-y-5">
              {/* Financial Calculation Setup */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                    Repair Pricing &amp; Margin Rules
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Repair Category:</span>
                    <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                      <button
                        onClick={() => setRepairType('Shop')}
                        className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                          repairType === 'Shop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                        }`}
                      >
                        At Shop (Margin)
                      </button>
                      <button
                        onClick={() => setRepairType('Home')}
                        className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                          repairType === 'Home' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                        }`}
                      >
                        At Home (Commission)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-slate-500 block text-[11px] font-medium">Customer Total (₹)</label>
                    <input
                      type="number"
                      value={customerAmount}
                      onChange={(e) => setCustomerAmount(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[11px] font-medium">Technician Cost (₹)</label>
                    <input
                      type="number"
                      value={technicianCost}
                      onChange={(e) => setTechnicianCost(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold font-mono"
                    />
                  </div>

                  {repairType === 'Shop' ? (
                    <div>
                      <label className="text-slate-500 block text-[11px] font-medium">Shop Handling Charge (₹)</label>
                      <input
                        type="number"
                        value={handlingCharge}
                        onChange={(e) => setHandlingCharge(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-slate-500 block text-[11px] font-medium">Tech Commission (₹)</label>
                      <input
                        type="number"
                        value={technicianCommission}
                        onChange={(e) => setTechnicianCommission(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold font-mono"
                      />
                    </div>
                  )}

                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                    <span className="text-emerald-700 block text-[10px] font-bold uppercase">Calculated Gross Margin</span>
                    <span className="text-base font-extrabold font-mono text-emerald-800">
                      ₹{calculatedMargin}
                    </span>
                    <span className="block text-[10px] text-emerald-600">
                      {repairType === 'Shop' ? 'Shop Profit' : 'Net After Commission'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payments & Transactions Log */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                      Payment History &amp; Collection
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Total Paid: ₹{totalPaid} · Outstanding Balance: ₹{balance}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : paymentStatus === 'Partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Status: {paymentStatus}
                  </span>
                </div>

                {/* Add payment transaction */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                  <div>
                    <label className="text-slate-500 text-[10px] block mb-0.5">Amount to Add (₹)</label>
                    <input
                      type="number"
                      value={newPayAmount}
                      onChange={(e) => setNewPayAmount(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 text-[10px] block mb-0.5">Mode</label>
                    <select
                      value={newPayMode}
                      onChange={(e) => setNewPayMode(e.target.value as any)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI / PhonePe / GPay</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 text-[10px] block mb-0.5">Reference / UTR #</label>
                    <input
                      type="text"
                      placeholder="e.g. PhonePe 99218"
                      value={newPayRef}
                      onChange={(e) => setNewPayRef(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 text-[10px] block mb-0.5">Notes</label>
                    <input
                      type="text"
                      placeholder="Advance / Delivery payment"
                      value={newPayNotes}
                      onChange={(e) => setNewPayNotes(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <button
                      onClick={handleAddPayment}
                      disabled={newPayAmount <= 0}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs font-semibold"
                    >
                      + Record Payment
                    </button>
                  </div>
                </div>

                {/* Payment entries list */}
                {payments.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 italic">
                    No payments recorded yet. Record advance or settlement payment above.
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-2">Date</th>
                          <th className="p-2">Amount</th>
                          <th className="p-2">Mode &amp; Ref</th>
                          <th className="p-2">Collected By</th>
                          <th className="p-2">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((tx) => (
                          <tr key={tx.id}>
                            <td className="p-2 font-mono text-slate-600">{tx.date}</td>
                            <td className="p-2 font-bold font-mono tabular-nums text-emerald-700">₹{tx.amount}</td>
                            <td className="p-2 font-medium text-slate-800">
                              {tx.mode} {tx.referenceNo ? `(${tx.referenceNo})` : ''}
                            </td>
                            <td className="p-2 text-slate-600">{tx.collectedBy}</td>
                            <td className="p-2 text-slate-500 italic">{tx.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY & CLOSING (SOW Section 5) */}
          {activeTab === 'delivery' && (
            <div className="space-y-5">
              <div className="p-4 border border-slate-200 rounded-lg space-y-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                  Delivery Flow (Ready → Customer Informed → Delivery Pending → Delivered → Closed)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Delivery Tracking Status:
                    </label>
                    <select
                      value={deliveryStatus}
                      onChange={(e) => setDeliveryStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value="Not Ready">Not Ready</option>
                      <option value="Ready">Ready</option>
                      <option value="Customer Informed">Customer Informed</option>
                      <option value="Delivery Pending">Delivery Pending</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Delivery Date &amp; Time:
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Delivered By (Staff):
                    </label>
                    <input
                      type="text"
                      value={deliveredBy}
                      onChange={(e) => setDeliveredBy(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Handed Over To (Customer/Representative):
                    </label>
                    <input
                      type="text"
                      value={deliveredTo}
                      onChange={(e) => setDeliveredTo(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-600 block text-xs font-semibold mb-1">
                      Delivery Remarks / Condition:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tested in front of customer, all accessories returned"
                      value={deliveryRemarks}
                      onChange={(e) => setDeliveryRemarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerInformed}
                      onChange={(e) => setCustomerInformed(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800">
                      Customer has been informed that product is ready
                    </span>
                  </label>
                </div>
              </div>

              {/* Fast closure box */}
              <div className="p-4 border border-emerald-200 bg-emerald-50/30 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-emerald-950 text-xs uppercase">
                      Ticket Closure Validation
                    </h5>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Ensure full payment is collected and product is physically delivered before marking ticket as Closed.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setStatus('Closed');
                      setDeliveryStatus('Delivered');
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold"
                  >
                    Mark Delivered &amp; Close Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE (SOW Section 3) */}
          {activeTab === 'timeline' && (
            <div className="p-4 border border-slate-200 rounded-lg space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                Complete Activity Timeline ({ticket.timeline.length} actions logged)
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {ticket.timeline.map((entry) => (
                  <div key={entry.id} className="relative group">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">
                          {entry.action}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(entry.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        By <span className="font-semibold text-slate-800">{entry.userName}</span> ({entry.userRole})
                      </div>
                      {entry.details && (
                        <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded border border-slate-200/60">
                          {entry.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Active editor: <span className="font-semibold text-slate-800">{activeUser.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              Save Ticket Updates
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
