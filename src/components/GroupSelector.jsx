import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Users } from 'lucide-react';

const GroupSelector = ({ groups, currentGroup, onSelectGroup, onCreateGroup, loading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <div className="skeleton" style={{ width: '120px', height: '20px' }} />
            </div>
        );
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-secondary"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: '200px',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} />
                    <span style={{ fontWeight: 600 }}>
                        {currentGroup ? currentGroup.name : 'Select Group'}
                    </span>
                </div>
                <ChevronDown size={18} style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }} />
            </button>

            {isOpen && (
                <div className="dropdown-menu" style={{ minWidth: '250px' }}>
                    {groups.length > 0 ? (
                        <>
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="dropdown-item"
                                    onClick={() => {
                                        onSelectGroup(group);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        background: currentGroup?.id === group.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                                    }}
                                >
                                    <Users size={16} style={{
                                        color: currentGroup?.id === group.id ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{group.name}</div>
                                        {group.description && (
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-muted)',
                                                marginTop: '0.125rem'
                                            }}>
                                                {group.description}
                                            </div>
                                        )}
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--color-text-muted)',
                                            marginTop: '0.125rem'
                                        }}>
                                            {Object.keys(group.members || {}).length} members
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="dropdown-divider" />
                        </>
                    ) : (
                        <div style={{
                            padding: '1rem',
                            textAlign: 'center',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            No groups yet
                        </div>
                    )}
                    <div
                        className="dropdown-item"
                        onClick={() => {
                            onCreateGroup();
                            setIsOpen(false);
                        }}
                        style={{
                            color: 'var(--color-primary)',
                            fontWeight: 600
                        }}
                    >
                        <Plus size={16} />
                        Create New Group
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSelector;
