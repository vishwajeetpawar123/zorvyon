import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Role, Currency, LinkedBank, BudgetGoal } from '../types';

interface UIStore {
  theme: Theme;
  role: Role;
  sidebarCollapsed: boolean;
  activeModal: string | null;

  currency: Currency;
  profileName: string;
  profileEmail: string;
  alertsEnabled: boolean;
  weeklySummaries: boolean;
  linkedBanks: LinkedBank[];
  budgetGoals: BudgetGoal[];
  hasSeenTour: boolean;

  toggleTheme: () => void;
  setRole: (role: Role) => void;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;

  setCurrency: (c: Currency) => void;
  setProfileName: (name: string) => void;
  setProfileEmail: (email: string) => void;
  setAlertsEnabled: (v: boolean) => void;
  setWeeklySummaries: (v: boolean) => void;
  unlinkBank: (id: number) => void;
  addBank: (bank: LinkedBank) => void;
  setBudgetLimit: (category: string, limit: number) => void;
  setHasSeenTour: (v: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      role: 'admin',
      sidebarCollapsed: false,
      activeModal: null,

      currency: 'INR',
      profileName: 'Vaishnavi',
      profileEmail: 'vaishnavi@zorvyn.com',
      alertsEnabled: true,
      weeklySummaries: false,
      linkedBanks: [
        { id: 1, name: 'Chase Bank', type: 'Checking', masked: '•••• 4432' },
        { id: 2, name: 'Bank of America', type: 'Credit Card', masked: '•••• 9011' },
      ],
      budgetGoals: [
        { category: 'Dining', limit: 4000, spent: 2850 },
        { category: 'Shopping', limit: 8000, spent: 6500 },
        { category: 'Entertainment', limit: 2500, spent: 2900 },
      ],
      hasSeenTour: false,

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
        
      setBudgetLimit: (category, limit) => set((state) => ({
        budgetGoals: state.budgetGoals.map(goal => 
          goal.category === category ? { ...goal, limit } : goal
        )
      })),
      setHasSeenTour: (hasSeenTour) => set({ hasSeenTour }),
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
        budgetGoals: state.budgetGoals,
        hasSeenTour: state.hasSeenTour,
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
