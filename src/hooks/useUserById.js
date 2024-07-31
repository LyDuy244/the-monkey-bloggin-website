import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-app/firebase-config";

export const useUserById = (userId = "") => {
    const [user, setUser] = useState({});
    useEffect(() => {
        if (!userId) return;
        async function fetchUserData() {
            const docRef = doc(db, "users", userId);
            const docData = await getDoc(docRef);
            if (docData.data()) {
                setUser({
                    id: docData.id,
                    ...docData.data()
                })
            }
        }
        fetchUserData();
    }, [userId])

    return {
        user
    }
}