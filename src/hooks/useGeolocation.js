import { useState, useEffect } from 'react';

export function useGeolocation(points) {
    const [location, setLocation] = useState(null);
    const [nearest, setNearest] = useState(null);
    const [error, setError] = useState(null);

    // Haversine formula to calculate distance in km
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    useEffect(() => {
        let watchId;

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            setError(null); // Clear previous errors

            if (points) {
                let minDistance = Infinity;
                let closest = null;

                points.forEach(point => {
                    const dist = getDistance(latitude, longitude, point.lat, point.lng);
                    point.distanceKm = dist.toFixed(2);

                    if (dist < minDistance) {
                        minDistance = dist;
                        closest = point;
                    }
                });

                if (closest && minDistance < 0.5) {
                    setNearest(closest);
                } else {
                    setNearest(null);
                }
            }
        };

        const handleError = (err) => {
            console.warn("Geo error:", err);
            if (err.code === 1) {
                setError("Permiso denegado. Por favor, actívalo arriba.");
            } else if (err.code === 2) {
                setError("Ubicación no disponible.");
            } else if (err.code === 3) {
                // Timeout
                console.log("Timeout, retrying...");
                // Optionally trigger a manual reload or just keep waiting if watchPosition retries internaly (it usually doesn't for timeout)
                setError("Tardando mucho... asegúrate de tener GPS activo.");
            } else {
                setError("Error de ubicación desconocido.");
            }
        };

        const options = {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 20000 // Increased timeout for desktop/slow fix
        };

        watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

        return () => navigator.geolocation.clearWatch(watchId);
    }, [points]);

    return { location, nearest, error, getDistance };
}
