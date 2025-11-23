import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createGroup } from '../firebaseService';

const CreateGroup = ({ isOpen, onClose, user, onGroupCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Group name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const groupId = await createGroup(
                formData,
                user.uid,
                user.displayName || 'User'
            );

            setFormData({ name: '', description: '' });
            onGroupCreated(groupId);
            onClose();
        } catch (err) {
            console.error('Error creating group:', err);
            setError('Failed to create group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="text-gradient">Create New Group</h3>
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

                        <div className="form-group">
                            <label className="form-label">Group Name *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., Flatmates, Trip to Goa"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description (Optional)</label>
                            <textarea
                                className="input"
                                placeholder="What's this group for?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
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
                            {loading ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroup;
