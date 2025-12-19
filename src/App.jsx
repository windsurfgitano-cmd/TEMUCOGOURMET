import { useState, useEffect } from 'react'
import { restaurants as mockRestaurants } from './data/restaurants'
import { useGeolocation } from './hooks/useGeolocation'
import { useDemoMode } from './hooks/useDemoMode'
import RestaurantCard from './components/RestaurantCard'
import Notification from './components/Notification'
import { supabase } from './supabaseClient'

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase or Fallback
  useEffect(() => {
    async function fetchData() {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('restaurants').select('*');
          if (error) throw error;
          if (data && data.length > 0) {
            setRestaurants(data);
          } else {
            setRestaurants(mockRestaurants);
          }
        } catch (e) {
          console.error("Supabase error:", e);
          setRestaurants(mockRestaurants);
        }
      } else {
        setRestaurants(mockRestaurants);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const { location, nearest: geoNearest, error } = useGeolocation(restaurants);
  const [showPopup, setShowPopup] = useState(false);
  const [dismissedId, setDismissedId] = useState(null);

  // Demo Mode Integration
  const [demoNearest, setDemoNearest] = useState(null);
  const { isActive, message, startDemo, stopDemo } = useDemoMode(restaurants, setDemoNearest, setShowPopup);

  // Decide which "nearest" to use
  const nearest = isActive ? demoNearest : geoNearest;

  useEffect(() => {
    if (nearest && nearest.id !== dismissedId) {
      setShowPopup(true);
    }
  }, [nearest, dismissedId]);

  const handleDismiss = () => {
    setShowPopup(false);
    if (nearest) setDismissedId(nearest.id);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #222',
        padding: '1.5rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', letterSpacing: '-1px' }}>TEMUCO<span style={{ fontWeight: '300' }}>GOURMET</span></h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!location && !isActive && (
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#fff',
                  padding: '0.4rem 1rem',
                  fontSize: '0.7rem',
                  borderRadius: '4px'
                }}
              >
                ACTIVAR GPS
              </button>
            )}
            <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isActive ? '⚡ DEMO MODE' : (location ? '● ONLINE' : '○ OFFLINE')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingBottom: '100px' }}>

        {/* Minimal Hero */}
        <div style={{
          margin: '3rem 0',
          padding: '2rem 0',
          borderBottom: '1px solid #222'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Colección<br />Exclusiva.</h2>
          <p style={{ color: '#666', maxWidth: '400px', fontSize: '1.1rem' }}>
            Acceso a los beneficios más selectos de la ciudad. Solo para miembros.
          </p>
        </div>

        {error && !isActive && (
          <div style={{ padding: '1rem', border: '1px solid #333', color: '#fff', marginBottom: '2rem', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Demo Overlay */}
        {isActive && (
          <div style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            color: '#000',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            zIndex: 200,
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            animation: 'pulse 1s infinite alternate',
            border: '2px solid #000'
          }}>
            {message}
            <style>{`@keyframes pulse { from { transform: translateX(-50%) scale(1); } to { transform: translateX(-50%) scale(1.05); } }`}</style>
          </div>
        )}

        <div className="restaurant-list">
          {restaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} distance={r.distanceKm} />
          ))}
        </div>
      </main>

      {/* Tab Bar (Minimal) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: '#000',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #222',
        zIndex: 100
      }}>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>HOME</span>
        <button
          onClick={isActive ? stopDemo : startDemo}
          style={{
            background: isActive ? '#333' : 'transparent',
            color: isActive ? '#fff' : '#666',
            border: '1px solid #333',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.7rem'
          }}
        >
          {isActive ? 'DETENER DEMO' : 'MODO DEMO'}
        </button>
        <span style={{ color: '#444', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>CUENTA</span>
      </nav>

      {/* Popup */}
      {showPopup && nearest && (
        <Notification restaurant={nearest} onDismiss={handleDismiss} />
      )}
    </div>
  )
}

export default App
