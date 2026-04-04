import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Role, Currency, LinkedBank } from '../types';

interface UIStore {
  theme: Theme;
  role: Role;
  sidebarCollapsed: boolean;
  activeModal: string | null;

  // Settings — persisted
  currency: Currency;
  profileName: string;
  profileEmail: string;
  alertsEnabled: boolean;
  weeklySummaries: boolean;
  linkedBanks: LinkedBank[];

  // Actions
  toggleTheme: () => void;
  setRole: (role: Role) => void;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;

  // Settings actions
  setCurrency: (c: Currency) => void;
  setProfileName: (name: string) => void;
  setProfileEmail: (email: string) => void;
  setAlertsEnabled: (v: boolean) => void;
  setWeeklySummaries: (v: boolean) => void;
  unlinkBank: (id: number) => void;
  addBank: (bank: LinkedBank) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      role: 'admin',
      sidebarCollapsed: false,
      activeModal: null,

      // Settings defaults
      currency: 'USD',
      profileName: 'Vishwas',
      profileEmail: 'vishwas@zorvyn.com',
      alertsEnabled: true,
      weeklySummaries: false,
      linkedBanks: [
        { id: 1, name: 'Chase Bank', type: 'Checking', masked: '•••• 4432' },
        { id: 2, name: 'Bank of America', type: 'Credit Card', masked: '•••• 9011' },
      ],

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
          return { theme: newTheme };
        }),
      setRole: (role) => set({ role }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),

      // Settings actions
      setCurrency: (currency) => set({ currency }),
      setProfileName: (profileName) => set({ profileName }),
      setProfileEmail: (profileEmail) => set({ profileEmail }),
      setAlertsEnabled: (alertsEnabled) => set({ alertsEnabled }),
      setWeeklySummaries: (weeklySummaries) => set({ weeklySummaries }),
      unlinkBank: (id) =>
        set((state) => ({
          linkedBanks: state.linkedBanks.filter((b) => b.id !== id),
        })),
      addBank: (bank) =>
        set((state) => ({
          linkedBanks: [...state.linkedBanks, bank],
        })),
    }),
    {
      name: 'zorvyn-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        role: state.role,
        sidebarCollapsed: state.sidebarCollapsed,
        currency: state.currency,
        profileName: state.profileName,
        profileEmail: state.profileEmail,
        alertsEnabled: state.alertsEnabled,
        weeklySummaries: state.weeklySummaries,
        linkedBanks: state.linkedBanks,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
        }
      },
    }
  )
);
