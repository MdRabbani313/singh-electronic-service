import { useState } from 'react';
import {
  ComplaintTicket,
  Technician,
  ServiceCentre,
  UserAccount,
  SystemSettings,
  WarrantyStatus,
  ProductLocation,
  ComplaintType,
  Attachment
} from '../types';
import { X, Upload, Plus, Wrench, ShieldCheck, User, Calendar, MapPin, Building } from 'lucide-react';
import { generateNextTicketNumber } from '../utils/storage';

interface NewTicketModalProps {
  existingTickets: ComplaintTicket[];
  technicians: Technician[];
  serviceCentres: ServiceCentre[];
  settings: SystemSettings;
  activeUser: UserAccount;
  onClose: () => void;
  onAddTicket: (ticket: ComplaintTicket) => void;
}

const COMMON_ACCESSORIES = [
  'Remote Control',
  'Power Cable',
  'Table Top Stand / Legs',
  'Wall Mount Bracket',
  '19V Power Adapter',
  'Water Inlet Pipe',
  'Drain Pipe',
  'Glass Turntable Plate',
  'Bill Copy'
];

const PROBLEM_PRESETS = [
  'Sound OK, No Display / Black Screen (Backlight issue)',
  'Not Cooling (Compressor / Gas leak)',
  'Water Leaking from Unit',
  'Total Dead / No Power On',
  'Drain Motor Error (E3 / Loud vibration)',
  'Sparking & Burning Smell',
  'Red Standby Light Blinking (Motherboard issue)',
  'In Warranty Brand Service Requested'
];

const KORBA_AREAS = [
  'Kosabadi',
  'Transport Nagar',
  'TP Nagar',
  'Balco Nagar',
  'NTPC Colony (Jamnipali)',
  'Kusmunda',
  'Darri',
  'Risdi',
  'Budhwari',
  'CSEB Colony',
  'Gevra',
  'Manikpur',
  'Rampur',
  'Niharika'
];

