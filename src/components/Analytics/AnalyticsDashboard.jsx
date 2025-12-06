import React from 'react';
import './Analytics.css';

const StatCard = ({ label, value, subtext }) => (
    <div className="stat-card glass">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
);

const AnalyticsDashboard = ({ scripts, stats, onClose }) => {
    // Calculate total words
    const totalWords = scripts.reduce((acc, script) => {
        return acc + (script.content ? script.content.trim().split(/\s+/).length : 0);
    }, 0);

    const avgWpm = stats.totalSessions > 0
        ? Math.round(stats.wpmSum / stats.totalSessions)
        : 0;

    const totalTimeHours = (stats.totalSeconds / 3600).toFixed(1);

    return (
        <div className="analytics-overlay">
            <div className="analytics-container glass">
                <div className="analytics-header">
                    <h2>Your Studio Stats</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="stats-grid">
                    <StatCard
                        label="Total Scripts"
                        value={scripts.length}
                        subtext="Keep writing!"
                    />
                    <StatCard
                        label="Words Written"
                        value={totalWords.toLocaleString()}
                        subtext="That's a lot of speeches"
                    />
                    <StatCard
                        label="Avg. Speaking Pace"
                        value={`${avgWpm} WPM`}
                        subtext="Based on your playback history"
                    />
                    <StatCard
                        label="Practice Time"
                        value={`${totalTimeHours} hrs`}
                        subtext="Total time in playback"
                    />
                </div>

                <div className="chart-placeholder glass">
                    <h3>Activity Heatmap</h3>
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
                        (Visual chart of practice sessions over last 7 days would go here)
                        <br />
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '10px' }}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} style={{
                                    width: '12px',
                                    height: '12px',
                                    background: Math.random() > 0.7 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    borderRadius: '2px'
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
