import React, { useState } from 'react';
import { addExpense } from '../firebaseService';
import { X, DollarSign, FileText, Loader2 } from 'lucide-react';

const CATEGORIES = [
    { id: 'rent', label: 'Rent', color: '#a78bfa' },
    { id: 'food', label: 'Food', color: '#34d399' },
    { id: 'water', label: 'Water', color: '#60a5fa' },
    { id: 'electricity', label: 'Electricity', color: '#fbbf24' },
    { id: 'other', label: 'Other', color: '#94a3b8' }
];

const AddExpense = ({ isOpen, onClose, user, currentMonth }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('food');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addExpense({
                userId: user.uid,
                userName: user.displayName || user.email.split('@')[0],
                amount: parseFloat(amount),
                description,
                category,
                month: currentMonth,
                date: new Date()
            });
            onClose();
            setAmount('');
            setDescription('');
            setCategory('food');
        } catch (error) {
            console.error("Failed to add expense", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{
                zIndex: 1050,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)'
            }}
            onClick={onClose}
        >
            <div
                className="card border-0 position-relative"
                style={{
                    maxWidth: '420px',
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="btn-close btn-close-white position-absolute"
                    style={{ top: '12px', right: '12px', opacity: 0.6 }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                ></button>

                <div className="card-body p-3">
                    {/* Header */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-2 p-2" style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#8b5cf6'
                        }}>
                            <DollarSign size={20} />
                        </div>
                        <h5 className="mb-0 fw-bold text-white">Add Expense</h5>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Amount Field */}
                        <div className="mb-3">
                            <label className="form-label text-white-50 small mb-1">Amount (₹)</label>
                            <div className="input-group">
                                <span className="input-group-text border-0" style={{
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    color: '#94a3b8'
                                }}>
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="form-control border-0 text-white fw-semibold"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    autoFocus
                                    style={{
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        fontSize: '1.1rem'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(139, 92, 246, 0.25)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="mb-3">
                            <label className="form-label text-white-50 small mb-1">Category</label>
                            <div className="row g-2">
                                {CATEGORIES.map(cat => (
                                    <div key={cat.id} className="col-6">
                                        <button
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className="btn w-100 text-start d-flex align-items-center gap-2"
                                            style={{
                                                background: category === cat.id
                                                    ? 'rgba(139, 92, 246, 0.2)'
                                                    : 'rgba(30, 41, 59, 0.5)',
                                                border: category === cat.id
                                                    ? '1px solid #8b5cf6'
                                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                                color: category === cat.id ? '#ffffff' : '#94a3b8',
                                                padding: '0.5rem',
                                                fontSize: '0.85rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (category !== cat.id) {
                                                    e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (category !== cat.id) {
                                                    e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                                                }
                                            }}
                                        >
                                            <div
                                                className="rounded-circle"
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    background: cat.color
                                                }}
                                            ></div>
                                            <span>{cat.label}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="mb-3">
                            <label className="form-label text-white-50 small mb-1">Description</label>
                            <div className="input-group">
                                <span className="input-group-text border-0" style={{
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    color: '#94a3b8'
                                }}>
                                    <FileText size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="What is this for?"
                                    className="form-control border-0 text-white"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    style={{
                                        background: 'rgba(30, 41, 59, 0.5)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(139, 92, 246, 0.25)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn w-100 text-white fw-semibold d-flex align-items-center justify-content-center gap-2"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                border: 'none',
                                padding: '0.6rem',
                                marginTop: '0.5rem',
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span>Adding...</span>
                                </>
                            ) : (
                                'Add Expense'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
