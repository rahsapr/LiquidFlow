import { useState, useEffect } from 'react';

const STORAGE_KEY = 'teleprompter_data';

const generateId = () => Math.random().toString(36).substr(2, 9);

const STARLIGHT_SCRIPT = {
    id: 'starlight',
    title: 'Starlight Scripts: Dawn of the AI Age',
    content: `A long time from now, in a corner of the digital galaxy, a quiet line of code awakened. Whispers spread across servers and cities: the age of artificial intelligence had begun. Old systems, built on rigid rules and fragile scripts, felt the ground shift beneath their logic.

New models emerged, not just calculating, but learning, adapting, and speaking in human tones. Datasets became starfields, and every prompt was a small ship launched into the unknown. Some feared the rising glow of these machines, while others saw a new kind of companion in the code.

Yet amid the excitement and doubt, one truth echoed through fiber and airwaves alike: this future would not be written by algorithms alone, but by the choices of the humans who shaped them. Together, they stood at the edge of a vast, uncharted frontier—where intelligence, both human and artificial, would decide what kind of galaxy to build next.`,
    lastModified: Date.now(),
};

const INITIAL_SCRIPT = {
    id: 'default',
    title: 'Welcome to LiquidFlow',
    content: `Welcome to LiquidFlow, your professional teleprompter designed for presentations, workshops, and live sessions.

GETTING STARTED

Click the play button or press Space to start scrolling. The text moves smoothly at your chosen speed. Press Space again to pause at any time. When you reach the end of your script, pressing play will automatically restart from the beginning.

PLAYBACK CONTROLS

Use the speed slider in the control panel to adjust scrolling speed from 0 to 100. You can also press the up and down arrow keys to change speed in real time while presenting. Press the left and right arrow keys to skip backward or forward through your script. On mobile devices, double tap the left half of the screen to skip backward, or double tap the right half to skip forward.

KEYBOARD SHORTCUTS

Space: Play or pause scrolling
Up Arrow: Increase speed
Down Arrow: Decrease speed
Left Arrow: Skip backward
Right Arrow: Skip forward
Escape: Exit fullscreen player mode
Question Mark: Show help and shortcuts

VOICE FEATURES (EXPERIMENTAL)

This app includes two experimental voice features that require microphone access and work best in Chrome or Edge browsers.

Voice Typing: Click the microphone button in the editor to dictate your script hands-free. Speak naturally and the app will transcribe your words into text. This feature may have accuracy limitations and requires a stable internet connection.

Voice Follow Mode: Click the microphone button in the control panel during playback. The teleprompter will highlight each word as you speak it, keeping perfect sync with your presentation. This feature is experimental and may not work reliably in all environments. It requires continuous microphone access and performs best in quiet settings.

Note: Voice features are not available in Safari or Firefox. If you experience issues, try using Chrome or Edge instead.

SCRIPT MANAGEMENT

Click the plus button in the sidebar to create a new script. You can organize scripts into folders by clicking the folder icon. Use the search bar to find scripts quickly across all your content. Import text files by dragging them directly into the editor. Export scripts by selecting them and using the download option.

CUSTOMIZATION OPTIONS

Toggle between three color modes using the theme button in the sidebar. Dark mode provides a professional appearance suitable for any setting. Light mode offers a clean, minimal aesthetic. Vibe mode features green and orange accents for a more energetic feel.

Enable dyslexic-friendly font using the text icon for improved readability. Mirror text horizontally for beam-splitter teleprompter setups. Activate the focus mask to add a gradient overlay that highlights your current reading line.

MOBILE USAGE

On mobile devices, the interface adapts to a linear flow. The sidebar shows your script library. Tap any script to open the editor. Tap play to enter fullscreen teleprompter mode. Use the back button to return to the previous view.

PRIVACY AND STORAGE

All your scripts are stored locally in your browser using localStorage. Nothing is sent to any server. Your content remains completely private on your device. Scripts do not sync across devices, even if you use the same browser account. This is a design limitation that ensures your data never leaves your device.

If you clear your browser data or use private browsing mode, your scripts will be lost. Consider exporting important scripts as backup files.

READY TO PRESENT

When you are ready to present, click play and the interface enters fullscreen mode. Only the scrolling text and minimal controls remain visible, giving you a distraction-free presentation experience. The text will automatically pause when it reaches the end of your script.

This teleprompter is designed for reliability during important presentations and live sessions. All changes save automatically as you type.`,
    lastModified: Date.now(),
};

