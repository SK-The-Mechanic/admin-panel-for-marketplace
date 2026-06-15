import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const API = 'http://192.168.0.105:5000/api/admin';
import { API_BASE_URL } from '../config';
const API = `${API_BASE_URL}/admin`;

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [resetModal, setResetModal] = useState(null); // holds user object
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone!`)) return;
        try {
            await axios.delete(`${API}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
            alert('User deleted!');
        } catch (err) {
            alert('Could not delete user!');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }
        try {
            await axios.put(`${API}/reset-password/${resetModal._id}`,
                { newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Password reset for ${resetModal.name}!`);
            setResetModal(null);
            setNewPassword('');
        } catch (err) {
            alert('Could not reset password!');
        }
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.studentId.includes(search) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div style={styles.center}>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .loader-ring {
                        border: 4px solid rgba(255, 255, 255, 0.1);
                        border-top: 4px solid #818cf8;
                        border-radius: 50%;
                        width: 45px;
                        height: 45px;
                        animation: spin 1s linear infinite;
                    }
                `}</style>
                <div className="loader-ring"></div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Global Document Styling, Transitions, Row Animations, and Hover Configurations */}
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    min-height: 100vh;
                    background-color: #0f172a;
                }
                .back-action-btn {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    transition: all 0.25s ease;
                }
                .back-action-btn:hover {
                    background-color: rgba(255, 255, 255, 0.18) !important;
                    transform: translateX(-3px);
                }
                .search-field::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
                .search-field:focus {
                    border-color: rgba(129, 140, 248, 0.5) !important;
                    box-shadow: 0 0 15px rgba(129, 140, 248, 0.15);
                    outline: none;
                }
                .interactive-row {
                    transition: background-color 0.2s ease, transform 0.2s ease;
                }
                .interactive-row:hover {
                    background-color: rgba(255, 255, 255, 0.02) !important;
                }
                .action-pill-btn {
                    transition: all 0.2s ease;
                }
                .action-pill-btn:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.15);
                }
                @keyframes rotateModalBorder {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .modal-glow-frame {
                    position: relative;
                    width: 100%;
                    max-width: 380px;
                    border-radius: 16px;
                    padding: 2px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
                    box-sizing: border-box;
                }
                .modal-glow-frame::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, transparent 20%, #818cf8, #a5b4fc, transparent 50%);
                    animation: rotateModalBorder 4s linear infinite;
                    z-index: 0;
                }
            `}</style>

            {/* Header control board layout strip */}
            <div style={styles.header}>
                <button className="back-action-btn" style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
                <h1 style={styles.title}>👥 Manage Users</h1>
                <span style={styles.count}>{filtered.length} visible / {users.length} total</span>
            </div>

            {/* Main Operational Container Card */}
            <div style={styles.mainCard}>
                <input
                    className="search-field"
                    style={styles.search}
                    placeholder="Search systems by name, student ID or registry email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {/* Users Tabular Sheet Frame */}
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Student ID</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Dept</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Joined</th>
                                <th style={styles.th} style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u._id} className="interactive-row" style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.identityCell}>
                                            {u.profilePicture ? (
                                                <img src={u.profilePicture} style={styles.avatar} alt="" />
                                            ) : (
                                                <div style={styles.avatarPlaceholder}>👤</div>
                                            )}
                                            <span style={styles.userNameText}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{u.studentId}</td>
                                    <td style={styles.td} style={{ ...styles.td, color: '#cbd5e1' }}>{u.email}</td>
                                    <td style={styles.td} style={{ ...styles.td, fontWeight: '600', color: '#a5b4fc' }}>{u.dept}</td>
                                    <td style={styles.td}>
                                        <span style={u.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={styles.td} style={{ ...styles.td, color: '#64748b' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actionCellContainer}>
                                            <button
                                                className="action-pill-btn"
                                                style={styles.resetBtn}
                                                onClick={() => { setResetModal(u); setNewPassword(''); }}>
                                                🔑 Reset
                                            </button>
                                            {u.role !== 'admin' ? (
                                                <button
                                                    className="action-pill-btn"
                                                    style={styles.deleteBtn}
                                                    onClick={() => handleDelete(u._id, u.name)}>
                                                    🗑️ Delete
                                                </button>
                                            ) : (
                                                <div style={styles.actionPlaceholderSpace} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={styles.emptyTableRowState}>
                                        No matched university user profiles identified.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Framed Rotating Neon Border Password Modification Modal Overlay */}
            {resetModal && (
                <div style={styles.modalOverlay}>
                    <div className="modal-glow-frame">
                        <div style={styles.modal}>
                            <h2 style={styles.modalTitle}>🔑 Reset Password</h2>
                            <p style={styles.modalSub}>Modifying data metrics for <strong style={{ color: '#fff' }}>{resetModal.name}</strong></p>
                            <input
                                className="search-field"
                                style={styles.modalInput}
                                type="password"
                                placeholder="New credentials (min 6 chars)"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <div style={styles.modalButtons}>
                                <button className="action-pill-btn" style={styles.cancelBtn} onClick={() => setResetModal(null)}>
                                    Cancel
                                </button>
                                <button className="action-pill-btn" style={styles.confirmBtn} onClick={handleResetPassword}>
                                    Save Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
        padding: '40px 24px',
        boxSizing: 'border-box',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 32px',
        marginBottom: '32px',
        color: '#fff',
        maxWidth: '1200px',
        margin: '0 auto 32px auto',
        boxSizing: 'border-box',
    },
    backBtn: {
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    title: {
        margin: 0,
        fontSize: '22px',
        fontWeight: 'bold',
        flex: 1,
    },
    count: {
        fontSize: '14px',
        color: '#94a3b8',
    },
    mainCard: {
        backgroundColor: '#0b0f19',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxSizing: 'border-box',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    },
    search: {
        width: '100%',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        color: '#ffffff',
        fontSize: '15px',
        marginBottom: '28px',
        boxSizing: 'border-box',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        transition: 'all 0.25s ease',
    },
    tableWrapper: {
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    thead: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    th: {
        padding: '16px 20px',
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    tr: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        backgroundColor: 'transparent',
    },
    td: {
        padding: '16px 20px',
        fontSize: '14px',
        color: '#ffffff',
        verticalAlign: 'middle',
    },
    identityCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    userNameText: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    avatarPlaceholder: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    adminBadge: {
        backgroundColor: 'rgba(129, 140, 248, 0.15)',
        color: '#a5b4fc',
        border: '1px solid rgba(129, 140, 248, 0.4)',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    userBadge: {
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        color: '#34d399',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    actionCellContainer: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
    },
    resetBtn: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        color: '#fbbf24',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '8px',
        padding: '6px 14px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
    },
    deleteBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        color: '#fca5a5',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '8px',
        padding: '6px 14px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
    },
    actionPlaceholderSpace: {
        width: '84px',
    },
    emptyTableRowState: {
        padding: '40px',
        textAlign: 'center',
        color: '#64748b',
        fontStyle: 'italic',
        fontSize: '15px',
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
    },
    modal: {
        position: 'relative',
        backgroundColor: '#0b0f19',
        borderRadius: '14px',
        padding: '40px 32px',
        zIndex: 1,
        boxSizing: 'border-box',
    },
    modalTitle: {
        color: '#ffffff',
        margin: '0 0 6px 0',
        fontSize: '22px',
        fontWeight: 'bold',
    },
    modalSub: {
        color: '#94a3b8',
        margin: '0 0 24px 0',
        fontSize: '14px',
    },
    modalInput: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        color: '#ffffff',
        fontSize: '15px',
        marginBottom: '24px',
        boxSizing: 'border-box',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
    },
    cancelBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
    },
    confirmBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};