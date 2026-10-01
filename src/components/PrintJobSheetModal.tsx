import { ComplaintTicket, SystemSettings } from '../types';
import { X, Printer } from 'lucide-react';

interface PrintJobSheetModalProps {
  ticket: ComplaintTicket;
  settings: SystemSettings;
  onClose: () => void;
}

export function PrintJobSheetModal({
  ticket,
  settings,
  onClose
}: PrintJobSheetModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Modal Controls (Not printed) */}
        <div className="no-print p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Print Preview: Service Job Sheet &amp; Gate Pass
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Job Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Body */}
        <div className="p-8 overflow-y-auto flex-1 text-slate-900 text-xs font-sans print:p-0 print:m-0">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-950">
              {settings.shopName}
            </h1>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Authorized Multi-Brand LED TV, Refrigerator, AC, Washing Machine &amp; Electronics Service Center
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {settings.shopAddress}
            </p>
            <p className="text-[11px] text-slate-800 font-semibold mt-0.5 font-mono">
              📞 {settings.shopPhone} · GSTIN: {settings.shopGstin}
            </p>
          </div>

          {/* Document Title & Ticket Bar */}
          <div className="flex items-center justify-between bg-slate-100 p-2.5 border border-slate-300 rounded mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                SERVICE JOB SHEET / DELIVERY CHALLAN
              </span>
              <span className="text-[11px] text-slate-600">
                Mode: {ticket.complaintType} · Location: {ticket.productLocation}
              </span>
            </div>

            <div className="text-right">
              <span className="text-sm font-extrabold font-mono text-blue-900 block">
                {ticket.ticketNumber}
              </span>
              <span className="text-[11px] text-slate-600">
                Date: {ticket.date}
              </span>
            </div>
          </div>

          {/* Customer & Appliance Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Customer Box */}
            <div className="border border-slate-300 rounded p-3 space-y-1">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-1">
                Customer Information
              </span>
              <div className="pt-1">
                <span className="font-bold text-sm block">{ticket.customerName}</span>
                <span className="font-mono text-slate-800 block">Phone: {ticket.mobile}</span>
                <span className="text-slate-600 block text-[11px]">{ticket.address}</span>
                <span className="text-slate-700 font-medium block text-[11px]">Area: {ticket.area}, Korba</span>
              </div>
            </div>

            {/* Appliance Box */}
            <div className="border border-slate-300 rounded p-3 space-y-1">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-1">
                Appliance Information
              </span>
              <div className="pt-1">
                <span className="font-bold text-sm block">{ticket.brand} {ticket.productCategory}</span>
                <span className="font-mono text-slate-800 block text-[11px]">Model: {ticket.model || 'Standard'}</span>
                <span className="font-mono text-slate-600 block text-[11px]">Serial: {ticket.serialNumber || 'N/A'}</span>
                <span className="text-slate-700 font-semibold block text-[11px]">
                  Warranty: {ticket.warrantyStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Fault Reported & Accessories Received */}
          <div className="border border-slate-300 rounded p-3 mb-4 space-y-2">
            <div>
              <span className="font-bold text-slate-700 block">Reported Defect / Customer Problem:</span>
              <p className="font-semibold text-slate-900 italic mt-0.5">
                "{ticket.problemDescription}"
              </p>
            </div>

            <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <span className="font-bold text-slate-700">Accessories Received: </span>
                <span className="text-slate-800 font-medium">
                  {ticket.accessoriesReceived.length > 0 ? ticket.accessoriesReceived.join(', ') : 'None'}
                </span>
              </div>
              {ticket.companyLoginNumber && (
                <div>
                  <span className="font-bold text-slate-700">Company Portal Call ID: </span>
                  <span className="font-mono font-bold text-blue-900">{ticket.companyLoginNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Billing & Settlement Summary */}
          <div className="border border-slate-300 rounded p-3 mb-4">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-1 mb-2">
              Billing &amp; Payment Summary
            </span>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">Estimated / Total</span>
                <span className="font-bold font-mono text-sm text-slate-900">
                  ₹{ticket.billing.customerAmount}
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">Advance Paid</span>
                <span className="font-bold font-mono text-sm text-emerald-700">
                  ₹{ticket.billing.paidAmount}
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">Balance Due</span>
                <span className="font-bold font-mono text-sm text-amber-700">
                  ₹{ticket.billing.balanceAmount}
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">Payment Status</span>
                <span className="font-bold uppercase text-xs text-slate-800 block mt-0.5">
                  {ticket.billing.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="text-[10px] text-slate-600 space-y-1 border-t border-slate-200 pt-3 mb-6">
            <span className="font-bold text-slate-800 uppercase block">Terms &amp; Conditions:</span>
            <p>1. Original Job Sheet receipt must be produced at the time of delivery.</p>
            <p>2. Repair warranty of 30 days is applicable strictly on replaced components / repaired PCB, not on entire appliance or liquid/physical damage.</p>
            <p>3. Goods not collected within 45 days of ready notification shall be disposed of and shop holds no liability.</p>
            <p>4. All disputes are subject to Korba (Chhattisgarh) jurisdiction only.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-dashed border-slate-300">
            <div className="text-center">
              <div className="border-b border-slate-400 w-48 mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">
                Customer Signature &amp; Acknowledgment
              </span>
            </div>

            <div className="text-center">
              <div className="border-b border-slate-400 w-48 mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">
                For Singh Electronics, Korba (Authorized Signatory)
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
