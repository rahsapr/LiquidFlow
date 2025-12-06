import React from 'react';

export const ScriptItem = ({ script, activeId, onSelect, onDelete, isSelectionMode, isSelected, onToggleSelect }) => {
    return (
        <li
            className={`script-item ${script.id === activeId ? 'active' : ''}`}
            onClick={() => {
                if (isSelectionMode) {
                    onToggleSelect(script.id);
                } else {
                    onSelect(script.id);
                }
            }}
            draggable={!isSelectionMode}
            onDragStart={(e) => {
                e.dataTransfer.setData("scriptId", script.id);
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                {isSelectionMode && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(script.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: 'pointer' }}
                    />
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className="script-title">{script.title || 'Untitled'}</div>
                    <div className="script-date">{new Date(script.lastModified).toLocaleDateString()}</div>
                </div>
            </div>

            {!isSelectionMode && (
                <div className="script-actions">
                    <button
                        className="action-btn export-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            const blob = new Blob([JSON.stringify(script, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${script.title || 'script'}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        title="Export JSON"
                    >
                        ⭳
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete script?')) onDelete(script.id);
                        }}
                    >
                        🗑
                    </button>
                </div>
            )}
        </li>
    );
};
