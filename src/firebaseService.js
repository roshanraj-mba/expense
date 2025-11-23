import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { auth, db } from "./firebase.config";

// Authentication
export const signUpUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => signOut(auth);

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Expenses
export const addExpense = async (expenseData) => {
    try {
        await addDoc(collection(db, "expenses"), {
            ...expenseData,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding expense: ", error);
        throw error;
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, "expenses", expenseId));
    } catch (error) {
        console.error("Error deleting expense: ", error);
        throw error;
    }
};

export const subscribeToExpenses = (month, callback) => {
    // Query expenses for the specific month
    const q = query(
        collection(db, "expenses"),
        where("month", "==", month),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const expenses = [];
        snapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        callback(expenses);
    });
};
