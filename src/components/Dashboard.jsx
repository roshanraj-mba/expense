import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToExpenses, calculateBalances } from '../firebaseService';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';
import { Plus, Wallet, Droplets, Zap, Utensils, Home, PieChart, UserCircle, Users } from 'lucide-react';

const Dashboard = ({ user, currentMonth, group }) => {
    const [expenses, setExpenses] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!group) {
            setExpenses([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToExpenses(group.id, currentMonth, (data) => {
            setExpenses(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [group, currentMonth]);

    const stats = useMemo(() => {
        if (!group) return { total: 0, byCategory: {}, balances: {} };

        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        const byCategory = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const balances = calculateBalances(expenses, group.members);

        return { total, byCategory, balances };
    }, [expenses, group]);

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

    if (!group) {
        return (
            <div className="empty-state" style={{ marginTop: '4rem' }}>
                <div className="empty-state-icon">
                    <Users size={64} />
                </div>
                <h3>No Group Selected</h3>
                <p style={{ marginTop: '0.5rem' }}>
                    Select a group from the header or create a new one to get started
                </p>
            </div>
        );
    }

    const memberCount = Object.keys(group.members).length;
    const myBalance = stats.balances[user.uid];

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
                            <small className="text-white-50">For {memberCount} members</small>
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
                            <small className="text-white-50 d-block mb-1">You Owe</small>
                            <h3 className="mb-1 fw-bold" style={{ color: '#ec4899' }}>
                                ₹{myBalance ? myBalance.owes.toFixed(0) : '0'}
                            </h3>
                            <small className="text-white-50">Your share of expenses</small>
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
                            {myBalance && (
                                <>
                                    <h3 className={`mb-1 fw-bold ${myBalance.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {myBalance.balance >= 0 ? '+' : ''}₹{myBalance.balance.toFixed(0)}
                                    </h3>
                                    <small className="text-white-50">
                                        {myBalance.balance >= 0 ? 'You are owed' : 'You owe'}
                                    </small>
                                </>
                            )}
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
                        <ExpenseList expenses={expenses} currentUserId={user.uid} groupMembers={group.members} />
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
                            {Object.entries(stats.balances).map(([memberId, balance]) => (
                                <div key={memberId} className="d-flex align-items-center justify-content-between p-2 mb-2 rounded-2" style={{
                                    background: 'rgba(15, 23, 42, 0.5)'
                                }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{
                                            width: '32px',
                                            height: '32px',
                                            background: 'linear-gradient(135deg, #4b5563, #374151)',
                                            fontSize: '0.75rem'
                                        }}>
                                            {balance.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="fw-medium text-white" style={{ fontSize: '0.85rem' }}>
                                                {balance.name}
                                                {memberId === user.uid && <span style={{ color: 'var(--color-primary)', marginLeft: '0.25rem' }}>(You)</span>}
                                            </div>
                                            <small className="text-white-50" style={{ fontSize: '0.7rem' }}>Paid: ₹{balance.paid.toFixed(0)}</small>
                                        </div>
                                    </div>
                                    <div className={`text-end ${balance.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                                        <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{balance.balance >= 0 ? '+' : ''}₹{balance.balance.toFixed(0)}</div>
                                        <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>{balance.balance >= 0 ? 'Gets back' : 'Owes'}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AddExpense
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                user={user}
                currentMonth={currentMonth}
                group={group}
            />
        </div>
    );
};

export default Dashboard;
