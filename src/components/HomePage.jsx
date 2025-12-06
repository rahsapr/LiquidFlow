import React from 'react';
import './HomePage.css';
import { PlayIcon, PlusIcon, MicIcon, GridIcon } from './Icons';

const HomePage = ({ onCreateScript, onOpenAnalytics, onShowHelp }) => {
    return (
        <div className="home-page">
            <div className="home-content">
                <div className="home-hero">
                    <h1 className="home-title">LiquidFlow</h1>
                    <p className="home-subtitle">
                        Professional Teleprompter
                    </p>
                </div>

                <div className="home-actions">
                    <button 
                        className="home-cta primary"
                        onClick={onCreateScript}
                    >
                        <PlusIcon size={20} />
                        <span>Create New Script</span>
                    </button>
                    
                    <button 
                        className="home-cta secondary"
                        onClick={onShowHelp}
                    >
                        <span>View Shortcuts</span>
                    </button>
                </div>

                <div className="home-features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <PlayIcon size={24} />
                        </div>
                        <h3>Smooth Scrolling</h3>
                        <p>Adjustable speed with keyboard controls</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <MicIcon size={24} />
                        </div>
                        <h3>Voice Follow</h3>
                        <p>Highlights words as you speak</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <GridIcon size={24} />
                        </div>
                        <h3>Multi-Script Library</h3>
                        <p>Organize scripts in folders</p>
                    </div>
                </div>

                <div className="home-shortcuts">
                    <h3>Quick Shortcuts</h3>
                    <div className="shortcut-grid">
                        <div className="shortcut-item">
                            <kbd>Space</kbd>
                            <span>Play / Pause</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>↑ ↓</kbd>
                            <span>Adjust Speed</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Exit Player</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>?</kbd>
                            <span>Show Help</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
