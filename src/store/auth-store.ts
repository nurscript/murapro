// authStore.ts
import {create} from 'zustand';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: ()=> Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async ()=> {
    await signOut(auth);
    set({ user: null});
  }
}));

// Initialize Firebase auth listener once, setting the user in Zustand.
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});
