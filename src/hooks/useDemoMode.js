import { useState, useEffect } from 'react';

export function useDemoMode(restaurants, setNearest, setShowPopup) {
    const [isActive, setIsActive] = useState(false);
    const [step, setStep] = useState(0);
    const [message, setMessage] = useState('');

    const startDemo = () => {
        setIsActive(true);
        setStep(1);
    };

    const stopDemo = () => {
        setIsActive(false);
        setStep(0);
        setMessage('');
        setShowPopup(false);
        setNearest(null);
    };

    useEffect(() => {
        if (!isActive) return;

        let timer;

        // Advanced Pitch Script
        switch (step) {
            case 1: // Intro
                setMessage("🚀 Iniciando Modo Inversionista...");
                setNearest(null);
                setShowPopup(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                timer = setTimeout(() => setStep(2), 2500);
                break;

            case 2: // The Problem/Context
                setMessage("👀 El usuario camina por el centro...");
                timer = setTimeout(() => setStep(3), 3000);
                break;

            case 3: // Geolocation Tech
                setMessage("📡 Nuestra Tecnología detecta su ubicación...");
                timer = setTimeout(() => setStep(4), 2500);
                break;

            case 4: // The Hook (Notification)
                setMessage("🎯 ¡OPORTUNIDAD DETECTADA!");
                const target = restaurants.find(r => r.id === 1); // La Pampa
                if (target) setNearest(target);
                timer = setTimeout(() => setStep(5), 5000); // Let them see the popup
                break;

            case 5: // Conversion Flow
                setMessage("👇 El usuario hace click (Automático)");
                setShowPopup(false); // Simulate dismissal/click
                timer = setTimeout(() => setStep(6), 1000);
                break;

            case 6: // Fulfillment (Scroll to Card)
                setMessage("✨ Experiencia sin fricción: Llevamos al usuario directo al local.");
                const element = document.getElementById('restaurant-1');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Optional: Highlight effect could be done via CSS class toggling, but this is MVP
                    element.style.borderColor = '#fff';
                    element.style.transform = 'scale(1.02)';
                }
                timer = setTimeout(() => setStep(7), 5000);
                break;

            case 7: // Value Prop / Retention
                setMessage("💰 Resultado: +Tráfico, +Ventas, +Fidelidad.");
                const el = document.getElementById('restaurant-1');
                if (el) {
                    el.style.borderColor = ''; // reset
                    el.style.transform = '';
                }
                timer = setTimeout(() => setStep(8), 4000);
                break;

            case 8: // Closing
                setMessage("🏁 Temuco Gourmet: El futuro del comercio local.");
                timer = setTimeout(() => stopDemo(), 5000);
                break;

            default:
                stopDemo();
        }

        return () => clearTimeout(timer);
    }, [isActive, step, restaurants, setNearest, setShowPopup]);

    return { isActive, message, startDemo, stopDemo };
}
