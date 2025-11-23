import React, { useState, useEffect } from 'react';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { subscribeToUserGroups } from './firebaseService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import GroupChat from './components/GroupChat';
import CreateGroup from './components/CreateGroup';
import Sidebar from './components/Sidebar';
import { format } from 'date-fns';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setGroups([]);
            setCurrentGroup(null);
            return;
        }

        const unsubscribe = subscribeToUserGroups(user.uid, (userGroups) => {
            setGroups(userGroups);

            // Auto-select first group if none selected
            if (!currentGroup && userGroups.length > 0) {
                setCurrentGroup(userGroups[0]);
            }
            // If current group was deleted or user removed, switch to another group
            else if (currentGroup) {
                const updatedGroup = userGroups.find(g => g.id === currentGroup.id);
                if (updatedGroup) {
                    setCurrentGroup(updatedGroup);
                } else if (userGroups.length > 0) {
                    setCurrentGroup(userGroups[0]);
                } else {
                    setCurrentGroup(null);
                }
            }
        });

        return () => unsubscribe();
    }, [user, currentGroup]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app-container">
            <Header
                user={user}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                groups={groups}
                currentGroup={currentGroup}
                onSelectGroup={setCurrentGroup}
                onCreateGroup={() => setIsCreateGroupOpen(true)}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
                onToggleSidebar={() => setIsSidebarOpen(true)}
                groupsLoading={false}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                groups={groups}
                currentGroup={currentGroup}
                onSelectGroup={setCurrentGroup}
                onCreateGroup={() => setIsCreateGroupOpen(true)}
            />

            <main className="container pb-5">
                <Dashboard
                    user={user}
                    currentMonth={currentMonth}
                    group={currentGroup}
                />
            </main>

            <CreateGroup
                isOpen={isCreateGroupOpen}
                onClose={() => setIsCreateGroupOpen(false)}
                user={user}
                onGroupCreated={(groupId) => {
                    // Group selection handled by useEffect
                }}
            />

            <GroupChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                group={currentGroup}
                user={user}
            />
        </div>
    );
}

export default App;
