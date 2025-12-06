import { useState, useEffect } from 'react';

const STATS_KEY = 'teleprompter_stats';

const INITIAL_STATS = {
    totalSessions: 0,
    totalSeconds: 0,
    wpmSum: 0, // Used to calculate avg
    folderCounts: {}
};

export const useStats = () => {
    const [stats, setStats] = useState(INITIAL_STATS);

    useEffect(() => {
        const saved = localStorage.getItem(STATS_KEY);
        if (saved) {
            try {
                setStats(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load stats", e);
            }
        }
    }, []);

    const saveStats = (newStats) => {
        setStats(newStats);
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    };

    const recordSession = (durationSeconds, wpm) => {
        if (durationSeconds < 5) return; // Ignore short tests

        setStats(prev => {
            const newStats = {
                ...prev,
                totalSessions: prev.totalSessions + 1,
                totalSeconds: prev.totalSeconds + durationSeconds,
                wpmSum: prev.wpmSum + wpm,
            };
            saveStats(newStats);
            return newStats;
        });
    };

    return {
        stats,
        recordSession
    };
};
