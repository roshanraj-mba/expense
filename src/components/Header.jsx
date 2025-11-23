import React from 'react';
import { Menu, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';

const Header = ({ user, currentMonth, setCurrentMonth, currentGroup, onToggleChat, onToggleSidebar }) => {
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <header className="sticky-top shadow-sm mb-3" style={{
            position: 'sticky',
            top: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1000
        }}>
            <div className="container-fluid py-2 px-3">
                <div className="row align-items-center g-2">
                    {/* Left: Menu Button & Logo */}
                    <div className="col-auto d-flex align-items-center gap-3">
                        <button
                            onClick={onToggleSidebar}
                            className="btn btn-secondary p-2"
                            title="Menu"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary rounded p-1">
                                <span className="text-white fw-bold px-1">FE</span>
                            </div>
                            <h5 className="m-0 d-none d-sm-block text-white">Flat Expenses</h5>
                        </div>
                    </div>

                    {/* Center: Month Navigator */}
                    <div className="col text-center">
                        <div className="d-inline-flex align-items-center bg-surface rounded-pill px-3 py-2 border border-secondary">
                            <button onClick={prevMonth} className="btn btn-link text-white p-1 hover-scale">
                                <ChevronLeft size={24} strokeWidth={2.5} />
                            </button>
                            <span className="mx-3 fw-bold text-white fs-5 text-nowrap">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button onClick={nextMonth} className="btn btn-link text-white p-1 hover-scale">
                                <ChevronRight size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Chat Toggle */}
                    <div className="col-auto">
                        {currentGroup && (
                            <button
                                onClick={onToggleChat}
                                className="btn btn-secondary position-relative"
                                style={{ padding: '0.5rem 0.75rem' }}
                                title="Group Chat"
                            >
                                <MessageCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
