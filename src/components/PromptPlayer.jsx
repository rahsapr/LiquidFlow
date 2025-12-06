import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './PromptPlayer.css';

const PromptPlayer = forwardRef(({
    text,
    isPlaying,
    speed,
    fontSize,
    isMirrored,
    showFocusMask,
    onSpeedChange,
    onClick,
    onEnd,
    onDoubleTapLeft,
    onDoubleTapRight,
    isVoiceActive,
    voiceProgress
}, ref) => {
    const contentRef = useRef(null);
    const scrollY = useRef(0);
    const lastFrameTime = useRef(0);
    const requestRef = useRef();
    const speedRef = useRef(speed);
    const lastTapTime = useRef(0);
    const lastTapX = useRef(0);

    // Update styles dynamically based on props
    const containerStyles = {
        '--prompt-size': `${fontSize}px`,
        '--active-word-color': 'var(--text-primary)',
        '--next-word-color': 'var(--accent-primary)',
    };

    // Expose control methods
    useImperativeHandle(ref, () => ({
        skip: (pixels) => {
            scrollY.current = Math.max(0, scrollY.current + pixels);
            if (contentRef.current) {
                contentRef.current.style.transform = `translateY(-${scrollY.current}px)`;
            }
        },
        restart: () => {
            scrollY.current = 0;
            if (contentRef.current) {
                contentRef.current.style.transform = `translateY(0px)`;
            }
        },
        isAtEnd: () => {
            if (!contentRef.current) return false;
            const contentHeight = contentRef.current.scrollHeight;
            const viewportHeight = window.innerHeight;
            const maxScroll = contentHeight - (viewportHeight * 0.6);
            return scrollY.current >= maxScroll && maxScroll > 0;
        }
    }));

    useEffect(() => { speedRef.current = speed; }, [speed]);

    // Reset scroll when text changes
    useEffect(() => {
        scrollY.current = 0;
        if (contentRef.current) {
            contentRef.current.style.transform = `translateY(0px)`;
        }
    }, [text]);

    const animateRef = (time) => {
        if (lastFrameTime.current !== 0) {
            const delta = time - lastFrameTime.current;
            const currentSpeed = speedRef.current;
            const move = (currentSpeed * 0.05) * (delta / 10);

            if (currentSpeed !== 0) {
                scrollY.current += move;

                // Check if we've scrolled past the end of content
                if (contentRef.current) {
                    const contentHeight = contentRef.current.scrollHeight;
                    const viewportHeight = window.innerHeight;
                    // End when the last line reaches 60% of viewport (earlier detection)
                    const maxScroll = contentHeight - (viewportHeight * 0.6);

                    if (scrollY.current >= maxScroll && maxScroll > 0) {
                        // Script has ended - notify parent to pause
                        if (onEnd) {
                            onEnd();
                        }
                        return; // Stop the animation loop
                    }

                    contentRef.current.style.transform = `translateY(-${scrollY.current}px)`;
                }
            }
        }
        lastFrameTime.current = time;
        requestRef.current = requestAnimationFrame(animateRef);
    };

    // Animation Loop for NON-Voice Mode
    useEffect(() => {
        if (isPlaying && !isVoiceActive) {
            requestRef.current = requestAnimationFrame(animateRef);
        } else {
            cancelAnimationFrame(requestRef.current);
            lastFrameTime.current = 0;
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, isVoiceActive]);

    // Handle Voice Scrolling (Center Active Word)
    useEffect(() => {
        if (isVoiceActive && contentRef.current) {
            const activeEl = document.getElementById(`word-${voiceProgress}`);
            if (activeEl) {
                // Calculate position to center the word
                // offsetTop is relative to the content container
                const wordTop = activeEl.offsetTop;
                // We want this word to be in the middle of the viewport (50vh)
                // But viewport for text is effectively 60-80vh depending on layout. 
                // Let's assume standard center. 

                // If scrollY is 0, top of content is at top of screen.
                // If we translate -500, content moves up 500.
                // We want wordTop to be at screen center.
                // Screen Center = window.innerHeight / 2.
                // Target TranslateY = wordTop - (window.innerHeight / 2) + (wordHeight / 2)

                const viewportCenter = window.innerHeight / 2;
                const targetScroll = Math.max(0, wordTop - viewportCenter + (fontSize / 2));

                // Smooth interpolation could be done here, but CSS transition on transform might be easier regarding performance?
                // Actually JS lerp is better for sync. But for now direct set.
                // Let's add simple easing if distance is small, or direct jump?
                // Direct update for responsiveness.

                scrollY.current = targetScroll;
                contentRef.current.style.transform = `translateY(-${scrollY.current}px)`;
            }
        }
    }, [isVoiceActive, voiceProgress, fontSize]);

    // Prepare Word List (Memoize strictly if this gets heavy, but for text < 10k words it's fine)
    const safeText = text || "";
    const words = safeText.split(/(\s+)/); // Keep delimiters to preserve spacing
    // Actually split by space destroys formatting if we aren't careful.
    // We need to map visual words to indices.
    // Better strategy: Split by whitespace but keep newlines?
    // User wants "original text" preserved.
    // Let's use a simple mapping: 
    // We iterate the text, wrapping "words" in spans, keeping whitespace as text nodes or spans.

    let wordCount = 0;
    const renderContent = () => {
        return words.map((chunk, i) => {
            // Check if chunk is just whitespace
            if (chunk.match(/^\s+$/)) {
                return <span key={i} className="whitespace">{chunk}</span>;
            }

            // Check if chunk is purely punctuation (not a word for Voice Engine)
            const cleanChunk = chunk.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

            // If it has no word content (e.g. "-"), we render it but DON'T count it for the index
            if (!cleanChunk.trim()) {
                return <span key={i} className="punctuation">{chunk}</span>;
            }

            const currentIdx = wordCount++;
            const isActive = isVoiceActive && currentIdx === voiceProgress;
            const isNext = isVoiceActive && currentIdx === voiceProgress + 1;

            return (
                <span
                    key={i}
                    id={`word-${currentIdx}`}
                    className={`script-word ${isActive ? 'active-word' : ''} ${isNext ? 'next-word' : ''}`}
                >
                    {chunk}
                </span>
            );
        });
    };

    // Double-tap detection for mobile
    const handleTap = (e) => {
        const now = Date.now();
        const tapX = e.clientX || e.touches?.[0]?.clientX || 0;
        const timeSinceLastTap = now - lastTapTime.current;
        const distanceFromLastTap = Math.abs(tapX - lastTapX.current);
        
        // Double-tap detected (within 300ms and same general area)
        if (timeSinceLastTap < 300 && distanceFromLastTap < 50) {
            const containerWidth = e.currentTarget.offsetWidth;
            const isLeftHalf = tapX < containerWidth / 2;
            
            if (isLeftHalf && onDoubleTapLeft) {
                onDoubleTapLeft();
            } else if (!isLeftHalf && onDoubleTapRight) {
                onDoubleTapRight();
            }
            
            // Reset to prevent triple-tap
            lastTapTime.current = 0;
            lastTapX.current = 0;
        } else {
            // Single tap - call onClick
            if (onClick) onClick(e);
            lastTapTime.current = now;
            lastTapX.current = tapX;
        }
    };

    return (
        <div
            className={`prompt-container ${isMirrored ? 'mirrored-x' : ''}`}
            style={containerStyles}
            onClick={handleTap}
            onTouchEnd={handleTap}
        >
            <div className={`status-badge ${isPlaying ? 'live' : 'paused'}`}>
                {isPlaying ? '● LIVE' : '❙❙ PAUSED'}
            </div>

            {showFocusMask && <div className="focus-mask"></div>}
            <div className="prompt-cue"></div>

            <div
                className="prompt-content"
                ref={contentRef}
                style={{ transform: `translateY(0px)` }}
            >
                <div className="prompt-text">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
});

export default PromptPlayer;
