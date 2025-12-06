import { useState, useEffect, useRef, useCallback } from 'react';

export const useVoiceScroll = (scriptContent) => {
    const [isListening, setIsListening] = useState(false);
    const [matchedIndex, setMatchedIndex] = useState(0);
    const recognitionRef = useRef(null);
    const restartTimeoutRef = useRef(null);

    const scriptRef = useRef(scriptContent);

    // Keep scriptRef up to date
    useEffect(() => {
        scriptRef.current = scriptContent;
    }, [scriptContent]);

    // Track intent with a ref to access it inside onend/onerror callbacks always fresh
    const isListeningRef = useRef(isListening);

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    // Function to create and start a new recognition instance
    const createRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            console.log("[VoiceScroll] onresult fired, results:", event.results.length);
            let fullTranscript = '';

            // Build the FULL transcript from the entire session buffer
            for (let i = 0; i < event.results.length; ++i) {
                fullTranscript += event.results[i][0].transcript;
            }

            console.log("[VoiceScroll] Full transcript:", fullTranscript);

            const normalize = (str) => str.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");

            const cleanScript = normalize(scriptRef.current);
            const cleanTranscript = normalize(fullTranscript.trim());
            const transcriptWords = cleanTranscript.split(" ");

            console.log("[VoiceScroll] Script length:", cleanScript.length, "Transcript words:", transcriptWords.length);

            // We need at least a few words to be confident
            if (transcriptWords.length < 2) return;

            // Search Strategy: Check the last few words spoken
            const lookback = 6;
            const searchPhrase = transcriptWords.slice(-lookback).join(" ");

            console.log("[VoiceScroll] Searching for phrase:", searchPhrase);

            const matchCharIndex = cleanScript.indexOf(searchPhrase);

            if (matchCharIndex !== -1) {
                const prefix = cleanScript.substring(0, matchCharIndex);
                const calculatedIndex = prefix.trim() === '' ? 0 : prefix.trim().split(/\s+/).length;
                const finalIndex = calculatedIndex + searchPhrase.split(" ").length - 1;
                console.log("[VoiceScroll] Match found! Word index:", finalIndex);
                setMatchedIndex(finalIndex);
            } else {
                console.log("[VoiceScroll] No match found for phrase");
            }
        };

        recognition.onerror = (event) => {
            console.error("[VoiceScroll] Error:", event.error, event);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setIsListening(false);
                isListeningRef.current = false;
            }
            // For 'no-speech', 'aborted', or 'network', let onend handle it
        };

        recognition.onaudiostart = () => console.log("[VoiceScroll] Audio capture started");
        recognition.onsoundstart = () => console.log("[VoiceScroll] Sound detected");
        recognition.onspeechstart = () => console.log("[VoiceScroll] Speech detected");
        recognition.onspeechend = () => console.log("[VoiceScroll] Speech ended");

        recognition.onend = () => {
            // Clear the current reference since this instance is done
            recognitionRef.current = null;

            // If unintended stop (intent is still true), create a fresh instance
            if (isListeningRef.current) {
                console.log("Voice stopped unexpectedly. Creating fresh instance...");

                // Clear any pending restart
                if (restartTimeoutRef.current) {
                    clearTimeout(restartTimeoutRef.current);
                }

                // Small delay to prevent rapid cycling
                restartTimeoutRef.current = setTimeout(() => {
                    if (!isListeningRef.current) return; // Check again after delay

                    const newRecognition = createRecognition();
                    if (newRecognition) {
                        recognitionRef.current = newRecognition;
                        try {
                            newRecognition.start();
                        } catch (e) {
                            console.error("Failed to restart voice:", e);
                            setIsListening(false);
                        }
                    } else {
                        setIsListening(false);
                    }
                }, 300); // 300ms delay prevents rapid on/off cycling
            }
        };

        return recognition;
    }, []);

    useEffect(() => {
        if (!isListening) {
            // Cleanup if we stopped listening
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
            if (recognitionRef.current) {
                isListeningRef.current = false;
                try {
                    recognitionRef.current.abort(); // Use abort() for immediate stop
                } catch (e) {
                    // Ignore errors during cleanup
                }
                recognitionRef.current = null;
            }
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            setIsListening(false);
            return;
        }

        const recognition = createRecognition();
        if (!recognition) {
            setIsListening(false);
            return;
        }

        recognitionRef.current = recognition;
        console.log("[VoiceScroll] About to call recognition.start()");
        try {
            recognition.start();
            console.log("[VoiceScroll] recognition.start() called successfully");
        } catch (e) {
            console.error("[VoiceScroll] Start failed:", e);
            setIsListening(false);
        }

        return () => {
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
            if (recognitionRef.current) {
                isListeningRef.current = false;
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    // Ignore
                }
                recognitionRef.current = null;
            }
        };
    }, [isListening, createRecognition]);

    return {
        isListening,
        setIsListening,
        matchedIndex
    };
};
