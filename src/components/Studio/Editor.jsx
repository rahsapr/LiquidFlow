import { useState, useRef, useEffect, useCallback } from 'react';
import { PlayIcon, MicIcon, DownloadIcon } from '../Icons';
import './Editor.css';

const Editor = ({ text, onChange, title, onTitleChange, onTogglePlay, onDictationStart, onBack }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    onChange(event.target.result);
                };
                reader.readAsText(file);
            } else {
                alert('Please drop a text file (.txt or .md)');
            }
        }
    };

    /* Voice Dictation Logic */
    const [isDictating, setIsDictating] = useState(false);
    const recognitionRef = useRef(null);
    const isDictatingRef = useRef(false); // Track intent
    const restartTimeoutRef = useRef(null);
    const textRef = useRef(text); // Keep text up to date for callbacks

    // Keep textRef synced
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    // Factory function to create fresh recognition instances
    const createDictation = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            console.log("[Dictation] onresult fired, results:", event.results.length);
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                console.log(`[Dictation] Result ${i}: isFinal=${event.results[i].isFinal}, transcript="${event.results[i][0].transcript}"`);
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                }
            }
            if (finalTranscript) {
                console.log("[Dictation] Appending final transcript:", finalTranscript);
                onChange(textRef.current + finalTranscript); // Append text
            }
        };

        recognition.onerror = (event) => {
            console.error("[Dictation] Error:", event.error, event);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                isDictatingRef.current = false;
                setIsDictating(false);
            }
            // For 'no-speech', 'aborted', or 'network', let onend handle it
        };

        recognition.onend = () => {
            // Clear current reference since this instance is done
            recognitionRef.current = null;

            // If unintended stop (intent is still true), create a fresh instance
            if (isDictatingRef.current) {
                console.log("Dictation stopped unexpectedly. Creating fresh instance...");

                // Clear any pending restart
                if (restartTimeoutRef.current) {
                    clearTimeout(restartTimeoutRef.current);
                }

                // Small delay to prevent rapid cycling
                restartTimeoutRef.current = setTimeout(() => {
                    if (!isDictatingRef.current) return; // Check again after delay

                    const newRecognition = createDictation();
                    if (newRecognition) {
                        recognitionRef.current = newRecognition;
                        try {
                            newRecognition.start();
                        } catch (e) {
                            console.error("Failed to restart dictation:", e);
                            setIsDictating(false);
                        }
                    } else {
                        setIsDictating(false);
                    }
                }, 300); // 300ms delay prevents rapid on/off cycling
            }
        };

        recognition.onaudiostart = () => console.log("[Dictation] Audio capture started");
        recognition.onsoundstart = () => console.log("[Dictation] Sound detected");
        recognition.onspeechstart = () => console.log("[Dictation] Speech detected");
        recognition.onspeechend = () => console.log("[Dictation] Speech ended");

        return recognition;
    }, [onChange]);

    const toggleDictation = () => {
        if (isDictating) {
            // Manual Stop
            isDictatingRef.current = false;
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort(); // Use abort() for immediate stop
                } catch (e) {
                    // Ignore
                }
            }
            setIsDictating(false);
            return;
        }

        // Force kill global voice
        if (onDictationStart) onDictationStart();

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice dictation is not supported in this browser.");
            return;
        }

        const recognition = createDictation();
        if (!recognition) {
            alert("Voice dictation is not supported in this browser.");
            return;
        }

        recognitionRef.current = recognition;
        isDictatingRef.current = true; // Set intent
        console.log("[Dictation] About to call recognition.start()");
        try {
            recognition.start();
            console.log("[Dictation] recognition.start() called successfully");
            setIsDictating(true);
        } catch (e) {
            console.error("[Dictation] Failed to start dictation", e);
            setIsDictating(false);
            isDictatingRef.current = false;
        }
    };

    /* Smart Stop Logic */
    const handleKeyDown = (e) => {
        // Auto-stop dictation if user starts typing manually
        if (isDictating) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsDictating(false);
        }
    };

    const handlePlayClick = () => {
        if (isDictating) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsDictating(false);
        }
        onTogglePlay();
    };

    /* Download Handler */
    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${title || 'teleprompter_script'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div
            className={`editor-pane glass ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="editor-header">
                <button 
                    className="back-btn mobile-only"
                    onClick={onBack}
                    data-tooltip="Back to Library"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <input
                    className="title-input"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Script Title"
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        onClick={handlePlayClick}
                        className="action-btn play-btn icon-btn"
                        data-tooltip="Start Teleprompter (Space)"
                    >
                        <PlayIcon size={20} /> <span className="btn-label">PLAY</span>
                    </button>

                    <button
                        onClick={toggleDictation}
                        className={`action-btn dictation-btn icon-btn ${isDictating ? 'recording' : ''}`}
                        data-tooltip={isDictating ? "Stop Dictation" : "Voice Typing"}
                    >
                        <MicIcon size={20} />
                    </button>

                    <button
                        onClick={handleDownload}
                        className="action-btn download-btn icon-btn"
                        data-tooltip="Save Script to File"
                    >
                        <DownloadIcon size={20} />
                    </button>
                </div>
            </div>
            <textarea
                className="script-input"
                value={text}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your script here... Or drag and drop a .txt file."
                spellCheck={false}
            />
        </div>
    );
};

export default Editor;
