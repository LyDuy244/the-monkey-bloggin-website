import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-app/firebase-config";

export const useCategoryById = (categoryId = "") => {
    const [category, setCategory] = useState({});

    useEffect(() => {
      if (!categoryId) return;
      async function fetchUserData() {
        const docRef = doc(db, "categories", categoryId);
        const docData = await getDoc(docRef);
        if (docData.data()) {
          setCategory({
            id: docData.id,
            ...docData.data()
          })
        }
      }
      fetchUserData();
    }, [categoryId])
    return{
        category
    }
}