import React from 'react';
import { logoutUser } from '../firebaseService';
import { LogOut, Calendar, UserCircle } from 'lucide-react';
import { format, subMonths, addMonths, parse } from 'date-fns';

const Header = ({ user, currentMonth, setCurrentMonth }) => {
    const handlePrevMonth = () => {
        const date = parse(currentMonth, 'yyyy-MM', new Date());
        setCurrentMonth(format(subMonths(date, 1), 'yyyy-MM'));
    };

    const handleNextMonth = () => {
        const date = parse(currentMonth, 'yyyy-MM', new Date());
        setCurrentMonth(format(addMonths(date, 1), 'yyyy-MM'));
    };

    return (
        <header className="sticky-top shadow-sm mb-3" style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div className="container-fluid py-2 px-3">
                <div className="row align-items-center g-2">
                    {/* Logo and Title */}
                    <div className="col-auto">
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                            }}>
                                <i className="bi bi-currency-dollar text-white" style={{ fontSize: '1.25rem' }}></i>
                            </div>
                            <h1 className="h6 mb-0 fw-bold text-white d-none d-md-block">Flat Expenses</h1>
                        </div>
                    </div>

                    {/* Month Navigator */}
                    <div className="col">
                        <div className="d-flex justify-content-center">
                            <div className="btn-group btn-group-sm rounded-pill" style={{
                                background: 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <button
                                    onClick={handlePrevMonth}
                                    className="btn text-white-50"
                                    style={{ border: 'none' }}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button className="btn text-white d-flex align-items-center gap-1 px-3" style={{ border: 'none', cursor: 'default' }}>
                                    <Calendar size={14} style={{ color: '#8b5cf6' }} />
                                    <small className="fw-medium">{format(parse(currentMonth, 'yyyy-MM', new Date()), 'MMM yyyy')}</small>
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="btn text-white-50"
                                    style={{ border: 'none' }}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Logout */}
                    <div className="col-auto">
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center gap-1 text-white-50">
                                <UserCircle size={18} style={{ color: '#ec4899' }} />
                                <small className="d-none d-md-inline">{user.displayName || user.email}</small>
                            </div>
                            <button
                                onClick={logoutUser}
                                className="btn btn-sm"
                                style={{
                                    color: '#94a3b8',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                    e.target.style.color = '#ef4444';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#94a3b8';
                                }}
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
