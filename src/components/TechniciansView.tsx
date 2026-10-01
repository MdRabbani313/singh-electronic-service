import { useState } from 'react';
import { Technician, ServiceCentre, ComplaintTicket } from '../types';
import {
  Users,
  Plus,
  Phone,
  MessageSquare,
  Wrench,
  Building,
  CheckCircle2,
  Clock,
  Shield,
  Trash2,
  Edit2
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

interface TechniciansViewProps {
  technicians: Technician[];
  serviceCentres: ServiceCentre[];
  tickets: ComplaintTicket[];
  onAddTechnician: (tech: Technician) => void;
  onUpdateTechnician: (tech: Technician) => void;
  onAddServiceCentre: (sc: ServiceCentre) => void;
  onUpdateServiceCentre: (sc: ServiceCentre) => void;
}

export function TechniciansView({
  technicians,
  serviceCentres,
  tickets,
  onAddTechnician,
  onUpdateTechnician,
  onAddServiceCentre,
  onUpdateServiceCentre
}: TechniciansViewProps) {
  const [showTechModal, setShowTechModal] = useState(false);
  const [showSCModal, setShowSCModal] = useState(false);

  // New technician form
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [companyLoginNumber, setCompanyLoginNumber] = useState('');
  const [defaultHomeCommission, setDefaultHomeCommission] = useState(350);

  // New SC form
  const [scName, setScName] = useState('');
  const [scBrands, setScBrands] = useState('');
  const [scContactPerson, setScContactPerson] = useState('');
  const [scPhone, setScPhone] = useState('');
  const [scAddress, setScAddress] = useState('');
  const [scLoginNumber, setScLoginNumber] = useState('');

  const handleCreateTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      name: name.trim(),
      mobile: mobile.trim(),
      specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
      companyLoginNumber: companyLoginNumber.trim(),
      status: 'Active',
      defaultHomeCommission: Number(defaultHomeCommission) || 350,
      totalJobsAssigned: 0,
      totalCompleted: 0
    };

    onAddTechnician(newTech);
    setShowTechModal(false);
    setName('');
    setMobile('');
    setSpecialties('');
    setCompanyLoginNumber('');
  };

  const handleCreateSC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scName.trim() || !scPhone.trim()) return;

    const newSC: ServiceCentre = {
      id: `sc-${Date.now()}`,
      name: scName.trim(),
      authorizedBrands: scBrands.split(',').map((b) => b.trim()).filter(Boolean),
      contactPerson: scContactPerson.trim(),
      phone: scPhone.trim(),
      address: scAddress.trim(),
      companyLoginNumber: scLoginNumber.trim()
    };

    onAddServiceCentre(newSC);
    setShowSCModal(false);
    setScName('');
    setScBrands('');
    setScContactPerson('');
    setScPhone('');
    setScAddress('');
    setScLoginNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-lg">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Technicians &amp; Authorized Service Centres</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage field engineers, in-house technicians, and company brand portal login mappings (Samsung, LG, Voltas, Whirlpool)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTechModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Technician</span>
          </button>
          <button
            onClick={() => setShowSCModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-purple-600" />
            <span>Add Service Centre</span>
          </button>
        </div>
      </div>

      {/* Technicians Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Shop Technicians Master ({technicians.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicians.map((tech) => {
            // Count active jobs assigned
            const activeJobs = tickets.filter(
              (t) => t.assignedTechnicianId === tech.id && t.status !== 'Closed' && t.status !== 'Delivered'
            ).length;
            const completedJobs = tickets.filter(
              (t) => t.assignedTechnicianId === tech.id && (t.status === 'Closed' || t.status === 'Delivered')
            ).length;

            return (
              <div
                key={tech.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tech.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tech.status === 'On Field'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tech.status}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Commission: ₹{tech.defaultHomeCommission}/job
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-2">
                    {tech.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 mt-1">
                    <span>📞 {tech.mobile}</span>
                  </div>

                  {/* Company Login Number */}
                  <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Company Brand Portal ID:
                    </span>
                    <span className="font-mono font-semibold text-indigo-700 text-[11px] block mt-0.5 truncate">
                      {tech.companyLoginNumber || 'Not assigned'}
                    </span>
                  </div>

                  {/* Specialties */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tech.specialties.map((spec, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Active Jobs:</span>
                    <span className="font-bold tabular-nums text-slate-800">{activeJobs} active</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openWhatsApp(tech.mobile, `Hello ${tech.name}, Singh Electronics service team checking in.`)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="WhatsApp Technician"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <a
                      href={`tel:${tech.mobile}`}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Centres Directory */}
      <div>
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Company Authorized Service Centres ({serviceCentres.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceCentres.map((sc) => (
            <div
              key={sc.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {sc.name}
                  </h3>
                  <div className="text-xs text-purple-700 font-semibold mt-0.5">
                    Authorized for: {sc.authorizedBrands.join(', ')}
                  </div>
                </div>

                <span className="font-mono text-xs px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded font-semibold">
                  {sc.companyLoginNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Contact Person:</span>
                  <span className="font-semibold text-slate-800">{sc.contactPerson}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Phone / Helpline:</span>
                  <span className="font-mono font-semibold text-slate-800">{sc.phone}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span className="text-slate-400 text-[10px] block">Service Centre Address in Korba:</span>
                <span>{sc.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Technician Modal */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add New Technician</h3>
              <button onClick={() => setShowTechModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTechnician} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Technician Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Specialties (comma separated)</label>
                <input
                  type="text"
                  placeholder="LED TV, AC, Refrigerator, PCB repair"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Company Login / Brand Portal ID</label>
                <input
                  type="text"
                  placeholder="e.g. LG-KB-402 / SAM-GSPN-99"
                  value={companyLoginNumber}
                  onChange={(e) => setCompanyLoginNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Default Home Commission (₹)</label>
                <input
                  type="number"
                  value={defaultHomeCommission}
                  onChange={(e) => setDefaultHomeCommission(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTechModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Save Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Centre Modal */}
      {showSCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Service Centre</h3>
              <button onClick={() => setShowSCModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSC} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Service Centre Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Care Point Korba"
                  value={scName}
                  onChange={(e) => setScName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Authorized Brands</label>
                <input
                  type="text"
                  placeholder="Sony, Panasonic"
                  value={scBrands}
                  onChange={(e) => setScBrands(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Contact Person</label>
                <input
                  type="text"
                  placeholder="Branch Manager"
                  value={scContactPerson}
                  onChange={(e) => setScContactPerson(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="Phone number"
                  value={scPhone}
                  onChange={(e) => setScPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Address in Korba</label>
                <input
                  type="text"
                  placeholder="Area / Street in Korba"
                  value={scAddress}
                  onChange={(e) => setScAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Company Login / Portal ID</label>
                <input
                  type="text"
                  placeholder="e.g. SNY-KB-101"
                  value={scLoginNumber}
                  onChange={(e) => setScLoginNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSCModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold"
                >
                  Save Service Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
