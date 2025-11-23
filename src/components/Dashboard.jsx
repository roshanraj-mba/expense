import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToExpenses } from '../firebaseService';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';
import { Plus, Wallet, Droplets, Zap, Utensils, Home, PieChart, UserCircle } from 'lucide-react';

const Dashboard = ({ user, currentMonth }) => {
    const [expenses, setExpenses] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToExpenses(currentMonth, (data) => {
            setExpenses(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentMonth]);

    const stats = useMemo(() => {
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const perPerson = total / 4; // Fixed 4 people as per requirement

        const byCategory = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const byUser = expenses.reduce((acc, curr) => {
            if (!acc[curr.userId]) {
                acc[curr.userId] = {
                    name: curr.userName,
                    paid: 0,
                    id: curr.userId
                };
            }
            acc[curr.userId].paid += curr.amount;
            return acc;
        }, {});

        // Add current user if not present
        if (!byUser[user.uid]) {
            byUser[user.uid] = {
                name: user.displayName || 'You',
                paid: 0,
                id: user.uid
            };
        }

        return { total, perPerson, byCategory, byUser };
    }, [expenses, user]);

    const getCategoryIcon = (cat) => {
        const iconProps = { size: 18 };
        switch (cat) {
            case 'rent': return <Home {...iconProps} style={{ color: '#a78bfa' }} />;
            case 'water': return <Droplets {...iconProps} style={{ color: '#60a5fa' }} />;
            case 'electricity': return <Zap {...iconProps} style={{ color: '#fbbf24' }} />;
            case 'food': return <Utensils {...iconProps} style={{ color: '#34d399' }} />;
            default: return <Wallet {...iconProps} style={{ color: '#94a3b8' }} />;
        }
    };

    return (
        <div className="container-fluid px-3 pb-5">
            {/* Summary Cards */}
            <div className="row g-2 mb-3">
                <div className="col-12 col-md-4">
                    <div className="card border-0 h-100 position-relative overflow-hidden" style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px'
                    }}>
                        <div className="position-absolute end-0 top-0 p-3 opacity-10">
                            <Wallet size={60} />
                        </div>
                        <div className="card-body p-3 position-relative">
                            <small className="text-white-50 d-block mb-1">Total Expenses</small>
                            <h3 className="mb-1 fw-bold text-white">₹{stats.total.toFixed(0)}</h3>
                            <small className="text-white-50">For {Object.keys(stats.byUser).length} active members</small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 h-100 position-relative overflow-hidden" style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px'
                    }}>
                        <div className="position-absolute end-0 top-0 p-3 opacity-10">
                            <PieChart size={60} />
                        </div>
                        <div className="card-body p-3 position-relative">
                            <small className="text-white-50 d-block mb-1">Your Share</small>
                            <h3 className="mb-1 fw-bold" style={{ color: '#8b5cf6' }}>₹{stats.perPerson.toFixed(0)}</h3>
                            <small className="text-white-50">Total / 4 People</small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 h-100 position-relative overflow-hidden" style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px'
                    }}>
                        <div className="position-absolute end-0 top-0 p-3 opacity-10">
                            <UserCircle size={60} />
                        </div>
                        <div className="card-body p-3 position-relative">
                            <small className="text-white-50 d-block mb-1">Your Balance</small>
                            {(() => {
                                const myPaid = stats.byUser[user.uid]?.paid || 0;
                                const balance = myPaid - stats.perPerson;
                                return (
                                    <>
                                        <h3 className={`mb-1 fw-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {balance >= 0 ? '+' : ''}₹{balance.toFixed(0)}
                                        </h3>
                                        <small className="text-white-50">
                                            {balance >= 0 ? 'You are owed' : 'You owe'}
                                        </small>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="row g-2 mb-3">
                {['rent', 'food', 'water', 'electricity'].map(cat => (
                    <div key={cat} className="col-6 col-md-3">
                        <div className="card border-0 h-100" style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body p-2 d-flex align-items-center gap-2">
                                <div className="rounded-2 p-2" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                                    {getCategoryIcon(cat)}
                                </div>
                                <div className="flex-grow-1">
                                    <small className="text-white-50 text-capitalize d-block" style={{ fontSize: '0.7rem' }}>{cat}</small>
                                    <div className="fw-bold text-white">₹{(stats.byCategory[cat] || 0).toFixed(0)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="row g-3">
                {/* Expense List */}
                <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="mb-0 fw-bold text-white">Recent Expenses</h5>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn btn-sm text-white d-flex align-items-center gap-1"
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                border: 'none',
                                padding: '0.4rem 0.8rem',
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                            }}
                        >
                            <Plus size={16} />
                            <span>Add Expense</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border" style={{ color: '#8b5cf6' }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <ExpenseList expenses={expenses} currentUserId={user.uid} />
                    )}
                </div>

                {/* Balances Sidebar */}
                <div className="col-12 col-lg-4">
                    <h5 className="mb-2 fw-bold text-white">Balances</h5>
                    <div className="card border-0" style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px'
                    }}>
                        <div className="card-body p-2">
                            {Object.values(stats.byUser).map(u => {
                                const balance = u.paid - stats.perPerson;
                                return (
                                    <div key={u.id} className="d-flex align-items-center justify-content-between p-2 mb-2 rounded-2" style={{
                                        background: 'rgba(15, 23, 42, 0.5)'
                                    }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'linear-gradient(135deg, #4b5563, #374151)',
                                                fontSize: '0.75rem'
                                            }}>
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-medium text-white" style={{ fontSize: '0.85rem' }}>{u.name}</div>
                                                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>Paid: ₹{u.paid.toFixed(0)}</small>
                                            </div>
                                        </div>
                                        <div className={`text-end ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                                            <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{balance >= 0 ? '+' : ''}₹{balance.toFixed(0)}</div>
                                            <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>{balance >= 0 ? 'Gets back' : 'Owes'}</small>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <small className="text-center text-white-50 d-block" style={{ fontSize: '0.7rem' }}>
                                    *Calculated based on 4 people split (₹{stats.perPerson.toFixed(0)}/person)
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddExpense
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                user={user}
                currentMonth={currentMonth}
            />
        </div>
    );
};

export default Dashboard;
