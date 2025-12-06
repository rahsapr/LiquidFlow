import './Onboarding.css';
import { PlayIcon, FolderIcon, SettingsIcon, CheckIcon } from '../Icons';

const Onboarding = ({ onComplete }) => {
    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card glass-panel">
                <h1 className="onboarding-title">Teleprompter.Online</h1>
                <p className="onboarding-subtitle">
                    The professional teleprompter for creators. <br />
                    Simple. Fast. Distraction-free.
                </p>

                <div className="feature-grid">
                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <PlayIcon size={32} />
                        </div>
                        <div className="feature-content">
                            <div className="feature-text">Space to Play</div>
                            <div className="feature-desc">Hit Spacebar to toggle playback instantly.</div>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <FolderIcon size={32} />
                        </div>
                        <div className="feature-content">
                            <div className="feature-text">Drag & Drop</div>
                            <div className="feature-desc">Drop .txt files directly onto the screen.</div>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <SettingsIcon size={32} />
                        </div>
                        <div className="feature-content">
                            <div className="feature-text">Speed Control</div>
                            <div className="feature-desc">Use Up/Down arrows to adjust pace.</div>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="icon-wrapper">
                            <CheckIcon size={32} />
                        </div>
                        <div className="feature-content">
                            <div className="feature-text">Auto-Save</div>
                            <div className="feature-desc">Your scripts are saved locally.</div>
                        </div>
                    </div>
                </div>

                <button className="start-btn pulse-glow" onClick={onComplete}>
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