export const useScriptManager = () => {
    const [scripts, setScripts] = useState([]);
    const [folders, setFolders] = useState([]);
    const [activeScriptId, setActiveScriptId] = useState(null);

    // Load from Storage on Mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Handle both legacy and new format
                if (parsed.scripts) {
                    setScripts(parsed.scripts);
                    setActiveScriptId(null); // Always start at home
                    if (parsed.folders) setFolders(parsed.folders);
                } else {
                    // Assume very old legacy or migrate
                    setScripts([INITIAL_SCRIPT, STARLIGHT_SCRIPT]);
                    setActiveScriptId(null);
                }
            } catch (e) {
                console.error("Failed to load scripts", e);
                setScripts([INITIAL_SCRIPT, STARLIGHT_SCRIPT]);
                setActiveScriptId(null);
            }
        } else {
            // Check for legacy single script
            const legacyScript = localStorage.getItem('teleprompter_script');
            if (legacyScript) {
                const migratedScript = { ...INITIAL_SCRIPT, content: legacyScript };
                setScripts([migratedScript, STARLIGHT_SCRIPT]);
                setActiveScriptId(null); // Start with home page
            } else {
                setScripts([INITIAL_SCRIPT, STARLIGHT_SCRIPT]);
                setActiveScriptId(null); // Start with home page
            }
        }
    }, []);

    // Save to Storage whenever changes occur
    useEffect(() => {
        if (scripts.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                scripts,
                folders,
                activeId: activeScriptId
            }));
        }
    }, [scripts, folders, activeScriptId]);

    const activeScript = scripts.find(s => s.id === activeScriptId) || { id: null, title: '', content: '', lastModified: Date.now() };

    const updateScript = (content) => {
        setScripts(prev => prev.map(script =>
            script.id === activeScriptId
                ? { ...script, content, lastModified: Date.now() }
                : script
        ));
    };

    const updateTitle = (id, title) => {
        setScripts(prev => prev.map(script =>
            script.id === id
                ? { ...script, title, lastModified: Date.now() }
                : script
        ));
    };

    const createScript = (initialData = {}) => {
        const newScript = {
            id: generateId(),
            title: initialData.title || 'New Script',
            content: initialData.content !== undefined ? initialData.content : '',
            folderId: initialData.folderId || null,
            lastModified: Date.now(),
        };
        setScripts(prev => [...prev, newScript]);
        setActiveScriptId(newScript.id);
    };

    const deleteScript = (id) => {
        if (scripts.length <= 1) {
            alert("Cannot delete the last script.");
            return;
        }
        const newScripts = scripts.filter(s => s.id !== id);
        setScripts(newScripts);
        if (activeScriptId === id) {
            setActiveScriptId(newScripts[0].id);
        }
    };

    const addFolder = (name) => {
        const newFolder = { id: generateId(), name };
        setFolders(prev => [...prev, newFolder]);
    };

    const removeFolder = (id) => {
        // Move scripts in this folder back to root (null)
        setScripts(prev => prev.map(s => s.folderId === id ? { ...s, folderId: null } : s));
        setFolders(prev => prev.filter(f => f.id !== id));
    };

    const moveScript = (scriptId, folderId) => {
        setScripts(prev => prev.map(s => s.id === scriptId ? { ...s, folderId } : s));
    };

    /* Bulk Operations */
    const importScripts = async (files) => {
        const newScripts = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const text = await file.text();
            // Basic title extraction from filename or first line
            let title = file.name.replace(/\.(txt|md)$/i, '');
            newScripts.push({
                id: generateId(),
                title,
                content: text,
                folderId: null,
                lastModified: Date.now()
            });
        }
        setScripts(prev => [...prev, ...newScripts]);
    };

    const deleteScripts = (ids) => {
        if (!ids || ids.length === 0) return;

        // Prevent deleting the *only* script if we are deleting everything
        if (scripts.length === ids.length) {
            // Maybe create a fresh default one? 
            // For now, let's just create a new default if all are gone
            setScripts([INITIAL_SCRIPT, STARLIGHT_SCRIPT]);
            setActiveScriptId(null); // Show home page
            return;
        }

        const newScripts = scripts.filter(s => !ids.includes(s.id));
        setScripts(newScripts);

        // If active script was deleted, switch to the first available
        if (ids.includes(activeScriptId)) {
            setActiveScriptId(newScripts[0]?.id || INITIAL_SCRIPT.id);
        }
    };

    // Check if JSZip is available (it should be imported in component likely, but we can pass it in or import here if environment allows. 
    // Since this is a hook, dynamic import or passing dependency is better if we want to keep it pure, but for this app direct import is fine if we updated top of file.)
    // Actually, we can just return the data prepared for zip and let the UI handle the zipping to keep hook clean? 
    // Or we can just import JSZip at the top. User approved dependency.

    return {
        scripts,
        folders,
        activeScript,
        activeScriptId,
        setActiveScriptId,
        updateScript,
        updateTitle,
        createScript,
        deleteScript,
        addFolder,
        removeFolder,
        moveScript,
        // Bulk
        importScripts,
        deleteScripts
    };
};
