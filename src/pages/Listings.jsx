import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const API = 'http://192.168.0.105:5000/api/admin';
import { API_BASE_URL } from '../config';
const API = `${API_BASE_URL}/admin`;

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await axios.get(`${API}/listings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(res.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete listing "${title}"? This cannot be undone!`)) return;
        try {
            await axios.delete(`${API}/listings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(listings.filter(l => l._id !== id));
            alert('Listing deleted!');
        } catch (err) {
            alert('Could not delete listing!');
        }
    };

    const filtered = listings.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.seller.toLowerCase().includes(search.toLowerCase()) ||
        l.dept.toLowerCase().includes(search.toLowerCase())
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
            {/* Global Document Styling, Image Scaling, Transitions, and Hover Border Track Configurations */}
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
                @keyframes rotateListingBorder {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .listing-card-wrapper {
                    position: relative;
                    border-radius: 16px;
                    padding: 2px; /* Border line thickness */
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    box-sizing: border-box;
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                /* Rotating neon glow borders */
                .listing-card-wrapper::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, transparent 20%, #818cf8, #a5b4fc, transparent 50%);
                    animation: rotateListingBorder 4s linear infinite;
                    z-index: 0;
                }
                /* Hover effect states */
                .listing-card-wrapper:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 15px 35px rgba(129, 140, 248, 0.3);
                }
                .image-frame {
                    width: 100%;
                    height: 180px;
                    overflow: hidden;
                    position: relative;
                }
                .listing-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }
                .listing-card-wrapper:hover .listing-image {
                    transform: scale(1.06);
                }
                .destructive-btn {
                    transition: all 0.25s ease;
                }
                .destructive-btn:hover {
                    background-color: rgba(239, 68, 68, 0.3) !important;
                    border-color: rgba(239, 68, 68, 0.6) !important;
                    transform: translateY(-1px);
                }
            `}</style>

            {/* Header control board layout strip */}
            <div style={styles.header}>
                <button className="back-action-btn" style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
                <h1 style={styles.title}>📦 Manage Listings</h1>
                <span style={styles.count}>{filtered.length} visible / {listings.length} total</span>
            </div>

            {/* Main Layout Area */}
            <div style={styles.mainWrapper}>
                <input
                    className="search-field"
                    style={styles.search}
                    placeholder="Search market listings by title, seller or product department..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {/* Grid Layout Container */}
                <div style={styles.grid}>
                    {filtered.map(l => (
                        <div key={l._id} className="listing-card-wrapper">
                            <div style={styles.cardInnerContent}>
                                {/* Image Frame */}
                                <div className="image-frame">
                                    {l.imageUrl ? (
                                        <img src={l.imageUrl} className="listing-image" alt={l.title} />
                                    ) : (
                                        <div style={styles.imagePlaceholder}>📖</div>
                                    )}
                                </div>

                                {/* Body Information Layer */}
                                <div style={styles.cardBody}>
                                    <h3 style={styles.cardTitle}>{l.title}</h3>
                                    <p style={styles.cardPrice}>৳ {l.price}</p>

                                    <div style={styles.divider} />

                                    <p style={styles.cardInfo}>👤 <span style={{ color: '#ffffff' }}>{l.seller}</span></p>
                                    <p style={styles.cardInfo}>🎓 <span style={{ color: '#a5b4fc', fontWeight: '600' }}>{l.dept}</span></p>
                                    <p style={styles.cardInfo}>📅 <span style={{ color: '#64748b' }}>{new Date(l.createdAt).toLocaleDateString()}</span></p>

                                    {l.description && (
                                        <p style={styles.cardDesc}>{l.description}</p>
                                    )}

                                    <button
                                        className="destructive-btn"
                                        style={styles.deleteBtn}
                                        onClick={() => handleDelete(l._id, l.title)}>
                                        🗑️ Delete Listing
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <p style={styles.empty}>⚠️ No identified marketplace listings match your query.</p>
                    )}
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
    mainWrapper: {
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
    },
    search: {
        width: '100%',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#0b0f19',
        color: '#ffffff',
        fontSize: '15px',
        marginBottom: '32px',
        boxSizing: 'border-box',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        transition: 'all 0.25s ease',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '32px',
        boxSizing: 'border-box',
    },
    cardInnerContent: {
        position: 'relative',
        backgroundColor: '#0b0f19', /* Pure, solid dark blocks any background leakage */
        borderRadius: '14px',
        overflow: 'hidden',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
    },
    cardBody: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    cardTitle: {
        margin: '0 0 6px 0',
        color: '#ffffff',
        fontSize: '17px',
        fontWeight: 'bold',
        lineHeight: '24px',
    },
    cardPrice: {
        color: '#a5b4fc',
        fontSize: '22px',
        fontWeight: 'bold',
        margin: '0 0 12px 0',
    },
    divider: {
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        marginVertical: '12px',
        marginBottom: '14px',
    },
    cardInfo: {
        color: '#94a3b8',
        fontSize: '13.5px',
        margin: '5px 0',
    },
    cardDesc: {
        color: '#cbd5e1',
        fontSize: '13px',
        margin: '14px 0 0 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '12px',
        lineHeight: '18px',
        flex: 1,
    },
    deleteBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        color: '#fca5a5',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '20px',
    },
    empty: {
        color: '#94a3b8',
        textAlign: 'center',
        gridColumn: '1/-1',
        marginTop: '60px',
        fontSize: '16px',
        fontStyle: 'italic',
    },
};