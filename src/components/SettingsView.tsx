import { useState } from 'react';
import { UserAccount, SystemSettings } from '../types';
import {
  Settings,
  Users,
  Building,
  DollarSign,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { resetAllDataToDefault } from '../utils/storage';

interface SettingsViewProps {
  users: UserAccount[];
  activeUser: UserAccount;
  settings: SystemSettings;
  onUpdateUsers: (users: UserAccount[]) => void;
  onUpdateSettings: (settings: SystemSettings) => void;
  onResetData: () => void;
}

export function SettingsView({
  users,
  activeUser,
  settings,
  onUpdateUsers,
  onUpdateSettings,
  onResetData
}: SettingsViewProps) {
  // Form states
  const [shopName, setShopName] = useState(settings.shopName);
  const [shopAddress, setShopAddress] = useState(settings.shopAddress);
  const [shopPhone, setShopPhone] = useState(settings.shopPhone);
  const [shopEmail, setShopEmail] = useState(settings.shopEmail);
  const [shopGstin, setShopGstin] = useState(settings.shopGstin);
  const [defaultHandlingCharge, setDefaultHandlingCharge] = useState(settings.defaultHandlingCharge);
  const [defaultHomeCommission, setDefaultHomeCommission] = useState(settings.defaultHomeCommission);

  const [categories, setCategories] = useState<string[]>(settings.categories);
  const [newCategory, setNewCategory] = useState('');

  const [brands, setBrands] = useState<string[]>(settings.brands);
  const [newBrand, setNewBrand] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  // User form
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Staff'>('Staff');
  const [newUserMobile, setNewUserMobile] = useState('');
  const [newUserTitle, setNewUserTitle] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      shopName,
      shopAddress,
      shopPhone,
      shopEmail,
      shopGstin,
      defaultHandlingCharge: Number(defaultHandlingCharge),
      defaultHomeCommission: Number(defaultHomeCommission),
      categories,
      brands
    };

    onUpdateSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const handleAddBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand.trim())) {
      setBrands([...brands, newBrand.trim()]);
      setNewBrand('');
    }
  };

  const handleRemoveBrand = (br: string) => {
    setBrands(brands.filter((b) => b !== br));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserMobile.trim()) return;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      role: newUserRole,
      mobile: newUserMobile.trim(),
      title: newUserTitle.trim() || (newUserRole === 'Admin' ? 'Administrator' : 'Service Staff')
    };

    onUpdateUsers([...users, newUser]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserMobile('');
    setNewUserTitle('');
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('At least one user must remain.');
      return;
    }
    onUpdateUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Settings &amp; System Administration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure users (Admin/Staff), product master lists, brand directory, and repair charge rules
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* User Management Section (SOW: User management for 3–4 users with Admin / Staff roles) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>User Accounts &amp; Role Permissions ({users.length} Users)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin roles have full access to gross margins and commission edits. Staff roles log complaints, update statuses, and record collections.
            </p>
          </div>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">User Name</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Designation / Title</th>
                <th className="p-2.5">Mobile</th>
                <th className="p-2.5">Access Level</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                      {activeUser.id === u.id && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 font-bold rounded">
                          (You)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        u.role === 'Admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 font-medium">{u.title}</td>
                  <td className="p-2.5 font-mono text-slate-700">{u.mobile}</td>
                  <td className="p-2.5 text-slate-500">
                    {u.role === 'Admin' ? 'Full Control + Financial Margins' : 'Complaint Desk + Service Status'}
                  </td>
                  <td className="p-2.5 text-center">
                    {users.length > 1 && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Defaults & Shop Info */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Commission &amp; Handling Charge Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">
                Default Shop Handling Charge (₹):
              </label>
              <input
                type="number"
                value={defaultHandlingCharge}
                onChange={(e) => setDefaultHandlingCharge(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard counter handling fee deducted before calculating shop margin.
              </span>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">
                Default Home Visit Technician Commission (₹):
              </label>
              <input
                type="number"
                value={defaultHomeCommission}
                onChange={(e) => setDefaultHomeCommission(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Fixed commission awarded to technician per on-site home job.
              </span>
            </div>
          </div>
        </div>

        {/* Shop Business Profile */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Shop Profile &amp; Receipt Header Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Business Name:</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Helpline / Phone Numbers:</label>
              <input
                type="text"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">GSTIN / Registration:</label>
              <input
                type="text"
                value={shopGstin}
                onChange={(e) => setShopGstin(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-slate-600 block mb-1 font-semibold">Store Address in Korba:</label>
              <input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Master Lists: Products & Brands */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Categories */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900">
              Product Categories Master ({categories.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shrink-0"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pt-1">
              {categories.map((c) => (
                <span
                  key={c}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(c)}
                    className="text-slate-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900">
              Brands Master ({brands.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New brand..."
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
              />
              <button
                type="button"
                onClick={handleAddBrand}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shrink-0"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pt-1">
              {brands.map((b) => (
                <span
                  key={b}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{b}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBrand(b)}
                    className="text-slate-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all data back to the default Singh Electronics Korba sample dataset?')) {
                resetAllDataToDefault();
                onResetData();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-md flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Default</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            Save All Settings
          </button>
        </div>
      </form>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add User Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">User Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold"
                >
                  <option value="Staff">Staff (Desk / Billing / Field)</option>
                  <option value="Admin">Admin (Full Access &amp; Margins)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Designation / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Service Executive / Technician"
                  value={newUserTitle}
                  onChange={(e) => setNewUserTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit mobile"
                  value={newUserMobile}
                  onChange={(e) => setNewUserMobile(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
