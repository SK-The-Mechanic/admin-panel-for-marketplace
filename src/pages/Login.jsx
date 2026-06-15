import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const API = 'http://192.168.0.105:5000/api';
import { API_BASE_URL } from '../config';
const API = `${API_BASE_URL}/admin`;

export default function Login() {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { studentId, password });
            if (res.data.user.role !== 'admin') {
                setError('Access denied! Admin only.');
                return;
            }
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminUser', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Direct Global Override Fixes to enforce absolute zero-margin edge-to-edge rendering */}
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 100vh;
                    background-color: #0f172a;
                }
                @keyframes rotateBorder {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animated-card-glow {
                    position: relative;
                    width: 100%;
                    max-width: 380px;
                    border-radius: 16px;
                    padding: 2px; /* Border thickness */
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                    box-sizing: border-box;
                }
                .animated-card-glow::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, transparent 20%, #818cf8, #a5b4fc, transparent 50%);
                    animation: rotateBorder 4s linear infinite;
                    z-index: 0;
                }
                .admin-input::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
                .admin-input:focus {
                    border-color: rgba(129, 140, 248, 0.6) !important;
                    outline: none;
                }
            `}</style>

            {/* Main Wrapper */}
            <div className="animated-card-glow">
                {/* Solid Background Mask */}
                <div style={styles.cardInnerContent}>
                    <h1 style={styles.title}>🏛️ BUBT Marketplace</h1>
                    <h2 style={styles.subtitle}>Admin Panel</h2>

                    {error && <p style={styles.error}>⚠️ {error}</p>}

                    <form onSubmit={handleLogin} style={{ zIndex: 2, position: 'relative' }}>
                        <input
                            className="admin-input"
                            style={styles.input}
                            placeholder="Student ID"
                            value={studentId}
                            onChange={e => setStudentId(e.target.value)}
                        />
                        <input
                            className="admin-input"
                            style={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button style={styles.button} disabled={loading}>
                            {loading ? 'Verifying Admin Access...' : 'Secure Login Key ➤'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardInnerContent: {
        position: 'relative',
        backgroundColor: '#0b0f19', /* Pure, solid dark tint entirely blocks background leak-through */
        borderRadius: '14px',
        padding: '40px 32px',
        zIndex: 1,
    },
    title: {
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '6px',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: '14px',
        marginBottom: '28px',
        fontWeight: 'normal',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        color: '#ffffff',
        fontSize: '15px',
        marginBottom: '18px',
        boxSizing: 'border-box',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        transition: 'all 0.2s ease',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        color: '#ffffff',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        marginTop: '6px',
        transition: 'all 0.2s ease',
    },
    error: {
        color: '#fca5a5',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '13px',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
    },
};