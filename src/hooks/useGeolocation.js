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
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });

            if (points) {
                let minDistance = Infinity;
                let closest = null;

                points.forEach(point => {
                    const dist = getDistance(latitude, longitude, point.lat, point.lng);
                    // Attach distance to point
                    point.distanceKm = dist.toFixed(2);

                    if (dist < minDistance) {
                        minDistance = dist;
                        closest = point;
                    }
                });

                // Trigger if less than 1km (for demo/MVP purposes)
                // In real life maybe 100m. But for testing 10km might be better if user is far.
                // Let's set a threshold of 0.5km for the "Popup"
                if (closest && minDistance < 0.5) {
                    setNearest(closest);
                } else {
                    setNearest(null); // Or keep closest but track it's far
                }
            }
        };

        const handleError = () => {
            setError("Unable to retrieve your location");
        };

        const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000
        });

        return () => navigator.geolocation.clearWatch(id);
    }, [points]);

    return { location, nearest, error, getDistance };
}
