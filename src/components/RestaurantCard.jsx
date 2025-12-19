import React from 'react';

export default function RestaurantCard({ restaurant, distance }) {
    const { name, category, image, discount, description, lat, lng } = restaurant;

    const handleNavigate = () => {
        // Open Google Maps
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return (
        <div id={`restaurant-${restaurant.id}`} className="card restaurant-card">
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={image}
                    alt={name}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) contrast(110%)'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    background: '#FFFFFF',
                    color: '#000000',
                    padding: '6px 16px',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: '4px'
                }}>
                    {discount}
                </div>
            </div>

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', lineHeight: '1.1' }}>{name}</h3>
                    <span style={{
                        color: 'var(--text-main)',
                        fontSize: '0.9rem',
                        border: '1px solid #333',
                        padding: '2px 8px',
                        borderRadius: '4px'
                    }}>
                        {distance ? `${distance} KM` : '...'}
                    </span>
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {category}
                </p>

                <p style={{ marginBottom: '2rem', fontSize: '1rem', color: '#ccc' }}>{description}</p>

                <button className="btn-primary" onClick={handleNavigate}>
                    IR AL LOCAL
                </button>
            </div>
        </div>
    );
}
