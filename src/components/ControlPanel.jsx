import React from 'react';
import { PlayIcon, PauseIcon, MicIcon, TextIcon, MirrorIcon, FocusIcon, SunIcon, MoonIcon, HelpIcon } from './Icons';
import './ControlPanel.css';


const ControlPanel = ({
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    fontSize,
    setFontSize,
    isMirrored,
    setIsMirrored,
    isDyslexic,
    setIsDyslexic,
    colorMode,
    setColorMode,
    showFocusMask,
    setShowFocusMask,
    isListening,
    onToggleVoice,
    onHelp
}) => {
    const getModeIcon = () => {
        if (colorMode === 'light') return <SunIcon size={20} />;
        if (colorMode === 'dark') return <MoonIcon size={20} />;
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
            </svg>
        );
    };
    
    const getModeTooltip = () => {
        if (colorMode === 'light') return 'Light Mode (click for Vibe)';
        if (colorMode === 'dark') return 'Dark Mode (click for Light)';
        return 'Vibe Mode (click for Dark)';
    };
    return (
        <div className="control-bar glass">
            <div className="control-group main-action">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`play-toggle ${isPlaying ? 'active' : ''}`}
                    data-tooltip={isPlaying ? 'Pause auto-scroll (Space)' : 'Start auto-scroll (Space)'}
                >
                    {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} className="play-icon-offset" />}
                </button>
            </div>

            <div className="divider" />

            {/* Speed Control */}
            <div className="control-group">
                <label className="control-label">Speed</label>
                <div className="slider-wrapper">
                    <span className="value-badge">{speed}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        style={{ '--progress': `${speed}%` }}
                    />
                </div>
            </div>

            {/* Font Control */}
            <div className="control-group">
                <label className="control-label">Size</label>
                <div className="slider-wrapper">
                    <span className="value-badge">{fontSize}px</span>
                    <input
                        type="range"
                        min="20"
                        max="150"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        style={{ '--progress': `${(fontSize - 20) / (150 - 20) * 100}%` }}
                    />
                </div>
            </div>

            <div className="divider" />

            {/* Toggles */}
            <div className="control-group toggles">
                <button
                    onClick={() => setIsMirrored(!isMirrored)}
                    className={`icon-btn ${isMirrored ? 'active' : ''}`}
                    data-tooltip="Mirror Text"
                >
                    <MirrorIcon size={20} />
                </button>

                <button
                    onClick={() => setIsDyslexic(!isDyslexic)}
                    className={`icon-btn ${isDyslexic ? 'active' : ''}`}
                    data-tooltip="Easy Reading Mode"
                >
                    <TextIcon size={20} />
                </button>

                <button
                    onClick={() => setShowFocusMask(!showFocusMask)}
                    className={`icon-btn ${showFocusMask ? 'active' : ''}`}
                    data-tooltip="Focus Mask"
                >
                    <FocusIcon size={20} />
                </button>

                <button
                    onClick={setColorMode}
                    className={`icon-btn ${colorMode !== 'jazz' ? 'active' : ''}`}
                    data-tooltip={getModeTooltip()}
                >
                    {getModeIcon()}
                </button>
            </div>

            <div className="divider" />

            <div className="control-group extra">
                <button
                    onClick={onToggleVoice}
                    className={`icon-btn voice-btn ${isListening ? 'active recording' : ''}`}
                    data-tooltip={isListening ? 'Stop Voice Control' : 'Start Voice Control'}
                >
                    <MicIcon size={24} />
                </button>

                <button
                    onClick={onHelp}
                    className="icon-btn"
                    data-tooltip="Shortcuts & Help"
                >
                    <HelpIcon size={20} />
                </button>
            </div>

            <style jsx>{`
        .control-bar {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          height: 76px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 24px;
          border-radius: var(--radius-xl);
          z-index: 9999;
          transition: transform 0.4s var(--ease-spring), opacity 0.3s ease, box-shadow 0.3s ease;
          width: auto;
          min-width: min(650px, 95vw);
          max-width: 95vw;
          justify-content: space-between;
          animation: slideUpCubic 0.6s var(--ease-spring) backwards 0.15s;
          
          /* Refined Liquid Glass Effect */
          background: var(--glass-bg-heavy);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          box-shadow: 
            var(--glass-shadow-heavy),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .control-bar:hover {
            transform: translateX(-50%) translateY(-4px);
            box-shadow: 
                var(--glass-shadow-heavy),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .divider {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom,
            transparent 0%,
            var(--glass-border-bright) 50%,
            transparent 100%);
          box-shadow: 0 0 4px rgba(0, 242, 255, 0.1);
        }

        /* Play Toggle - 3D Bubble Button (Refined) */
        .play-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s var(--ease-smooth);
          
          /* 3D Glass Bubble Effect */
          background: radial-gradient(130% 130% at 30% 20%, 
            rgba(255, 255, 255, 0.4) 0%, 
            rgba(255, 255, 255, 0.06) 50%, 
            rgba(255, 255, 255, 0) 100%);
          box-shadow: 
            inset -4px -4px 12px rgba(255, 255, 255, 0.08),
            inset 4px 4px 12px rgba(255, 255, 255, 0.5),
            0 8px 24px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: white;
        }
        
        :global(.play-icon-offset) {
            margin-left: 3px;
        }

        .play-toggle:hover {
            transform: scale(1.06);
            box-shadow: 
                inset -4px -4px 12px rgba(255, 255, 255, 0.1),
                inset 4px 4px 12px rgba(255, 255, 255, 0.6),
                0 12px 32px rgba(0, 0, 0, 0.4);
        }
        
        .play-toggle:active {
            transform: scale(0.96);
            box-shadow: 
                inset -3px -3px 10px rgba(255, 255, 255, 0.08),
                inset 3px 3px 10px rgba(255, 255, 255, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .play-toggle.active {
            background: var(--play-button-active-bg);
            color: white;
            box-shadow: var(--play-button-active-shadow);
        }

        /* Icon Buttons - Minimal Glass */
        .icon-btn {
            width: 46px;
            height: 46px;
            border-radius: var(--radius-md);
            border: none;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: var(--text-secondary);
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s var(--ease-smooth);
        }

        .icon-btn:hover {
            background: var(--button-hover-bg);
            color: var(--button-hover-color);
            transform: scale(1.06);
            box-shadow: var(--button-hover-shadow);
        }

        .icon-btn:active {
            transform: scale(0.96);
        }

        .icon-btn.active {
            background: var(--accent-button-bg);
            color: var(--accent-button-color);
            box-shadow: var(--accent-button-hover-shadow);
        }

        /* Voice Button - Special Bubble (Refined) */
        .voice-btn {
            width: 52px !important;
            height: 52px !important;
            border-radius: 50% !important;
            background: radial-gradient(130% 130% at 30% 20%, 
                rgba(255, 255, 255, 0.3) 0%, 
                rgba(255, 255, 255, 0.05) 50%, 
                rgba(255, 255, 255, 0) 100%) !important;
            border: none !important;
            box-shadow: 
                inset -3px -3px 10px rgba(255, 255, 255, 0.08),
                inset 3px 3px 10px rgba(255, 255, 255, 0.4),
                0 6px 20px rgba(0, 0, 0, 0.3) !important;
        }

        .voice-btn:hover {
            background: var(--voice-button-hover-bg) !important;
            box-shadow: var(--voice-button-hover-shadow) !important;
        }

        .voice-btn.active.recording {
            background: var(--voice-button-recording-bg) !important;
            color: white !important;
            animation: pulseGlowNeon 1.5s infinite;
            box-shadow: var(--voice-button-recording-shadow) !important;
        }

        /* Neon Glass Sliders */
        input[type=range] {
            -webkit-appearance: none;
            height: 5px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            outline: none;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(0, 242, 255, 0.6) 100%);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            box-shadow: 
                0 2px 10px rgba(0, 0, 0, 0.3),
                0 0 10px rgba(0, 242, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: transform 0.15s ease;
        }

        input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 
                0 3px 15px rgba(0, 0, 0, 0.4),
                0 0 15px rgba(0, 242, 255, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .slider-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .value-badge {
            font-size: 12px;
            font-weight: 700;
            color: var(--neon-cyan);
            min-width: 40px;
            text-align: right;
            font-family: var(--font-mono);
            text-shadow: 0 0 8px rgba(0, 242, 255, 0.4);
            padding: 2px 6px;
            background: rgba(0, 242, 255, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(0, 242, 255, 0.2);
        }
      `}</style>
        </div>
    );
};

export default ControlPanel;
