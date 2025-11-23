import React, { useState } from 'react';
import { signInUser, signUpUser } from '../firebaseService';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInUser(email, password);
            } else {
                if (!name) throw new Error("Name is required");
                await signUpUser(email, password, name);
            }
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 position-relative overflow-hidden d-flex align-items-center justify-content-center p-4" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
        }}>
            {/* Animated Background Overlays */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15), transparent 50%)'
            }}></div>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                background: 'radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.15), transparent 50%)'
            }}></div>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1), transparent 70%)'
            }}></div>

            {/* Floating Orbs */}
            <div className="position-absolute rounded-circle" style={{
                top: '5rem',
                left: '5rem',
                width: '18rem',
                height: '18rem',
                background: 'rgba(139, 92, 246, 0.2)',
                filter: 'blur(60px)',
                animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            <div className="position-absolute rounded-circle" style={{
                bottom: '5rem',
                right: '5rem',
                width: '24rem',
                height: '24rem',
                background: 'rgba(236, 72, 153, 0.2)',
                filter: 'blur(60px)',
                animation: 'pulse 3s ease-in-out infinite',
                animationDelay: '1s'
            }}></div>

            {/* Main Card */}
            <div className="position-relative" style={{ maxWidth: '28rem', width: '100%', zIndex: 10 }}>
                {/* Card Container */}
                <div className="position-relative rounded-4 p-4 shadow-lg" style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    {/* Glow Effect */}
                    <div className="position-absolute rounded-4" style={{
                        inset: '-2px',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #8b5cf6)',
                        opacity: 0.2,
                        filter: 'blur(20px)',
                        zIndex: -1
                    }}></div>

                    {/* Content */}
                    <div className="position-relative">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 shadow" style={{
                                width: '4rem',
                                height: '4rem',
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.5)'
                            }}>
                                <i className="bi bi-currency-dollar text-white" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <h1 className="fw-bold mb-2" style={{
                                fontSize: '2.5rem',
                                background: 'linear-gradient(135deg, #ffffff, #c084fc, #f9a8d4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {isLogin ? 'Welcome Back' : 'Join Us'}
                            </h1>
                            <p className="text-muted small">
                                {isLogin ? 'Track your shared expenses effortlessly' : 'Start managing your flat expenses today'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center mb-3 rounded-3" role="alert" style={{
                                background: 'rgba(220, 38, 38, 0.1)',
                                border: '1px solid rgba(220, 38, 38, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div className="rounded-circle me-2" style={{
                                    width: '0.5rem',
                                    height: '0.5rem',
                                    background: '#dc2626',
                                    animation: 'pulse 2s ease-in-out infinite'
                                }}></div>
                                <small className="text-danger-emphasis">{error}</small>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Name Field (Sign Up Only) */}
                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="form-label text-light small fw-medium">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text border-0" style={{
                                            background: 'rgba(30, 41, 59, 0.5)',
                                            color: '#94a3b8'
                                        }}>
                                            <User size={20} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 text-white"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={!isLogin}
                                            style={{
                                                background: 'rgba(30, 41, 59, 0.5)',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(139, 92, 246, 0.25)';
                                                e.target.style.borderColor = '#8b5cf6';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.boxShadow = 'none';
                                                e.target.style.borderColor = 'transparent';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="mb-3">
                                <label className="form-label text-light small fw-medium">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0" style={{
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        color: '#94a3b8'
                                    }}>
                                        <Mail size={20} />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control border-0 text-white"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            background: 'rgba(30, 41, 59, 0.5)',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.boxShadow = '0 0 0 0.2rem rgba(139, 92, 246, 0.25)';
                                            e.target.style.borderColor = '#8b5cf6';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.borderColor = 'transparent';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="mb-3">
                                <label className="form-label text-light small fw-medium">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0" style={{
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        color: '#94a3b8'
                                    }}>
                                        <Lock size={20} />
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control border-0 text-white"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{
                                            background: 'rgba(30, 41, 59, 0.5)',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.boxShadow = '0 0 0 0.2rem rgba(139, 92, 246, 0.25)';
                                            e.target.style.borderColor = '#8b5cf6';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.borderColor = 'transparent';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn w-100 text-white fw-semibold mt-3 d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden"
                                disabled={loading}
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                    border: 'none',
                                    padding: '0.75rem',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 15px 30px rgba(139, 92, 246, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                                }}
                            >
                                {loading ? (
                                    <Loader2 size={20} className="spinner-border spinner-border-sm" />
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Toggle Auth Mode */}
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="btn btn-link text-decoration-none small"
                                style={{ color: '#94a3b8', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                            >
                                {isLogin ? (
                                    <>
                                        Don't have an account?{' '}
                                        <span className="fw-medium" style={{ color: '#a78bfa' }}>
                                            Sign Up
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <span className="fw-medium" style={{ color: '#a78bfa' }}>
                                            Sign In
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .form-control::placeholder {
                    color: #64748b;
                }
                
                .input-group-text {
                    transition: color 0.2s;
                }
                
                .input-group:focus-within .input-group-text {
                    color: #a78bfa !important;
                }
            `}</style>
        </div>
    );
};

export default Login;
