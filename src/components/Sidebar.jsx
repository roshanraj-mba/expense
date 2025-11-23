import React from 'react';
import { X, LogOut, Plus, Users, User } from 'lucide-react';
import { logoutUser } from '../firebaseService';

const Sidebar = ({ isOpen, onClose, user, groups, currentGroup, onSelectGroup, onCreateGroup }) => {
    if (!isOpen) return null;

    const handleLogout = async () => {
        try {
            await logoutUser();
            onClose();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="sidebar-overlay"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000
                }}
            />

            {/* Sidebar Content */}
            <div
                className="sidebar"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '280px',
                    background: '#0f172a', // Solid dark background (slate-900)
                    borderRight: '1px solid #334155',
                    zIndex: 2001,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease-out'
                }}
            >
                {/* Header */}
                <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                    <h5 className="m-0 text-white">Menu</h5>
                    <button onClick={onClose} className="btn btn-link text-white p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-bottom border-secondary">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '48px', height: '48px' }}>
                            <span className="text-white fw-bold fs-5">
                                {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                            </span>
                        </div>
                        <div>
                            <div className="fw-bold text-white">{user?.displayName || 'User'}</div>
                            <div className="small text-white" style={{ opacity: 0.7 }}>{user?.email}</div>
                        </div>
                    </div>
                </div>

                {/* Groups Section */}
                <div className="flex-grow-1 overflow-auto p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-white text-uppercase small fw-bold m-0">Your Groups</h6>
                        <button
                            onClick={() => { onCreateGroup(); onClose(); }}
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                        >
                            <Plus size={14} /> New
                        </button>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        {groups.map(group => (
                            <button
                                key={group.id}
                                onClick={() => { onSelectGroup(group); onClose(); }}
                                className={`btn w-100 text-start d-flex align-items-center gap-2 ${currentGroup?.id === group.id ? 'btn-primary' : 'btn-secondary'}`}
                                style={{
                                    background: currentGroup?.id === group.id ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                                    border: 'none'
                                }}
                            >
                                <Users size={18} />
                                <span className="text-truncate">{group.name}</span>
                            </button>
                        ))}

                        {groups.length === 0 && (
                            <div className="text-center text-muted py-4 small">
                                No groups yet. Create one to get started!
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-top border-secondary">
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
