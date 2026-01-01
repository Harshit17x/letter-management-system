
import React, { useRef, useEffect, useState } from 'react';
import { Letter, Template, View, Variable } from '../types';
import { UploadCloudIcon, DownloadIcon, Share2Icon, SaveIcon, SparklesIcon, XIcon } from './icons/Icons';
import AiActionsMenu from './AiActionsMenu';

interface EditorProps {
    item: Letter | Template;
    onContentChange: (id: string, newContent: string) => void;
    onTitleChange: (id: string, newTitle: string) => void;
    onFileImport: (file: File) => void;
    onExport: (format: 'txt' | 'md') => void;
    onShare: (platform: 'whatsapp' | 'telegram') => void;
    view: View;
    onAction: (action: 'generate' | 'improve' | 'summarize', prompt: string, contentToImprove?: string) => void;
    onToggleScanner: () => void;
    onAnalyze: () => void;
    onComposeEmail: (prompt: string) => void;
    isLoading: boolean;
    error: string | null;
    variables: Variable[];
    aiDisabled: boolean;
}

const Editor: React.FC<EditorProps> = ({ 
    item, onContentChange, onTitleChange, onFileImport, onExport, onShare, view,
    onAction, onToggleScanner, onAnalyze, onComposeEmail, isLoading, error, variables, aiDisabled
}) => {
    const title = 'title' in item ? item.title : item.name;
    const [editorContent, setEditorContent] = useState(item.content);
    const [showExport, setShowExport] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [driveConnected, setDriveConnected] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onTitleChange(item.id, e.target.value);
    };

    const handleContentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if(e.target.value !== item.content) {
            onContentChange(item.id, e.target.value);
        }
    };
    
    useEffect(() => {
        setEditorContent(item.content);
    }, [item.content, item.id]);

    const handleInsertVariable = (variable: string) => {
        const textarea = document.getElementById(`editor-textarea-${item.id}`) as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, start) + ` ${variable} ` + text.substring(end);
            setEditorContent(newText);
            onContentChange(item.id, newText);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + variable.length + 2;
                textarea.focus();
            }, 0);
        }
    };

    useEffect(() => {
        const handleVariableInsert = (event: Event) => {
            const customEvent = event as CustomEvent;
            handleInsertVariable(customEvent.detail.variable);
        };

        document.addEventListener('insertVariable', handleVariableInsert);
        return () => {
            document.removeEventListener('insertVariable', handleVariableInsert);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.id, onContentChange]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileImport(file);
        }
    };
    
    const isLetter = 'lastModified' in item;

    return (
        <div className="flex flex-col h-full relative">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder={view === View.Letters ? 'Letter Title' : 'Template Name'}
                    className="w-full text-2xl font-bold bg-transparent focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                />
                {isLetter && (
                    <p className="text-sm text-slate-500 mt-1">
                        Last modified: {new Date(item.lastModified).toLocaleString()}
                    </p>
                )}
            </div>
            
             {/* -- Toolbar -- */}
            {isLetter && (
                <div className="p-2 border-b border-slate-200 dark:border-slate-700/50 flex items-center space-x-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600" title="Import text from image">
                        <UploadCloudIcon className="w-4 h-4 mr-2" /> Import File
                    </button>

                    <div className="relative">
                        <button onClick={() => setShowExport(!showExport)} onBlur={() => setTimeout(() => setShowExport(false), 200)} className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                            <DownloadIcon className="w-4 h-4 mr-2" /> Export
                        </button>
                        {showExport && (
                            <div className="absolute top-full mt-1 w-32 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-md shadow-lg z-10">
                                <a onClick={() => onExport('txt')} className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">as .txt</a>
                                <a onClick={() => onExport('md')} className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">as .md</a>
                            </div>
                        )}
                    </div>
                     <div className="relative">
                        <button onClick={() => setShowShare(!showShare)} onBlur={() => setTimeout(() => setShowShare(false), 200)} className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Share2Icon className="w-4 h-4 mr-2" /> Share
                        </button>
                        {showShare && (
                            <div className="absolute top-full mt-1 w-40 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-md shadow-lg z-10">
                                <a onClick={() => onShare('whatsapp')} className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">via WhatsApp</a>
                                <a onClick={() => onShare('telegram')} className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">via Telegram</a>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setDriveConnected(true)} 
                        disabled={driveConnected} 
                        className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Google Drive integration is a demo feature">
                        <SaveIcon className="w-4 h-4 mr-2" /> {driveConnected ? 'Drive Connected (Demo)' : 'Connect to Drive'}
                    </button>
                </div>
            )}

            <div className="flex-1 p-4 md:p-8 lg:p-12 prose prose-slate dark:prose-invert max-w-4xl mx-auto w-full">
                <textarea
                    id={`editor-textarea-${item.id}`}
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    onBlur={handleContentBlur}
                    placeholder="Start writing your letter..."
                    className="w-full h-full bg-transparent focus:outline-none resize-none text-base leading-relaxed"
                />
            </div>
            
            {!aiDisabled && (
                <>
                    <button
                        onClick={() => setIsAiMenuOpen(prev => !prev)}
                        disabled={isLoading}
                        className="absolute bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 flex items-center justify-center z-10 transition-transform hover:scale-105"
                        title="Open AI Assistant"
                        aria-expanded={isAiMenuOpen}
                    >
                        {isAiMenuOpen ? <XIcon className="w-7 h-7" /> : <SparklesIcon className="w-7 h-7" />}
                    </button>
                    {isAiMenuOpen && (
                        <AiActionsMenu
                            onAction={onAction}
                            onToggleScanner={() => {
                                onToggleScanner();
                                setIsAiMenuOpen(false);
                            }}
                            onAnalyze={() => {
                                onAnalyze();
                                setIsAiMenuOpen(false);
                            }}
                            onComposeEmail={(prompt) => {
                                onComposeEmail(prompt);
                                setIsAiMenuOpen(false);
                            }}
                            isLoading={isLoading}
                            error={error}
                            variables={variables}
                            onClose={() => setIsAiMenuOpen(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Editor;
