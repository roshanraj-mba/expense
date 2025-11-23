import React, { useState, useEffect } from 'react';
import { X, Wallet, Home, Droplets, Zap, Utensils, Users, Percent, DollarSign } from 'lucide-react';
import { addExpense, calculateEqualSplit, calculatePercentageSplit, calculateCustomSplit } from '../firebaseService';

const CATEGORIES = [
    { id: 'rent', label: 'Rent', icon: Home, color: '#a78bfa' },
    { id: 'food', label: 'Food', icon: Utensils, color: '#34d399' },
    { id: 'water', label: 'Water', icon: Droplets, color: '#60a5fa' },
    { id: 'electricity', label: 'Electricity', icon: Zap, color: '#fbbf24' },
    { id: 'other', label: 'Other', icon: Wallet, color: '#94a3b8' }
];

const SPLIT_TYPES = [
    { id: 'equal', label: 'Equal Split', icon: Users, description: 'Split equally among members' },
    { id: 'percentage', label: 'Percentage', icon: Percent, description: 'Custom percentage for each member' },
    { id: 'custom', label: 'Custom Amount', icon: DollarSign, description: 'Exact amount for each member' }
];

const AddExpense = ({ isOpen, onClose, user, currentMonth, group }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'food'
    });
    const [splitType, setSplitType] = useState('equal');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [percentages, setPercentages] = useState({});
    const [customAmounts, setCustomAmounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const members = group?.members || {};
    const memberIds = Object.keys(members);

    useEffect(() => {
        if (isOpen && memberIds.length > 0) {
            // Select all members by default
            setSelectedMembers(memberIds);

            // Initialize percentages (equal split)
            const equalPercentage = 100 / memberIds.length;
            const initialPercentages = {};
            memberIds.forEach(id => {
                initialPercentages[id] = equalPercentage;
            });
            setPercentages(initialPercentages);

            // Initialize custom amounts
            const initialAmounts = {};
            memberIds.forEach(id => {
                initialAmounts[id] = 0;
            });
            setCustomAmounts(initialAmounts);
        }
    }, [isOpen, group]);

    const handleMemberToggle = (memberId) => {
        setSelectedMembers(prev => {
            if (prev.includes(memberId)) {
                return prev.filter(id => id !== memberId);
            } else {
                return [...prev, memberId];
            }
        });
    };

    const handlePercentageChange = (memberId, value) => {
        setPercentages(prev => ({
            ...prev,
            [memberId]: parseFloat(value) || 0
        }));
    };

    const handleCustomAmountChange = (memberId, value) => {
        setCustomAmounts(prev => ({
            ...prev,
            [memberId]: parseFloat(value) || 0
        }));
    };

    const getTotalPercentage = () => {
        return selectedMembers.reduce((sum, id) => sum + (percentages[id] || 0), 0);
    };

    const getTotalCustomAmount = () => {
        return selectedMembers.reduce((sum, id) => sum + (customAmounts[id] || 0), 0);
    };

    const validateSplit = () => {
        if (selectedMembers.length === 0) {
            return 'Please select at least one member';
        }

        if (splitType === 'percentage') {
            const total = getTotalPercentage();
            if (Math.abs(total - 100) > 0.01) {
                return `Percentages must total 100% (currently ${total.toFixed(1)}%)`;
            }
        }

        if (splitType === 'custom') {
            const total = getTotalCustomAmount();
            const amount = parseFloat(formData.amount);
            if (Math.abs(total - amount) > 0.01) {
                return `Custom amounts must total ₹${amount} (currently ₹${total.toFixed(2)})`;
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateSplit();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!formData.description.trim() || !formData.amount) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const amount = parseFloat(formData.amount);
            let splits;

            if (splitType === 'equal') {
                splits = calculateEqualSplit(amount, selectedMembers);
            } else if (splitType === 'percentage') {
                const selectedPercentages = {};
                selectedMembers.forEach(id => {
                    selectedPercentages[id] = percentages[id];
                });
                splits = calculatePercentageSplit(amount, selectedPercentages);
            } else {
                const selectedAmounts = {};
                selectedMembers.forEach(id => {
                    selectedAmounts[id] = customAmounts[id];
                });
                splits = calculateCustomSplit(selectedAmounts);
            }

            await addExpense({
                groupId: group.id,
                description: formData.description,
                amount: amount,
                category: formData.category,
                paidBy: user.uid,
                paidByName: user.displayName || 'User',
                splits: splits,
                splitType: splitType,
                month: currentMonth
            });

            // Reset form
            setFormData({ description: '', amount: '', category: 'food' });
            setSplitType('equal');
            setError('');
            onClose();
        } catch (err) {
            console.error('Error adding expense:', err);
            setError('Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3 className="text-gradient">Add Expense</h3>
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        style={{ padding: '0.5rem', borderRadius: '50%' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-danger)',
                                marginBottom: 'var(--spacing-md)',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., Electricity Bill"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        {/* Amount */}
                        <div className="form-group">
                            <label className="form-label">Amount (₹) *</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                            style={{
                                                padding: '0.75rem',
                                                background: formData.category === cat.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                                border: formData.category === cat.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            <Icon size={20} style={{ color: cat.color }} />
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text)' }}>{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Split Type */}
                        <div className="form-group">
                            <label className="form-label">Split Type</label>
                            <div className="tabs">
                                {SPLIT_TYPES.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            className={`tab ${splitType === type.id ? 'active' : ''}`}
                                            onClick={() => setSplitType(type.id)}
                                        >
                                            <Icon size={16} />
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Members Selection */}
                        <div className="form-group">
                            <label className="form-label">Split Between</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {memberIds.map(memberId => {
                                    const member = members[memberId];
                                    const isSelected = selectedMembers.includes(memberId);

                                    return (
                                        <div
                                            key={memberId}
                                            style={{
                                                padding: '0.75rem',
                                                background: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleMemberToggle(memberId)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 500 }}>{member.name}</div>
                                            </div>

                                            {isSelected && splitType === 'percentage' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        value={percentages[memberId] || 0}
                                                        onChange={(e) => handlePercentageChange(memberId, e.target.value)}
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                                    />
                                                    <span style={{ fontSize: '0.875rem' }}>%</span>
                                                </div>
                                            )}

                                            {isSelected && splitType === 'custom' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
                                                    <span style={{ fontSize: '0.875rem' }}>₹</span>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        value={customAmounts[memberId] || 0}
                                                        onChange={(e) => handleCustomAmountChange(memberId, e.target.value)}
                                                        step="0.01"
                                                        min="0"
                                                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                                    />
                                                </div>
                                            )}

                                            {isSelected && splitType === 'equal' && formData.amount && (
                                                <div style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    ₹{(parseFloat(formData.amount) / selectedMembers.length).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Split Summary */}
                            {selectedMembers.length > 0 && (
                                <div style={{
                                    marginTop: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'rgba(6, 182, 212, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem'
                                }}>
                                    {splitType === 'percentage' && (
                                        <div style={{ color: getTotalPercentage() === 100 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            Total: {getTotalPercentage().toFixed(1)}% / 100%
                                        </div>
                                    )}
                                    {splitType === 'custom' && formData.amount && (
                                        <div style={{ color: Math.abs(getTotalCustomAmount() - parseFloat(formData.amount)) < 0.01 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            Total: ₹{getTotalCustomAmount().toFixed(2)} / ₹{parseFloat(formData.amount).toFixed(2)}
                                        </div>
                                    )}
                                    {splitType === 'equal' && formData.amount && (
                                        <div style={{ color: 'var(--color-success)' }}>
                                            ₹{(parseFloat(formData.amount) / selectedMembers.length).toFixed(2)} per person
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
