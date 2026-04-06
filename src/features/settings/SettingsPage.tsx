import { useState } from 'react';
import { Shield, Bell, CreditCard, User, Building, Trash2, Plus, Save } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { showToast } from '@/components/ui/Toast';
import type { Currency } from '@/types';

export const SettingsPage = () => {
  const {
    currency, setCurrency,
    profileName, setProfileName,
    profileEmail, setProfileEmail,
    alertsEnabled, setAlertsEnabled,
    weeklySummaries, setWeeklySummaries,
    linkedBanks, unlinkBank, addBank,
    budgetGoals, setBudgetLimit,
  } = useUIStore();

  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [localName, setLocalName] = useState(profileName);
  const [localEmail, setLocalEmail] = useState(profileEmail);

  const handleSaveProfile = () => {
    setProfileName(localName);
    setProfileEmail(localEmail);
    showToast('Profile saved successfully!');
  };

  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c);
    showToast(`Currency changed to ${c}`, 'info');
  };

  const handleUnlink = (id: number) => {
    unlinkBank(id);
    showToast('Account unlinked');
  };

  const handleAddBank = () => {
    const newId = Date.now();
    addBank({ id: newId, name: 'Wells Fargo', type: 'Savings', masked: `•••• ${Math.floor(1000 + Math.random() * 9000)}` });
    showToast('New bank account connected!');
  };

  const handleToggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    showToast(alertsEnabled ? 'Transaction alerts disabled' : 'Transaction alerts enabled', 'info');
  };

  const handleToggleSummaries = () => {
    setWeeklySummaries(!weeklySummaries);
    showToast(weeklySummaries ? 'Weekly summaries disabled' : 'Weekly summaries enabled', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account configurations and financial preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel border border-border-default rounded-2xl p-6 shadow-sm bg-bg-surface/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-glow rounded-xl text-accent-primary">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Personal Profile</h2>
              </div>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 text-sm font-medium bg-accent-primary text-white py-2 px-4 rounded-xl hover:opacity-90 transition-all shadow-sm"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-default rounded-xl bg-bg-base text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={localEmail}
                  onChange={(e) => setLocalEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border-default rounded-xl bg-bg-base text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-colors" 
                />
              </div>
            </div>
          </div>

          <div className="glass-panel border border-border-default rounded-2xl p-6 shadow-sm bg-bg-surface/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-xl text-info border border-info/20">
                  <Building className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Linked Accounts</h2>
              </div>
              <button
                onClick={handleAddBank}
                className="flex items-center gap-2 text-sm font-medium bg-accent-primary text-white py-2 px-4 rounded-xl hover:opacity-90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Connect Bank
              </button>
            </div>
            
            <div className="space-y-3">
              {linkedBanks.length === 0 ? (
                <p className="text-text-muted text-center py-4">No banks linked. Connect an account to see your balances.</p>
              ) : (
                linkedBanks.map(bank => (
                  <div key={bank.id} className="flex items-center justify-between p-4 bg-bg-elevated border border-border-default rounded-2xl hover:border-border-active transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center border border-border-default">
                        <CreditCard className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{bank.name}</p>
                        <p className="text-xs text-text-muted">{bank.type} • {bank.masked}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUnlink(bank.id)}
                      className="text-text-muted hover:text-error transition-colors p-2"
                      title="Unlink account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          <div className="glass-panel border border-border-default rounded-2xl p-6 shadow-sm bg-bg-surface/50">
            <h2 className="text-lg font-bold text-text-primary mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Display Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                  className="w-full px-4 py-2.5 border border-border-default rounded-xl bg-bg-base text-text-primary focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="JPY">JPY (¥) - Japanese Yen</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget Limits */}
          <div className="glass-panel border border-border-default rounded-2xl p-6 shadow-sm bg-bg-surface/50">
            <h2 className="text-lg font-bold text-text-primary mb-4">Budget Limits</h2>
            
            <div className="space-y-4">
              {budgetGoals.map(goal => (
                <div key={goal.category}>
                  <label className="block text-sm font-medium text-text-secondary mb-1 capitalize">{goal.category} Limit</label>
                  <input 
                    type="number" 
                    value={goal.limit}
                    onChange={(e) => setBudgetLimit(goal.category, Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-border-default rounded-xl bg-bg-base text-text-primary focus:ring-2 focus:ring-accent-primary" 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel border border-border-default rounded-2xl p-6 shadow-sm bg-bg-surface/50 space-y-8">
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-success" />
                <h2 className="text-lg font-bold text-text-primary">Security</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Two-Factor Auth</p>
                  <p className="text-xs text-text-muted">Require an SMS code on login.</p>
                </div>
                <button 
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${twoFactorAuth ? 'bg-success' : 'bg-border-active'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${twoFactorAuth ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="h-px bg-border-default w-full"></div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-warning" />
                <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Txn Alerts</p>
                    <p className="text-xs text-text-muted">Notify me of large transactions.</p>
                  </div>
                  <button 
                    onClick={handleToggleAlerts}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${alertsEnabled ? 'bg-accent-primary' : 'bg-border-active'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${alertsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Weekly Summary</p>
                    <p className="text-xs text-text-muted">Get a spending digest every Monday.</p>
                  </div>
                  <button 
                    onClick={handleToggleSummaries}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${weeklySummaries ? 'bg-accent-primary' : 'bg-border-active'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${weeklySummaries ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
