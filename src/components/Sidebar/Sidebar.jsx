import React from 'react';
import './Sidebar.css';
import { ScriptItem } from './ScriptItem';
import JSZip from 'jszip';
import {
    CheckIcon, PlusIcon, SearchIcon, FolderIcon, TrashIcon, SunIcon, MoonIcon, GridIcon, DownloadIcon
} from '../Icons';

const Sidebar = ({
    scripts, folders, activeId,
    onSelect, onCreate, onDelete,
    onAddFolder, onRemoveFolder, onMoveScript,
    onToggleTheme, colorMode, onImportUrl,
    onImportScripts,
    onDeleteScripts,
    onOpenAnalytics
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
    const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
    const [newFolderName, setNewFolderName] = React.useState('');

    // NEW STATE
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [expandedFolders, setExpandedFolders] = React.useState({});

    // Toggle Selection
    const toggleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const selectAll = () => {
        if (selectedIds.size === scripts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(scripts.map(s => s.id)));
        }
    };

    // Filter Logic
    const filteredScripts = scripts.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.content && s.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Bulk Handlers
    const handleBulkDelete = () => {
        if (window.confirm(`Delete ${selectedIds.size} scripts?`)) {
            onDeleteScripts(Array.from(selectedIds));
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        }
    };

    const handleBulkExport = async () => {
        const zip = new JSZip();
        const selectedScripts = scripts.filter(s => selectedIds.has(s.id));

        selectedScripts.forEach(script => {
            const filename = `${script.title.replace(/\\W/g, '_')}.txt`;
            zip.file(filename, script.content || '');
        });

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "teleprompter_export.zip";
        a.click();
        URL.revokeObjectURL(url);

        setIsSelectionMode(false);
        setSelectedIds(new Set());
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            onAddFolder(newFolderName.trim());
        }
        setIsCreatingFolder(false);
        setNewFolderName('');
    };

    // Render Helper
    const renderScriptList = (list) => (
        <ul className="script-list" style={{ paddingLeft: '1rem', marginTop: '4px' }}>
            {list.map(script => (
                <ScriptItem
                    key={script.id}
                    script={script}
                    activeId={activeId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedIds.has(script.id)}
                    onToggleSelect={toggleSelect}
                />
            ))}
        </ul>
    );

    return (
        <div className="sidebar glass">
            <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        className="btn-icon home-btn"
                        onClick={() => onSelect(null)}
                        data-tooltip="Home"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </button>
                    <span className="sidebar-title">Library</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className={`btn-icon ${isSelectionMode ? 'active' : ''}`}
                            onClick={() => {
                                setIsSelectionMode(!isSelectionMode);
                                setSelectedIds(new Set());
                            }}
                            data-tooltip="Select Multiple"
                        >
                            <CheckIcon size={18} />
                        </button>
                        <button
                            className="btn-icon"
                            onClick={() => onCreate()}
                            data-tooltip="New Script"
                        >
                            <PlusIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-wrapper" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search scripts..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                    />
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }}>
                        <SearchIcon size={16} />
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar (Overlay) */}
            {isSelectionMode && (
                <div className="bulk-actions" style={{
                    padding: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    margin: '0 8px'
                }}>
                    <span>{selectedIds.size} selected</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={selectAll} className="text-btn">ALL</button>
                        <button onClick={handleBulkExport} className="icon-action-btn"><DownloadIcon size={16} /></button>
                        <button onClick={handleBulkDelete} className="icon-action-btn danger">
                            <TrashIcon size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="folders-list" style={{ padding: '0.5rem', flex: 1, overflowY: 'auto' }}>
                {/* Drag Drop Import Zone */}
                <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={async (e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            if (onImportScripts) await onImportScripts(e.dataTransfer.files);
                        }
                        const scriptId = e.dataTransfer.getData("scriptId");
                        if (scriptId) onMoveScript(scriptId, null);
                    }}
                    style={{ minHeight: '100%' }}
                >

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
                            <span className="section-label">FOLDERS</span>
                            <button
                                className="btn-icon small"
                                onClick={() => setIsCreatingFolder(true)}
                            >
                                <PlusIcon size={14} />
                            </button>
                        </div>

                        {/* Inline Input for New Folder */}
                        {isCreatingFolder && (
                            <div style={{ padding: '0 10px', marginBottom: '8px' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onBlur={handleCreateFolder}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCreateFolder();
                                        if (e.key === 'Escape') setIsCreatingFolder(false);
                                    }}
                                    placeholder="Folder Name"
                                    className="folder-input"
                                />
                            </div>
                        )}

                        {/* Folders Loop */}
                        {folders?.map(folder => {
                            const folderScripts = filteredScripts.filter(s => s.folderId === folder.id);
                            if (searchQuery && folderScripts.length === 0) return null;

                            const isExpanded = expandedFolders[folder.id] !== false;

                            return (
                                <div
                                    key={folder.id}
                                    style={{ marginBottom: '0.5rem' }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const scriptId = e.dataTransfer.getData("scriptId");
                                        if (scriptId) onMoveScript(scriptId, folder.id);
                                    }}
                                >
                                    <div className="folder-header"
                                        onClick={() => setExpandedFolders(prev => ({ ...prev, [folder.id]: !isExpanded }))}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                            <span style={{ fontSize: '10px', color: '#999', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
                                            <FolderIcon size={16} className="folder-icon" />
                                            <span className="folder-name">
                                                {folder.name}
                                            </span>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`Delete folder "${folder.name}"?`)) onRemoveFolder(folder.id);
                                            }}
                                        >
                                            <TrashIcon size={14} />
                                        </button>
                                    </div>
                                    {isExpanded && renderScriptList(folderScripts)}
                                </div>
                            )
                        })}
                    </div>

                    {/* Uncategorized Scripts */}
                    <div>
                        <div className="section-label" style={{ padding: '0 0.5rem' }}>UNCATEGORIZED</div>
                        {renderScriptList(filteredScripts.filter(s => !s.folderId))}
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <button
                    onClick={onToggleTheme}
                    className="sidebar-footer-btn"
                    data-tooltip={getModeTooltip()}
                >
                    {getModeIcon()}
                </button>

                <button
                    onClick={onImportUrl}
                    className="sidebar-footer-btn"
                    data-tooltip="Fetch text from website URL"
                >
                    <DownloadIcon size={20} />
                </button>

                <button
                    onClick={onOpenAnalytics}
                    className="sidebar-footer-btn accent"
                    data-tooltip="View Stats"
                >
                    <GridIcon size={20} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