export function NewTicketModal({
  existingTickets,
  technicians,
  serviceCentres,
  settings,
  activeUser,
  onClose,
  onAddTicket
}: NewTicketModalProps) {
  const autoTicketNo = generateNextTicketNumber(existingTickets);

  // Form states
  const [ticketNumber, setTicketNumber] = useState(autoTicketNo);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [complaintType, setComplaintType] = useState<ComplaintType>('Shop Repair');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [area, setArea] = useState('Kosabadi');
  const [address, setAddress] = useState('');
  
  const [productCategory, setProductCategory] = useState(settings.categories[0] || 'LED TV');
  const [brand, setBrand] = useState(settings.brands[0] || 'Samsung');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  
  const [warrantyStatus, setWarrantyStatus] = useState<WarrantyStatus>('Out of Warranty');
  const [productLocation, setProductLocation] = useState<ProductLocation>('Shop');
  const [accessoriesReceived, setAccessoriesReceived] = useState<string[]>([]);
  const [customAccessory, setCustomAccessory] = useState('');
  const [remarks, setRemarks] = useState('');
  const [companyLoginNumber, setCompanyLoginNumber] = useState('');

  // Initial assignment
  const [assignedType, setAssignedType] = useState<'technician' | 'service_centre' | 'unassigned'>('technician');
  const [assignedTechnicianId, setAssignedTechnicianId] = useState(technicians[0]?.id || '');
  const [assignedServiceCentreId, setAssignedServiceCentreId] = useState(serviceCentres[0]?.id || '');

  // Follow-up
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [followUpNotes, setFollowUpNotes] = useState('Initial inspection & diagnosis');

  // Advance Payment
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [advanceMode, setAdvanceMode] = useState<'Cash' | 'UPI'>('Cash');

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bill' | 'photo' | 'fault') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newAtt: Attachment = {
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

  const toggleAccessory = (acc: string) => {
    if (accessoriesReceived.includes(acc)) {
      setAccessoriesReceived(accessoriesReceived.filter((a) => a !== acc));
    } else {
      setAccessoriesReceived([...accessoriesReceived, acc]);
    }
  };

  const handleAddCustomAccessory = () => {
    if (customAccessory.trim() && !accessoriesReceived.includes(customAccessory.trim())) {
      setAccessoriesReceived([...accessoriesReceived, customAccessory.trim()]);
      setCustomAccessory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !mobile.trim() || !problemDescription.trim()) {
      alert('Please fill customer name, mobile number, and problem description.');
      return;
    }

    const now = new Date().toISOString();
    const payments = [];
    if (advanceAmount > 0) {
      payments.push({
        id: `pay-${Date.now()}`,
        date: date,
        amount: Number(advanceAmount),
        mode: advanceMode,
        referenceNo: advanceMode === 'UPI' ? 'Advance UPI' : 'Counter Cash',
        collectedBy: activeUser.name,
        notes: 'Advance deposit at complaint intake'
      });
    }

    const newTicket: ComplaintTicket = {
      id: ticketNumber,
      ticketNumber,
      date,
      createdAt: now,
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      alternateMobile: alternateMobile.trim() || undefined,
      address: address.trim() || `${area}, Korba`,
      area,
      productCategory,
      brand,
      model: model.trim(),
      serialNumber: serialNumber.trim() || undefined,
      problemDescription: problemDescription.trim(),
      warrantyStatus,
      productLocation,
      complaintType,
      accessoriesReceived,
      remarks: remarks.trim(),
      attachments,
      companyLoginNumber: companyLoginNumber.trim() || undefined,
      status: assignedType !== 'unassigned' ? 'Technician/Service Centre Assigned' : 'Complaint Received',
      assignedType,
      assignedTechnicianId: assignedType === 'technician' ? assignedTechnicianId : undefined,
      assignedServiceCentreId: assignedType === 'service_centre' ? assignedServiceCentreId : undefined,
      assignedAt: assignedType !== 'unassigned' ? now : undefined,
      diagnosis: {
        partsRequired: []
      },
      customerApproval: {
        status: 'Pending'
      },
      billing: {
        repairType: complaintType === 'Home Visit' ? 'Home' : 'Shop',
        technicianCost: 0,
        customerAmount: 0,
        handlingCharge: complaintType === 'Shop Repair' ? settings.defaultHandlingCharge : 0,
        technicianCommission: complaintType === 'Home Visit' ? settings.defaultHomeCommission : 0,
        grossMargin: 0,
        paymentStatus: advanceAmount > 0 ? 'Partial' : 'Unpaid',
        paidAmount: advanceAmount,
        balanceAmount: 0,
        payments
      },
      delivery: {
        isReady: false,
        isCustomerInformed: false,
        deliveryStatus: 'Not Ready'
      },
      followUp: {
        followUpDate: followUpDate || date,
        notes: followUpNotes,
        isResolved: false
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: now,
          action: 'Complaint Registered',
          userName: activeUser.name,
          userRole: activeUser.role,
          details: `Ticket ${ticketNumber} created by ${activeUser.name}. Advance: ₹${advanceAmount}.`
        }
      ]
    };

    onAddTicket(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Register New Complaint</span>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {ticketNumber}
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Singh Electronics, Korba · Automatic ticket generation with customer &amp; product details
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 text-xs space-y-5">
          
          {/* Section 1: Complaint Type, Date & Location */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                Complaint Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                Complaint Type:
              </label>
              <select
                value={complaintType}
                onChange={(e) => {
                  const val = e.target.value as ComplaintType;
                  setComplaintType(val);
                  if (val === 'Home Visit') {
                    setProductLocation('Customer Home');
                  } else {
                    setProductLocation('Shop');
                  }
                }}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold"
              >
                <option value="Shop Repair">🏢 Shop Repair (Brought to counter)</option>
                <option value="Home Visit">🏠 Home Visit (On-Site in Korba)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                Warranty Status:
              </label>
              <select
                value={warrantyStatus}
                onChange={(e) => setWarrantyStatus(e.target.value as WarrantyStatus)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
              >
                <option value="Out of Warranty">Out of Warranty</option>
                <option value="In Warranty">In Warranty (Check Bill)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                Product Current Location:
              </label>
              <select
                value={productLocation}
                onChange={(e) => setProductLocation(e.target.value as ProductLocation)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
              >
                <option value="Shop">Shop</option>
                <option value="Customer Home">Customer Home</option>
                <option value="Service Centre">Service Centre</option>
              </select>
            </div>
          </div>

          {/* Section 2: Customer Details */}
          <div className="p-4 border border-slate-200 rounded-lg space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Agrawal"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="10 digit mobile"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  placeholder="Optional alternate #"
                  value={alternateMobile}
                  onChange={(e) => setAlternateMobile(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Area / Locality in Korba
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
                >
                  {KORBA_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  House / Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. House No. 42, Near SBI Bank, Kosabadi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Product Details & Problem Description */}
          <div className="p-4 border border-slate-200 rounded-lg space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-blue-600" />
              Product &amp; Defect Description
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Product Category:
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                >
                  {settings.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Brand:
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                >
                  {settings.brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Model Number:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 43UQ7550PSF"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Serial Number:
                </label>
                <input
                  type="text"
                  placeholder="e.g. SN-881923"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-600 text-[11px] font-semibold">
                  Reported Problem Description *
                </label>
                <span className="text-[10px] text-slate-400">Click a preset below or type custom</span>
              </div>
              <textarea
                rows={2}
                required
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe fault in detail (sound OK but no picture, water leakage, sparking, error code...)"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {PROBLEM_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProblemDescription(preset)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] text-slate-600 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Accessories Received & Attachments */}
          <div className="p-4 border border-slate-200 rounded-lg space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
              Accessories Received &amp; Photo Attachments
            </h3>

            <div>
              <label className="text-slate-600 block text-[11px] font-semibold mb-1.5">
                Check Accessories Received at Counter:
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ACCESSORIES.map((acc) => {
                  const isChecked = accessoriesReceived.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccessory(acc)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {acc}
                    </button>
                  );
                })}
              </div>

              {/* Custom accessory input */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Other accessory..."
                  value={customAccessory}
                  onChange={(e) => setCustomAccessory(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs w-48"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAccessory}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Attachment upload */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block text-xs">
                  Attach Purchase Bill or Appliance Photos:
                </span>
                <span className="text-[10px] text-slate-400">
                  {attachments.length} attachment(s) uploaded
                </span>
              </div>

              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload Bill / Photo</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'bill')}
                />
              </label>
            </div>
          </div>

          {/* Section 5: Assignment, Brand Login & Advance Payment */}
          <div className="p-4 border border-blue-200 bg-blue-50/20 rounded-lg space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
              Initial Assignment &amp; Counter Advance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Assign Immediately:
                </label>
                <select
                  value={assignedType}
                  onChange={(e) => setAssignedType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                >
                  <option value="technician">Shop Technician</option>
                  <option value="service_centre">Authorized SC</option>
                  <option value="unassigned">Unassigned (Later)</option>
                </select>
              </div>

              {assignedType === 'technician' && (
                <div>
                  <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                    Select Technician:
                  </label>
                  <select
                    value={assignedTechnicianId}
                    onChange={(e) => setAssignedTechnicianId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {assignedType === 'service_centre' && (
                <div>
                  <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                    Select Service Centre:
                  </label>
                  <select
                    value={assignedServiceCentreId}
                    onChange={(e) => setAssignedServiceCentreId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                  >
                    {serviceCentres.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Company Login / Brand Portal ID:
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAM-KBA-190"
                  value={companyLoginNumber}
                  onChange={(e) => setCompanyLoginNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-semibold mb-1">
                  Advance Collected (₹):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Intake Staff: <strong className="text-slate-800">{activeUser.name}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              Save &amp; Generate Job Ticket
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
