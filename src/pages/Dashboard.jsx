import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Global document overrides, rotating border animations, and hover glow configurations */}
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    min-height: 100vh;
                    background-color: #0f172a;
                }
                @keyframes rotateBorder {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .dashboard-card-wrapper {
                    position: relative;
                    border-radius: 16px;
                    padding: 2px; /* Animated border line thickness */
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    box-sizing: border-box;
                    cursor: pointer;
                    transition: transform 0.25s ease, box-shadow 0.25s ease !important;
                }
                /* The spinning neon border track hidden behind the mask */
                .dashboard-card-wrapper::before {
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
                /* Hover state: lifts up the card and expands the neon ambient light drop-shadow */
                .dashboard-card-wrapper:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 15px 35px rgba(129, 140, 248, 0.35);
                }
                .action-btn {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    transition: all 0.2s ease;
                }
                .dashboard-card-wrapper:hover .action-btn {
                    background-color: rgba(99, 102, 241, 0.2) !important;
                    border-color: rgba(99, 102, 241, 0.5) !important;
                }
                .logout-btn-style {
                    background-color: rgba(239, 68, 68, 0.15) !important;
                    border: 1px solid rgba(239, 68, 68, 0.4) !important;
                    transition: all 0.2s ease;
                }
                .logout-btn-style:hover {
                    background-color: rgba(239, 68, 68, 0.3) !important;
                    transform: scale(1.03);
                }
            `}</style>

            {/* Top Navigation Control Strip */}
            <div style={styles.header}>
                <h1 style={styles.title}>🏛️ BUBT Admin Panel</h1>
                <div style={styles.headerRight}>
                    <span style={styles.welcome}>👋 Welcome, <strong style={{ color: '#fff' }}>{user.name || 'Admin'}</strong></span>
                    <button className="logout-btn-style" style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
                </div>
            </div>

            {/* System Grid Layout */}
            <div style={styles.grid}>
                {/* Card 1: Users */}
                <div className="dashboard-card-wrapper" onClick={() => navigate('/users')}>
                    <div style={styles.cardInnerContent}>
                        <div style={styles.cardIcon}>👥</div>
                        <h2 style={styles.cardTitle}>Manage Users</h2>
                        <p style={styles.cardDesc}>View, search and delete fraud accounts</p>
                        <button className="action-btn" style={styles.cardBtn}>Go to Users →</button>
                    </div>
                </div>

                {/* Card 2: Listings */}
                <div className="dashboard-card-wrapper" onClick={() => navigate('/listings')}>
                    <div style={styles.cardInnerContent}>
                        <div style={styles.cardIcon}>📦</div>
                        <h2 style={styles.cardTitle}>Manage Listings</h2>
                        <p style={styles.cardDesc}>View and remove sold or expired listings</p>
                        <button className="action-btn" style={styles.cardBtn}>Go to Listings →</button>
                    </div>
                </div>
            </div>
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 32px',
        marginBottom: '40px',
        maxWidth: '1000px',
        margin: '0 auto 40px auto',
        boxSizing: 'border-box',
    },
    title: {
        margin: 0,
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    welcome: {
        fontSize: '15px',
        color: '#94a3b8',
    },
    logoutBtn: {
        color: '#fca5a5',
        border: 'none',
        borderRadius: '10px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        maxWidth: '1000px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    cardInnerContent: {
        position: 'relative',
        backgroundColor: '#0b0f19', /* Pure, solid dark tint blocks any internal color bleeding */
        borderRadius: '14px',
        padding: '40px 32px',
        zIndex: 1,
        height: '100%',
        boxSizing: 'border-box',
    },
    cardIcon: {
        fontSize: '54px',
        marginBottom: '20px',
    },
    cardTitle: {
        color: '#ffffff',
        margin: '0 0 10px 0',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    cardDesc: {
        color: '#94a3b8',
        fontSize: '14px',
        margin: '0 0 30px 0',
        lineHeight: '20px',
    },
    cardBtn: {
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        width: '100%',
    },
};