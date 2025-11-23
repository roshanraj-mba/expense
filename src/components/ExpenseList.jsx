import React from 'react';
import { deleteExpense } from '../firebaseService';
import { Trash2, Tag, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORY_CONFIG = {
    rent: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.3)', icon: '🏠' },
    food: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.3)', icon: '🍽️' },
    water: { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.3)', icon: '💧' },
    electricity: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', icon: '⚡' },
    other: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.3)', icon: '📝' }
};

const ExpenseList = ({ expenses, currentUserId }) => {
    if (expenses.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(30, 41, 59, 0.5)'
                }}>
                    <Tag size={32} style={{ opacity: 0.5, color: '#94a3b8' }} />
                </div>
                <p className="text-white mb-1">No expenses yet for this month.</p>
                <small className="text-white-50">Start adding expenses to track your spending!</small>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-2">
            {expenses.map((expense) => {
                const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.other;

                return (
                    <div
                        key={expense.id}
                        className="card border-0 expense-item"
                        style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div className="card-body p-2 d-flex align-items-center justify-content-between">
                            {/* Left side - Category icon and details */}
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                {/* Category Icon */}
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        background: config.bg,
                                        border: `1px solid ${config.border}`,
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    {config.icon}
                                </div>

                                {/* Expense Details */}
                                <div className="flex-grow-1 min-w-0">
                                    <div className="d-flex align-items-center gap-2 mb-0">
                                        <h6 className="mb-0 text-white text-truncate" style={{ fontSize: '0.9rem' }}>
                                            {expense.description}
                                        </h6>
                                        <span
                                            className="badge rounded-pill text-capitalize flex-shrink-0"
                                            style={{
                                                background: config.bg,
                                                color: config.color,
                                                border: `1px solid ${config.border}`,
                                                fontSize: '0.65rem',
                                                padding: '0.2rem 0.5rem'
                                            }}
                                        >
                                            {expense.category}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-white-50" style={{ fontSize: '0.7rem' }}>
                                        <span className="d-flex align-items-center gap-1">
                                            <User size={12} />
                                            {expense.userName}
                                        </span>
                                        <span>•</span>
                                        <span className="d-flex align-items-center gap-1">
                                            <Calendar size={12} />
                                            {expense.date?.seconds ? format(new Date(expense.date.seconds * 1000), 'MMM d') : 'Today'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Amount and delete button */}
                            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                <div className="text-end">
                                    <div className="fw-bold text-white" style={{ fontSize: '1rem' }}>
                                        ₹{expense.amount.toFixed(0)}
                                    </div>
                                    <small className="text-white-50" style={{ fontSize: '0.65rem' }}>
                                        {expense.amount.toFixed(2)}
                                    </small>
                                </div>

                                {expense.userId === currentUserId && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this expense?')) {
                                                deleteExpense(expense.id);
                                            }
                                        }}
                                        className="btn btn-sm delete-btn"
                                        style={{
                                            color: '#94a3b8',
                                            padding: '0.3rem',
                                            opacity: 0,
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#ef4444';
                                            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#94a3b8';
                                            e.target.style.background = 'transparent';
                                        }}
                                        title="Delete Expense"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <style>{`
                .expense-item:hover .delete-btn {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default ExpenseList;
