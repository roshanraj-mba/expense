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
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { auth, db } from "./firebase.config";

// ==================== AUTHENTICATION ====================

export const signUpUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });

        // Create user profile in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: email,
            displayName: name,
            photoURL: userCredential.user.photoURL || null,
            createdAt: serverTimestamp(),
            groups: []
        });

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

// ==================== USER PROFILE ====================

export const getUserProfile = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (userId, updates) => {
    try {
        await updateDoc(doc(db, "users", userId), updates);

        // Also update Firebase Auth profile if displayName changed
        if (updates.displayName && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: updates.displayName });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const searchUsersByEmail = async (email) => {
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const snapshot = await getDocs(q);
        const users = [];
        snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
};

// ==================== GROUPS ====================

export const createGroup = async (groupData, creatorId, creatorName) => {
    try {
        const groupRef = await addDoc(collection(db, "groups"), {
            name: groupData.name,
            description: groupData.description || "",
            createdBy: creatorId,
            createdAt: serverTimestamp(),
            members: {
                [creatorId]: {
                    name: creatorName,
                    role: "admin",
                    joinedAt: serverTimestamp()
                }
            },
            currency: "₹",
            settings: {
                allowChat: true,
                defaultSplitType: "equal"
            }
        });

        // Add group to user's groups array
        await updateDoc(doc(db, "users", creatorId), {
            groups: arrayUnion(groupRef.id)
        });

        return groupRef.id;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

export const getGroup = async (groupId) => {
    try {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
            return { id: groupDoc.id, ...groupDoc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting group:", error);
        throw error;
    }
};

export const subscribeToUserGroups = (userId, callback) => {
    const q = query(
        collection(db, "groups"),
        where(`members.${userId}`, "!=", null)
    );

    return onSnapshot(q, (snapshot) => {
        const groups = [];
        snapshot.forEach((doc) => {
            groups.push({ id: doc.id, ...doc.data() });
        });
        callback(groups);
    });
};

export const updateGroup = async (groupId, updates) => {
    try {
        await updateDoc(doc(db, "groups", groupId), updates);
    } catch (error) {
        console.error("Error updating group:", error);
        throw error;
    }
};

export const addMemberToGroup = async (groupId, userId, userName) => {
    try {
        await updateDoc(doc(db, "groups", groupId), {
            [`members.${userId}`]: {
                name: userName,
                role: "member",
                joinedAt: serverTimestamp()
            }
        });

        // Add group to user's groups array
        await updateDoc(doc(db, "users", userId), {
            groups: arrayUnion(groupId)
        });
    } catch (error) {
        console.error("Error adding member to group:", error);
        throw error;
    }
};

export const removeMemberFromGroup = async (groupId, userId) => {
    try {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
            const members = groupDoc.data().members;
            delete members[userId];

            await updateDoc(doc(db, "groups", groupId), { members });
        }

        // Remove group from user's groups array
        await updateDoc(doc(db, "users", userId), {
            groups: arrayRemove(groupId)
        });
    } catch (error) {
        console.error("Error removing member from group:", error);
        throw error;
    }
};

export const deleteGroup = async (groupId) => {
    try {
        // Get group to find all members
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
            const members = Object.keys(groupDoc.data().members);

            // Remove group from all members' groups arrays
            for (const memberId of members) {
                await updateDoc(doc(db, "users", memberId), {
                    groups: arrayRemove(groupId)
                });
            }
        }

        // Delete the group
        await deleteDoc(doc(db, "groups", groupId));
    } catch (error) {
        console.error("Error deleting group:", error);
        throw error;
    }
};

// ==================== EXPENSES ====================

export const addExpense = async (expenseData) => {
    try {
        const expenseRef = await addDoc(collection(db, "expenses"), {
            ...expenseData,
            createdAt: serverTimestamp()
        });

        // Optionally add a chat notification
        if (expenseData.groupId) {
            await addDoc(collection(db, "messages"), {
                groupId: expenseData.groupId,
                userId: expenseData.paidBy,
                userName: expenseData.paidByName,
                text: `Added expense: ${expenseData.description} - ₹${expenseData.amount}`,
                type: "expense-notification",
                createdAt: serverTimestamp()
            });
        }

        return expenseRef.id;
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, "expenses", expenseId));
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};

export const subscribeToExpenses = (groupId, month, callback) => {
    const q = query(
        collection(db, "expenses"),
        where("groupId", "==", groupId),
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

export const getExpensesByGroup = async (groupId) => {
    try {
        const q = query(
            collection(db, "expenses"),
            where("groupId", "==", groupId),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const expenses = [];
        snapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        return expenses;
    } catch (error) {
        console.error("Error getting expenses:", error);
        throw error;
    }
};

// ==================== CHAT MESSAGES ====================

export const sendMessage = async (groupId, userId, userName, text) => {
    try {
        await addDoc(collection(db, "messages"), {
            groupId,
            userId,
            userName,
            text,
            type: "text",
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const subscribeToMessages = (groupId, callback) => {
    const q = query(
        collection(db, "messages"),
        where("groupId", "==", groupId),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        callback(messages);
    });
};

// ==================== UTILITY FUNCTIONS ====================

export const calculateBalances = (expenses, members) => {
    const balances = {};

    // Initialize balances for all members
    Object.keys(members).forEach(memberId => {
        balances[memberId] = {
            name: members[memberId].name,
            paid: 0,
            owes: 0,
            balance: 0
        };
    });

    // Calculate what each person paid and owes
    expenses.forEach(expense => {
        // Add to paid amount for the person who paid
        if (balances[expense.paidBy]) {
            balances[expense.paidBy].paid += expense.amount;
        }

        // Add to owes amount for each person in the split
        Object.keys(expense.splits).forEach(memberId => {
            if (balances[memberId]) {
                balances[memberId].owes += expense.splits[memberId].amount;
            }
        });
    });

    // Calculate final balance (paid - owes)
    Object.keys(balances).forEach(memberId => {
        balances[memberId].balance = balances[memberId].paid - balances[memberId].owes;
    });

    return balances;
};

export const calculateEqualSplit = (amount, memberIds) => {
    const splitAmount = amount / memberIds.length;
    const splits = {};

    memberIds.forEach(memberId => {
        splits[memberId] = {
            amount: splitAmount,
            percentage: (100 / memberIds.length)
        };
    });

    return splits;
};

export const calculatePercentageSplit = (amount, percentages) => {
    const splits = {};

    Object.keys(percentages).forEach(memberId => {
        splits[memberId] = {
            amount: (amount * percentages[memberId]) / 100,
            percentage: percentages[memberId]
        };
    });

    return splits;
};

export const calculateCustomSplit = (customAmounts) => {
    const splits = {};
    const total = Object.values(customAmounts).reduce((sum, amt) => sum + amt, 0);

    Object.keys(customAmounts).forEach(memberId => {
        splits[memberId] = {
            amount: customAmounts[memberId],
            percentage: total > 0 ? (customAmounts[memberId] / total) * 100 : 0
        };
    });

    return splits;
};
