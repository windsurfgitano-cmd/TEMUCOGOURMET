import React, { useEffect, useRef } from 'react';

export default function Notification({ restaurant, onDismiss }) {
    const audioCtxRef = useRef(null);

    useEffect(() => {
        // Play sound on mount - Short, elegant ping
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, []);

    if (!restaurant) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#000',
                border: '1px solid #fff',
                color: '#fff',
                padding: '3rem 2rem',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                transform: 'scale(1)',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#888' }}>
                    Oportunidad Cercana
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: '1' }}>
                    {restaurant.name}
                </h2>

                <div style={{
                    margin: '2rem 0',
                    padding: '1rem',
                    borderTop: '1px solid #333',
                    borderBottom: '1px solid #333',
                    fontFamily: 'monospace',
                    fontSize: '1.2rem'
                }}>
                    {restaurant.discount}
                </div>

                <button
                    onClick={onDismiss}
                    style={{
                        background: '#fff',
                        color: '#000',
                        fontSize: '0.9rem',
                        fontWeight: '800',
                        padding: '1rem 2rem',
                        borderRadius: '0',
                        width: '100%',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                >
                    Reclamar
                </button>
            </div>
            <style>{`
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
