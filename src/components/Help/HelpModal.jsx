import './HelpModal.css';

const HelpModal = ({ onClose }) => {
    return (
        <div className="help-overlay" onClick={onClose}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
                <button className="close-help-btn" onClick={onClose}>&times;</button>

                <h2>Keyboard Shortcuts</h2>

                <div className="shortcuts-grid">
                    <div className="shortcut-card">
                        <kbd className="key">Space</kbd>
                        <span>Play / Pause</span>
                    </div>
                    <div className="shortcut-card">
                        <kbd className="key">↑ ↓</kbd>
                        <span>Adjust Speed</span>
                    </div>
                    <div className="shortcut-card">
                        <kbd className="key">← →</kbd>
                        <span>Skip Back/Forward</span>
                    </div>
                    <div className="shortcut-card">
                        <kbd className="key">Esc</kbd>
                        <span>Exit Player</span>
                    </div>
                    <div className="shortcut-card">
                        <kbd className="key">?</kbd>
                        <span>Show Help</span>
                    </div>
                    <div className="shortcut-card">
                        <span style={{ fontSize: '20px' }}>🎤</span>
                        <span>Voice Follow</span>
                    </div>
                </div>

                <div className="help-section">
                    <h3>Quick Tips</h3>
                    <div className="tips-grid">
                        <div className="tip-item">
                            <strong>Drag & Drop</strong>
                            <p>Import .txt or .md files directly into the editor</p>
                        </div>
                        <div className="tip-item">
                            <strong>Focus Mask</strong>
                            <p>Gradient overlay highlights your reading line</p>
                        </div>
                        <div className="tip-item">
                            <strong>Auto-Save</strong>
                            <p>All scripts save automatically to your browser</p>
                        </div>
                        <div className="tip-item">
                            <strong>Color Modes</strong>
                            <p>Cycle through Dark, Light, and Jazz themes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
