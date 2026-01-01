
import React, { useState, useCallback, useMemo } from 'react';
import { Letter, Template, View } from './types';
import { DEFAULT_LETTERS, DEFAULT_TEMPLATES, VARIABLE_TAGS } from './constants';
import Layout from './components/Layout';
import Editor from './components/Editor';
import { generateLetter, improveText, summarizeText, extractTextFromImage, extractTextFromFile, analyzeDocument, AnalysisResult, generateEmail, EmailComposition } from './services/geminiService';
import PhotoScanner from './components/PhotoScanner';
import DocAnalyzerModal from './components/DocAnalyzerModal';
import EmailComposerModal from './components/EmailComposerModal';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.Letters);
    const [letters, setLetters] = useState<Letter[]>(DEFAULT_LETTERS);
    const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
    const [selectedId, setSelectedId] = useState<string | null>('l1');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
    const [composedEmail, setComposedEmail] = useState<EmailComposition | null>(null);


    const handleSelect = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    const handleContentChange = useCallback((id: string, newContent: string) => {
        if (view === View.Letters) {
            setLetters(prev => prev.map(l => l.id === id ? { ...l, content: newContent, lastModified: new Date().toISOString() } : l));
        } else {
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, content: newContent } : t));
        }
    }, [view]);
    
    const handleTitleChange = useCallback((id: string, newTitle: string) => {
        if (view === View.Letters) {
            setLetters(prev => prev.map(l => l.id === id ? { ...l, title: newTitle, lastModified: new Date().toISOString() } : l));
        } else {
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, name: newTitle } : t));
        }
    }, [view]);

    const createNewLetter = (templateId?: string) => {
        const newLetter: Letter = {
            id: `l${Date.now()}`,
            title: 'Untitled Letter',
            content: templateId ? templates.find(t => t.id === templateId)?.content || '' : '',
            lastModified: new Date().toISOString(),
        };
        setLetters(prev => [newLetter, ...prev]);
        setView(View.Letters);
        setSelectedId(newLetter.id);
    };

    const createNewTemplate = () => {
        const newTemplate: Template = {
            id: `t${Date.now()}`,
            name: 'Untitled Template',
            content: '',
        };
        setTemplates(prev => [newTemplate, ...prev]);
        setView(View.Templates);
        setSelectedId(newTemplate.id);
    };

    const deleteItem = (id: string) => {
        if (view === View.Letters) {
            setLetters(prev => prev.filter(l => l.id !== id));
        } else {
            setTemplates(prev => prev.filter(t => t.id !== id));
        }
        setSelectedId(null);
    };

    const activeItem = useMemo(() => {
        if (!selectedId) return null;
        return view === View.Letters
            ? letters.find(l => l.id === selectedId)
            : templates.find(t => t.id === selectedId);
    }, [selectedId, letters, templates, view]);

    const handleAiAction = useCallback(async (action: 'generate' | 'improve' | 'summarize', prompt: string, contentToImprove?: string) => {
        if (!activeItem || !('content' in activeItem)) return;

        setIsAiLoading(true);
        setAiError(null);
        try {
            let result;
            switch (action) {
                case 'generate':
                    result = await generateLetter(prompt);
                    break;
                case 'improve':
                    result = await improveText(contentToImprove || '', prompt);
                    break;
                case 'summarize':
                    result = `## Summary\n\n${await summarizeText(activeItem.content)}`;
                    break;
            }
            
            if (result) {
                if (action === 'improve' && contentToImprove) {
                     handleContentChange(activeItem.id, activeItem.content.replace(contentToImprove, result));
                } else {
                    const newContent = (action === 'summarize' ? activeItem.content + '\n\n' : '') + result;
                    handleContentChange(activeItem.id, newContent);
                }
            }
        } catch (error) {
            console.error("AI Action Error:", error);
            setAiError("Failed to perform AI action. Please check your API key and try again.");
        } finally {
            setIsAiLoading(false);
        }
    }, [activeItem, handleContentChange]);

    const handleScan = async (imageData: string) => {
        if (!activeItem || !('content' in activeItem)) return;

        setIsScannerOpen(false); // Close modal
        setIsAiLoading(true);
        setAiError(null);
        try {
            const extractedText = await extractTextFromImage(imageData);
            if (extractedText) {
                const currentContent = activeItem.content || '';
                const newContent = currentContent + '\n\n--- Scanned Text ---\n' + extractedText;
                handleContentChange(activeItem.id, newContent);
            } else {
                 setAiError("AI could not extract any text from the image.");
            }
        } catch (error) {
            console.error("AI Scan Error:", error);
            setAiError("Failed to scan document. Please check your API key and try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleFileImport = async (file: File) => {
        if (!activeItem || !('content' in activeItem)) return;

        setIsAiLoading(true);
        setAiError(null);
        try {
            const extractedText = await extractTextFromFile(file);
            if (extractedText) {
                const currentContent = activeItem.content || '';
                const newContent = currentContent + `\n\n--- Text from ${file.name} ---\n` + extractedText;
                handleContentChange(activeItem.id, newContent);
            } else {
                setAiError(`AI could not extract any text from ${file.name}.`);
            }
        } catch (error) {
            console.error("AI File Import Error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setAiError(`Failed to import file. ${errorMessage}`);
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleAnalyzeDocument = async () => {
        if (!activeItem || !('content' in activeItem) || !activeItem.content) {
            setAiError("There is no content to analyze.");
            return;
        }
        setIsAiLoading(true);
        setAiError(null);
        try {
            const result = await analyzeDocument(activeItem.content);
            setAnalysisResult(result);
        } catch (error) {
            console.error("AI Analyze Error:", error);
            setAiError("Failed to analyze document. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleComposeEmail = async (prompt: string) => {
        setIsAiLoading(true);
        setAiError(null);
        try {
            const result = await generateEmail(prompt);
            setComposedEmail(result);
            setIsEmailComposerOpen(true);
        } catch (error) {
            console.error("AI Email Compose Error:", error);
            setAiError("Failed to compose email. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };


    const handleExport = (format: 'txt' | 'md') => {
        if (!activeItem) return;
        const title = 'title' in activeItem ? activeItem.title : activeItem.name;
        const content = 'content' in activeItem ? activeItem.content : '';

        const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = (platform: 'whatsapp' | 'telegram') => {
        if (!activeItem || !('content' in activeItem)) return;
        const text = encodeURIComponent(activeItem.content);
        let url = '';
        if (platform === 'whatsapp') {
            url = `https://wa.me/?text=${text}`;
        } else if (platform === 'telegram') {
            url = `https://t.me/share/url?url=none&text=${text}`;
        }
        window.open(url, '_blank');
    };


    const MemoizedEditor = React.memo(Editor);
    const aiDisabled = view === View.Templates;

    return (
        <div className="flex h-screen font-sans text-slate-800 dark:text-slate-200">
            <Layout
                view={view}
                setView={setView}
                letters={letters}
                templates={templates}
                selectedId={selectedId}
                onSelect={handleSelect}
                onNewLetter={createNewLetter}
                onNewTemplate={createNewTemplate}
                onDeleteItem={deleteItem}
            >
                {activeItem ? (
                    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-slate-800/50">
                       <MemoizedEditor 
                            key={activeItem.id}
                            item={activeItem}
                            onContentChange={handleContentChange}
                            onTitleChange={handleTitleChange}
                            onFileImport={handleFileImport}
                            onExport={handleExport}
                            onShare={handleShare}
                            view={view}
                            onAction={handleAiAction}
                            onToggleScanner={() => setIsScannerOpen(true)}
                            onAnalyze={handleAnalyzeDocument}
                            onComposeEmail={handleComposeEmail}
                            isLoading={isAiLoading}
                            error={aiError}
                            variables={VARIABLE_TAGS}
                            aiDisabled={aiDisabled}
                       />
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center bg-slate-100 dark:bg-slate-800/50">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">Select an item or create a new one</h2>
                            <p className="mt-2 text-slate-500">Choose a letter or template from the sidebar to start editing.</p>
                            <button 
                                onClick={() => createNewLetter()}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
                            >
                                Create New Letter
                            </button>
                        </div>
                    </div>
                )}
            </Layout>
            {isScannerOpen && <PhotoScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />}
            {analysisResult && <DocAnalyzerModal result={analysisResult} onClose={() => setAnalysisResult(null)} />}
            {isEmailComposerOpen && composedEmail && (
                <EmailComposerModal
                    email={composedEmail}
                    onClose={() => setIsEmailComposerOpen(false)}
                    onUpdate={setComposedEmail}
                />
            )}
        </div>
    );
};

export default App;
