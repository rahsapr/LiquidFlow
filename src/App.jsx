import { useState, useEffect, useRef } from 'react';
import PromptPlayer from './components/PromptPlayer';
import ControlPanel from './components/ControlPanel';
import Editor from './components/Studio/Editor';
import Sidebar from './components/Sidebar/Sidebar';
import HelpModal from './components/Help/HelpModal';
import Onboarding from './components/Onboarding/Onboarding';
import VoiceOnboardingModal from './components/VoiceOnboardingModal';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import HomePage from './components/HomePage';
import { useScriptManager } from './hooks/useScriptManager';
import { useVoiceScroll } from './hooks/useVoiceScroll';
import { useStats } from './hooks/useStats';
import './components/Studio/StudioLayout.css';

function App() {
  /* State */
  const [isPlaying, setIsPlaying] = useState(false); // Controls scrolling only
  const [isPlayerMode, setIsPlayerMode] = useState(false); // Controls full screen layout
  const [colorMode, setColorMode] = useState('dark'); // 'dark', 'light', 'vibe'

  const [speed, setSpeed] = useState(20);
  const [fontSize, setFontSize] = useState(60);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [showFocusMask, setShowFocusMask] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [showVoiceModal, setShowVoiceModal] = useState(false); // [NEW]

  // ... (useStats)
  const { stats, recordSession } = useStats();

  // Check for first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  // Multi-Script Manager
  const {
    scripts,
    activeScript,
    activeScriptId,
    setActiveScriptId,
    updateScript,
    updateTitle,
    createScript,
    deleteScript,
    folders,
    addFolder,
    removeFolder,
    moveScript,
    importScripts,
    deleteScripts
  } = useScriptManager();

  /* Voice Control */
  const {
    isListening,
    setIsListening,
    matchedIndex
  } = useVoiceScroll(activeScript.content);

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      const hasSeenVoiceConfig = localStorage.getItem('hasSeenVoiceConfig');
      if (!hasSeenVoiceConfig) {
        setShowVoiceModal(true);
      } else {
        setIsListening(true);
        setIsPlaying(false); // Valid conflict resolution: Pause auto-scroll
      }
    }
  };

  const confirmVoiceMode = () => {
    localStorage.setItem('hasSeenVoiceConfig', 'true');
    setShowVoiceModal(false);
    setIsListening(true);
    setIsPlaying(false);
  };

  const actualPlayerRef = useRef(null);
  const sessionStartTime = useRef(null);

  // Track playback time
  useEffect(() => {
    if (isPlaying) {
      sessionStartTime.current = Date.now();
    } else {
      if (sessionStartTime.current) {
        const duration = (Date.now() - sessionStartTime.current) / 1000;
        const estimatedWpm = speed * 2;
        recordSession(duration, estimatedWpm);
        sessionStartTime.current = null;
      }
    }
  }, [isPlaying]);

  // Smart Voice Stop on Global Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isListening) {
        setIsListening(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isListening]);

  // Conflict Resolution: If Auto-Play starts, stop Voice Listening
  useEffect(() => {
    if (isPlaying && isListening) {
      setIsListening(false);
    }
  }, [isPlaying]);

  /* Keyboard Controls */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      // Ignore if onboarding is active
      if (showOnboarding) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          // Check if at end and restart if needed
          if (isPlayerMode && !isPlaying && actualPlayerRef.current?.isAtEnd()) {
            actualPlayerRef.current.restart();
            setIsPlaying(true);
          } else if (isPlayerMode) {
            setIsPlaying(prev => !prev);
          } else {
            if (!isPlayerMode) {
              setIsPlayerMode(true);
              setIsPlaying(true);
            } else {
              setIsPlaying(prev => !prev);
            }
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSpeed(prev => Math.min(prev + 5, 100));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSpeed(prev => Math.max(prev - 5, 0));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (actualPlayerRef.current) actualPlayerRef.current.skip(-300);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (actualPlayerRef.current) actualPlayerRef.current.skip(300);
          break;
        case 'Escape':
          e.preventDefault();
          setIsPlayerMode(false);
          setIsPlaying(false);
          if (isListening) setIsListening(false);
          break;
        case 'Slash':
          if (e.shiftKey) { // ? key
            e.preventDefault();
            setShowHelp(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOnboarding, isPlayerMode]);

  const cycleColorMode = () => {
    const modes = ['dark', 'light', 'vibe'];
    const currentIndex = modes.indexOf(colorMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setColorMode(modes[nextIndex]);
  };

  // Apply theme to body element
  useEffect(() => {
    document.body.className = '';
    if (colorMode === 'light') {
      document.body.classList.add('light-mode');
    } else if (colorMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (colorMode === 'vibe') {
      document.body.classList.add('vibe-mode');
    }
  }, [colorMode]);

  return (
    <div className={`studio-container ${isPlayerMode ? 'playing' : ''} ${activeScriptId ? 'has-script' : ''} ${isDyslexic ? 'dyslexic-mode' : ''} ${colorMode === 'light' ? 'light-mode' : colorMode === 'dark' ? 'dark-mode' : colorMode === 'vibe' ? 'vibe-mode' : ''}`}>

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showVoiceModal && (
        <VoiceOnboardingModal
          onConfirm={confirmVoiceMode}
          onCancel={() => setShowVoiceModal(false)}
        />
      )}

      {showAnalytics && (
        <AnalyticsDashboard
          scripts={scripts}
          stats={stats}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        scripts={scripts}
        activeId={activeScriptId}
        onSelect={setActiveScriptId}
        onCreate={createScript}
        onDelete={deleteScript}
        folders={folders}
        onAddFolder={addFolder}
        onRemoveFolder={removeFolder}
        onMoveScript={moveScript}
        onToggleTheme={cycleColorMode}
        colorMode={colorMode}
        onImportUrl={async () => {
          const url = prompt("Enter website URL to fetch text from:");
          if (!url) return;

          try {
            // Use allorigins.win as a free CORS proxy
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.contents) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(data.contents, "text/html");

              // Extract text from paragraphs to avoid navigation/footer noise
              const paragraphs = Array.from(doc.querySelectorAll('p, h1, h2, h3'))
                .map(p => p.innerText)
                .join('\n\n');

              // Extract title
              const pageTitle = doc.querySelector('title')?.innerText || "Imported Url";

              createScript({
                title: pageTitle,
                content: paragraphs || "No clear text found on page."
              });
            }
          } catch (err) {
            console.error(err);
            alert("Failed to fetch URL. Note: Some sites block access.");
          }
        }}
        onImportScripts={importScripts}
        onDeleteScripts={deleteScripts}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />

      {/* Center Content: Editor or Home Page */}
      <div className="editor-pane">
        {activeScriptId ? (
          <Editor
            text={activeScript.content}
            onChange={updateScript}
            title={activeScript.title}
            onTitleChange={(newTitle) => updateTitle(activeScript.id, newTitle)}
            onTogglePlay={() => {
              setIsPlayerMode(true);
              setIsPlaying(true);
            }}
            onToggleTheme={cycleColorMode}
            colorMode={colorMode}
            onDictationStart={() => setIsListening(false)}
            onBack={() => setActiveScriptId(null)}
          />
        ) : (
          <HomePage 
            onCreateScript={createScript}
            onOpenAnalytics={() => setShowAnalytics(true)}
            onShowHelp={() => setShowHelp(true)}
          />
        )}
      </div>

      {/* Right Stage: Player (Hidden until playing) */}
      <div className="stage-area">
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <PromptPlayer
            text={activeScript.content}
            isPlaying={isPlaying}
            speed={speed}
            fontSize={fontSize}
            isMirrored={isMirrored}
            showFocusMask={showFocusMask}
            onClick={() => {
              // Clicking on player ensures we are in player mode and toggles playback
              if (!isPlayerMode) setIsPlayerMode(true);
              // If at end, restart; otherwise toggle
              if (!isPlaying && actualPlayerRef.current?.isAtEnd()) {
                actualPlayerRef.current.restart();
                setIsPlaying(true);
              } else {
                setIsPlaying(prev => !prev);
              }
            }}
            onEnd={() => {
              // Auto-pause when script ends
              setIsPlaying(false);
            }}
            onDoubleTapLeft={() => {
              if (actualPlayerRef.current) actualPlayerRef.current.skip(-300);
            }}
            onDoubleTapRight={() => {
              if (actualPlayerRef.current) actualPlayerRef.current.skip(300);
            }}
            isVoiceActive={isListening}
            voiceProgress={matchedIndex}
            ref={actualPlayerRef}
          />

          {/* New Control Panel Overlay - Only visible in Player Mode */}
          {isPlayerMode && (
            <ControlPanel
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              speed={speed}
              setSpeed={setSpeed}
              fontSize={fontSize}
              setFontSize={setFontSize}
              isMirrored={isMirrored}
              setIsMirrored={setIsMirrored}
              isDyslexic={isDyslexic}
              setIsDyslexic={setIsDyslexic}
              colorMode={colorMode}
              setColorMode={cycleColorMode}
              showFocusMask={showFocusMask}
              setShowFocusMask={setShowFocusMask}
              isListening={isListening}
              onToggleVoice={handleVoiceToggle} // [CHANGED]
              onHelp={() => setShowHelp(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
