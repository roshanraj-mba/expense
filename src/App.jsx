import React, { useState, useEffect } from 'react';
import { subscribeToAuthChanges } from './firebaseService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { format } from 'date-fns';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading Flat Expenses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-10">
            {user ? (
                <>
                    <Header
                        user={user}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                    />
                    <main className="container mt-8">
                        <Dashboard
                            user={user}
                            currentMonth={currentMonth}
                        />
                    </main>
                </>
            ) : (
                <Login />
            )}
        </div>
    );
}

export default App;
