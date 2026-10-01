import { useMemo, useState } from 'react';
import { ComplaintTicket, Technician } from '../types';
import { exportToCSV } from '../utils/storage';
import {
  FileSpreadsheet,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ReportsViewProps {
  tickets: ComplaintTicket[];
  technicians: Technician[];
}

export function ReportsView({ tickets, technicians }: ReportsViewProps) {
  const [reportType, setReportType] = useState<'complaints' | 'financial' | 'technicians'>('complaints');

  // Breakdown statistics
  const stats = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    let inWarranty = 0;
    let outOfWarranty = 0;
    let shopCount = 0;
    let homeCount = 0;

    tickets.forEach((t) => {
      brandCounts[t.brand] = (brandCounts[t.brand] || 0) + 1;
      categoryCounts[t.productCategory] = (categoryCounts[t.productCategory] || 0) + 1;
      if (t.warrantyStatus === 'In Warranty') inWarranty++;
      else outOfWarranty++;
      if (t.complaintType === 'Shop Repair') shopCount++;
      else homeCount++;
    });

    return { brandCounts, categoryCounts, inWarranty, outOfWarranty, shopCount, homeCount };
  }, [tickets]);

  // CSV Export 1: All Complaints
  const handleExportComplaints = () => {
    const headers = [
      'Ticket Number',
      'Date',
      'Customer Name',
      'Mobile',
      'Alternate Mobile',
      'Area',
      'Address',
      'Product Category',
      'Brand',
      'Model',
      'Serial Number',
      'Problem Description',
      'Warranty Status',
      'Product Location',
      'Complaint Type',
      'Status',
      'Company Login #',
      'Technician Cost',
      'Customer Amount',
      'Gross Margin',
      'Payment Status',
      'Paid Amount',
      'Balance'
    ];

    const rows = tickets.map((t) => [
      t.ticketNumber,
      t.date,
      t.customerName,
      t.mobile,
      t.alternateMobile || '',
      t.area,
      t.address,
      t.productCategory,
      t.brand,
      t.model,
      t.serialNumber || '',
      t.problemDescription,
      t.warrantyStatus,
      t.productLocation,
      t.complaintType,
      t.status,
      t.companyLoginNumber || '',
      t.billing.technicianCost || 0,
      t.billing.customerAmount || 0,
      t.billing.grossMargin || 0,
      t.billing.paymentStatus,
      t.billing.paidAmount || 0,
      t.billing.balanceAmount || 0
    ]);

    exportToCSV(`Singh_Electronics_Complaints_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  // CSV Export 2: Financial Margin Ledger
  const handleExportFinancials = () => {
    const headers = [
      'Ticket Number',
      'Date',
      'Customer Name',
      'Mobile',
      'Repair Type',
      'Customer Total (INR)',
      'Technician Cost (INR)',
      'Handling Charge (INR)',
      'Tech Commission (INR)',
      'Gross Margin (INR)',
      'Payment Status',
      'Amount Collected (INR)',
      'Balance Outstanding (INR)'
    ];

    const rows = tickets.map((t) => [
      t.ticketNumber,
      t.date,
      t.customerName,
      t.mobile,
      t.billing.repairType === 'Shop' ? 'At Shop (Margin)' : 'At Home (Commission)',
      t.billing.customerAmount,
      t.billing.technicianCost,
      t.billing.handlingCharge,
      t.billing.technicianCommission,
      t.billing.grossMargin,
      t.billing.paymentStatus,
      t.billing.paidAmount,
      t.billing.balanceAmount
    ]);

    exportToCSV(`Singh_Electronics_Financial_Margins_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  // CSV Export 3: Technician Performance
  const handleExportTechnicians = () => {
    const headers = [
      'Technician Name',
      'Mobile',
      'Specialties',
      'Brand Login ID',
      'Status',
      'Default Commission/Job',
      'Total Assigned Jobs',
      'Completed Jobs',
      'Active Pending Jobs',
      'Total Earned Commission (INR)'
    ];

    const rows = technicians.map((tech) => {
      const assigned = tickets.filter((t) => t.assignedTechnicianId === tech.id);
      const completed = assigned.filter((t) => t.status === 'Closed' || t.status === 'Delivered');
      const pending = assigned.length - completed.length;
      const totalCommission = completed.reduce((acc, t) => acc + (t.billing.technicianCommission || 0), 0);

      return [
        tech.name,
        tech.mobile,
        tech.specialties.join('; '),
        tech.companyLoginNumber,
        tech.status,
        tech.defaultHomeCommission,
        assigned.length,
        completed.length,
        pending,
        totalCommission
      ];
    });

    exportToCSV(`Singh_Electronics_Technicians_Report_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Reports &amp; Data Export (Excel / CSV)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download comprehensive spreadsheets matching Statement of Work requirements
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportComplaints}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Complaints CSV</span>
          </button>

          <button
            onClick={handleExportFinancials}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Margins CSV</span>
          </button>

          <button
            onClick={handleExportTechnicians}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Tech Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Warranty Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Warranty Status Ratio
            </h3>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">In Warranty (Company Claims):</span>
              <span className="font-bold tabular-nums text-emerald-700">{stats.inWarranty} tickets</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${(stats.inWarranty / Math.max(1, tickets.length)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-600">Out of Warranty (Paid Repairs):</span>
              <span className="font-bold tabular-nums text-slate-800">{stats.outOfWarranty} tickets</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.outOfWarranty / Math.max(1, tickets.length)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Complaint Type Ratio */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Service Location Ratio
            </h3>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">🏢 At Shop Repairs:</span>
              <span className="font-bold tabular-nums text-blue-800">{stats.shopCount} jobs</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.shopCount / Math.max(1, tickets.length)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-600">🏠 At Home Visits:</span>
              <span className="font-bold tabular-nums text-indigo-800">{stats.homeCount} jobs</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${(stats.homeCount / Math.max(1, tickets.length)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Top Handled Brands
            </h3>
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>

          <div className="space-y-1.5 text-xs">
            {Object.entries(stats.brandCounts).slice(0, 4).map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between py-0.5">
                <span className="font-semibold text-slate-700">{brand}</span>
                <span className="font-mono text-slate-500">{count} tickets</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            List Preview: All Recorded Complaints ({tickets.length})
          </h3>
          <span className="text-xs text-slate-500">
            Complete details ready for export
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-2">Ticket #</th>
                <th className="p-2">Date</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Product</th>
                <th className="p-2">Warranty</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Customer (₹)</th>
                <th className="p-2 text-right">Tech Cost (₹)</th>
                <th className="p-2 text-right">Gross Margin (₹)</th>
                <th className="p-2">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold text-blue-600">{t.ticketNumber}</td>
                  <td className="p-2 text-slate-500">{t.date}</td>
                  <td className="p-2 font-medium text-slate-800">{t.customerName}</td>
                  <td className="p-2 text-slate-600">{t.brand} {t.productCategory}</td>
                  <td className="p-2 text-slate-600">{t.warrantyStatus}</td>
                  <td className="p-2 font-medium text-slate-800">{t.status}</td>
                  <td className="p-2 text-right font-mono font-bold">₹{t.billing.customerAmount}</td>
                  <td className="p-2 text-right font-mono text-slate-600">₹{t.billing.technicianCost}</td>
                  <td className="p-2 text-right font-mono font-bold text-emerald-700">₹{t.billing.grossMargin}</td>
                  <td className="p-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800">
                      {t.billing.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
