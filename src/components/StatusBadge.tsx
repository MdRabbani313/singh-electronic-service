import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Complaint Received':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Technician/Service Centre Assigned':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Technician Attended':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'Diagnosis/Estimate Pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Customer Approval Pending':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Parts Pending':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Repair in Progress':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Ready':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Customer Informed':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'Payment Pending':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      case 'Delivered':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Closed':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'On Hold':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case 'Parts Pending':
      case 'On Hold':
        return 'bg-red-500';
      case 'Customer Approval Pending':
      case 'Diagnosis/Estimate Pending':
      case 'Payment Pending':
        return 'bg-amber-500';
      case 'Ready':
      case 'Customer Informed':
      case 'Delivered':
      case 'Closed':
        return 'bg-emerald-500';
      default:
        return 'bg-blue-500';
    }
  };

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border ${textSize} ${getStatusColor()} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
