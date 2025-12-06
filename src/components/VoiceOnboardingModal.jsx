import React from 'react';
import './VoiceOnboardingModal.css';

const VoiceOnboardingModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="voice-modal-overlay">
            <div className="voice-modal glass">
                <div className="voice-icon-large">🎙️</div>
                <h2>Enable Voice Follow?</h2>
                <p>
                    This mode will listen to your voice and <strong>automatically scroll</strong> the script as you read aloud.
                </p>

                <div className="voice-tips">
                    <div className="tip">
                        <span className="tip-icon">✨</span>
                        <span>Auto-centers your line</span>
                    </div>
                    <div className="tip">
                        <span className="tip-icon">🛑</span>
                        <span>Stops automatically when you pause</span>
                    </div>
                    <div className="tip">
                        <span className="tip-icon">🔒</span>
                        <span>Your voice stays on-device</span>
                    </div>
                </div>

                <div className="voice-actions">
                    <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className="btn-confirm" onClick={onConfirm}>Start Listening</button>
                </div>
            </div>
        </div>
    );
};

export default VoiceOnboardingModal;
