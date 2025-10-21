import React from "react";
import { MessageCircle, Facebook } from "lucide-react";

export default function SocialButtons() {
    const handleZaloClick = () => {
        const phone = "0969729035";
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `zalo://conversation?phone=${phone}`;
        } else {
            window.open(`https://zalo.me/${phone}`, "_blank");
        }
    };

    const socialLinks = [
        {
            id: "facebook",
            title: "Liên hệ Facebook",
            href: "https://www.facebook.com/profile.php?id=61582092933742",
            icon: Facebook,
            gradient: "linear-gradient(135deg, #62cbf5ff 0%, #a8d5f7 100%)",
            hoverGradient: "linear-gradient(135deg, #5bb8e8 0%, #72cdf1 100%)",
            shadowColor: "rgba(114, 205, 241, 0.4)",
            hoverShadow: "rgba(114, 205, 241, 0.6)",
            particleColor: "#72cdf1",
        },
        {
            id: "zalo",
            title: "Chat Zalo ngay",
            onClick: handleZaloClick,
            icon: MessageCircle,
            gradient: "linear-gradient(135deg, #ffafd2ff 0%, #ffc9de 100%)",
            hoverGradient: "linear-gradient(135deg, #ffbbd8 0%, #ffa8cd 100%)",
            shadowColor: "rgba(255, 214, 232, 0.4)",
            hoverShadow: "rgba(255, 214, 232, 0.6)",
            particleColor: "#ffd6e8",
        },
        {
            id: "tiktok",
            title: "Xem TikTok",
            href: "https://www.tiktok.com/@_mhwgz.wtip",
            icon: () => (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "1em", height: "1em" }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            ),
            gradient: "linear-gradient(135deg, #6fd8acff 0%, #b8f0d6 100%)",
            hoverGradient: "linear-gradient(135deg, #b8f0d6 0%, #9ee8c4 100%)",
            shadowColor: "rgba(214, 245, 232, 0.4)",
            hoverShadow: "rgba(214, 245, 232, 0.6)",
            particleColor: "#d6f5e8",
        },
    ];

    return (
        <div className="social-buttons-container">
            <style>{`
                @keyframes gentleFloat {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg);
                    }
                    25% { 
                        transform: translateY(-6px) rotate(2deg);
                    }
                    75% { 
                        transform: translateY(-6px) rotate(-2deg);
                    }
                }

                @keyframes pulseGlow {
                    0%, 100% { 
                        box-shadow: 0 4px 12px var(--shadow-color), 0 0 0 0 var(--glow-color);
                    }
                    50% { 
                        box-shadow: 0 6px 16px var(--shadow-color), 0 0 0 8px transparent;
                    }
                }

                @keyframes shimmer {
                    0% { 
                        transform: translateX(-100%) translateY(-100%) rotate(45deg);
                    }
                    100% { 
                        transform: translateX(100%) translateY(100%) rotate(45deg);
                    }
                }

                @keyframes floatParticle {
                    0% {
                        transform: translate(0, 0) scale(0);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty)) scale(1);
                        opacity: 0;
                    }
                }

                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }

                .social-buttons-container {
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    z-index: 2000;
                }

                .social-button-wrapper {
                    position: relative;
                    animation: gentleFloat 4s ease-in-out infinite;
                }

                .social-button-wrapper:nth-child(1) {
                    animation-delay: 0s;
                }

                .social-button-wrapper:nth-child(2) {
                    animation-delay: 0.4s;
                }

                .social-button-wrapper:nth-child(3) {
                    animation-delay: 0.8s;
                }

                .social-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: var(--gradient);
                    color: white;
                    border: 3px solid white;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    font-size: 28px;
                    padding: 0;
                    position: relative;
                    overflow: hidden;
                    text-decoration: none;
                    --shadow-color: var(--custom-shadow);
                    --glow-color: var(--custom-glow);
                    animation: pulseGlow 3s ease-in-out infinite;
                }

                .social-button::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, 
                        transparent 0%, 
                        rgba(255, 255, 255, 0.4) 50%, 
                        transparent 100%
                    );
                    transform: translateX(-100%) translateY(-100%) rotate(45deg);
                    transition: transform 0.6s ease;
                }

                .social-button:hover::before {
                    animation: shimmer 1s ease-in-out;
                }

                .social-button:hover {
                    background: var(--hover-gradient);
                    transform: scale(1.2) translateY(-4px);
                    box-shadow: 0 12px 28px var(--hover-shadow), 0 0 20px var(--glow-color);
                    border-color: rgba(255, 255, 255, 0.9);
                }

                .social-button:active {
                    transform: scale(1.05) translateY(-2px);
                    animation: wiggle 0.5s ease-in-out;
                }

                .social-button svg {
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }

                .tooltip {
                    position: absolute;
                    right: 70px;
                    top: 50%;
                    transform: translateY(-50%) translateX(10px);
                    background: rgba(255, 255, 255, 0.95);
                    color: #555;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border: 2px solid var(--border-color);
                }

                .tooltip::after {
                    content: '';
                    position: absolute;
                    right: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-left: 8px solid var(--border-color);
                }

                .social-button-wrapper:hover .tooltip {
                    opacity: 1;
                    transform: translateY(-50%) translateX(0);
                }

                .particle {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--particle-color);
                    pointer-events: none;
                    opacity: 0;
                }

                .social-button:hover .particle {
                    animation: floatParticle 1.5s ease-out forwards;
                }

                .particle:nth-child(2) {
                    --tx: -40px;
                    --ty: -40px;
                    animation-delay: 0s;
                }

                .particle:nth-child(3) {
                    --tx: 40px;
                    --ty: -40px;
                    animation-delay: 0.1s;
                }

                .particle:nth-child(4) {
                    --tx: -40px;
                    --ty: 40px;
                    animation-delay: 0.2s;
                }

                .particle:nth-child(5) {
                    --tx: 40px;
                    --ty: 40px;
                    animation-delay: 0.3s;
                }

                .particle:nth-child(6) {
                    --tx: 0px;
                    --ty: -50px;
                    animation-delay: 0.15s;
                }

                @media (max-width: 768px) {
                    .social-buttons-container {
                        right: 12px;
                        gap: 12px;
                    }

                    .social-button {
                        width: 52px;
                        height: 52px;
                        font-size: 24px;
                    }

                    .tooltip {
                        font-size: 12px;
                        padding: 6px 12px;
                    }
                }
            `}</style>

            {socialLinks.map((social) => {
                const IconComponent = social.icon;

                return (
                    <div key={social.id} className="social-button-wrapper">
                        <a
                            href={social.href}
                            onClick={social.onClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-button"
                            style={{
                                "--gradient": social.gradient,
                                "--hover-gradient": social.hoverGradient,
                                "--custom-shadow": social.shadowColor,
                                "--hover-shadow": social.hoverShadow,
                                "--custom-glow": social.particleColor,
                                "--particle-color": social.particleColor,
                            }}
                        >
                            <IconComponent size={28} />
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                        </a>
                        <div
                            className="tooltip"
                            style={{ "--border-color": social.particleColor }}
                        >
                            {social.title}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}