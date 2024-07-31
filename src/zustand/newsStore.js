import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase-app/firebase-config";


export const useUserStore = create((set) => ({
    userInfo: {},
    login: async (payload) => {
        try {
            await signInWithEmailAndPassword(auth, payload.email, payload.password);
        } catch (error) {
        }
    },
    setUserInfo: (payload) => {
        set({ userInfo: payload })
    },
    logout: () => {
        signOut(auth)
    }
}))