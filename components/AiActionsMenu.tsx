
import React, { useState } from 'react';
import { Variable } from '../types';
import { SparklesIcon, ChevronDownIcon, InfoIcon, CameraIcon, BeakerIcon, MailIcon, XIcon } from './icons/Icons';

interface AiActionsMenuProps {
    onAction: (action: 'generate' | 'improve' | 'summarize', prompt: string, contentToImprove?: string) => void;
    onToggleScanner: () => void;
    onAnalyze: () => void;
    onComposeEmail: (prompt: string) => void;
    isLoading: boolean;
    error: string | null;
    variables: Variable[];
    onClose: () => void;
}

const AiActionsMenu: React.FC<AiActionsMenuProps> = ({ onAction, onToggleScanner, onAnalyze, onComposeEmail, isLoading, error, variables, onClose }) => {
    const [generatePrompt, setGeneratePrompt] = useState('');
    const [improvePrompt, setImprovePrompt] = useState('more professional');
    const [emailPrompt, setEmailPrompt] = useState('a formal resignation email');
    const [activeAccordion, setActiveAccordion] = useState<string | null>('generate');

    const handleAction = (action: 'generate' | 'improve' | 'summarize') => {
        let contentToImprove = '';
        if (action === 'improve') {
            const selection = window.getSelection()?.toString();
            if (!selection) {
                alert("Please select some text in the editor to improve.");
                return;
            }
            contentToImprove = selection;
        }
        
        const prompt = action === 'generate' ? generatePrompt : improvePrompt;
        onAction(action, prompt, contentToImprove);
        onClose();
    };

    const handleCompose = () => {
        onComposeEmail(emailPrompt);
        onClose();
    };
    
    const insertVariable = (tag: string) => {
        const event = new CustomEvent('insertVariable', { detail: { variable: tag } });
        document.dispatchEvent(event);
    };

    const AccordionSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setActiveAccordion(activeAccordion === id ? null : id)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold"
            >
                <span>{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${activeAccordion === id ? 'rotate-180' : ''}`} />
            </button>
            {activeAccordion === id && <div className="p-4 pt-0">{children}</div>}
        </div>
    );

    return (
        <div className="absolute bottom-24 right-8 w-80 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col h-auto max-h-[75vh] z-20">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-bold flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500" />
                    AI Assistant
                </h3>
                 <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close AI Assistant">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                 <AccordionSection title="Generate Content" id="generate">
                    <textarea
                        value={generatePrompt}
                        onChange={(e) => setGeneratePrompt(e.target.value)}
                        placeholder="e.g., A formal complaint about a faulty product..."
                        className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        rows={3}
                    />
                    <button onClick={() => handleAction('generate')} disabled={isLoading || !generatePrompt} className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : 'Generate Letter'}
                    </button>
                </AccordionSection>

                 <AccordionSection title="Compose Email" id="email">
                    <textarea
                        value={emailPrompt}
                        onChange={(e) => setEmailPrompt(e.target.value)}
                        placeholder="e.g., An email asking for a raise..."
                        className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        rows={3}
                    />
                    <button onClick={handleCompose} disabled={isLoading || !emailPrompt} className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center justify-center">
                       <MailIcon className="w-4 h-4 mr-2" />
                        {isLoading ? 'Composing...' : 'Compose Email'}
                    </button>
                </AccordionSection>


                <AccordionSection title="Improve Selection" id="improve">
                    <p className="text-sm text-slate-500 mb-2">Select text in the editor to improve it.</p>
                     <select 
                        value={improvePrompt}
                        onChange={(e) => setImprovePrompt(e.target.value)}
                        className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                         <option>more professional</option>
                         <option>more friendly</option>
                         <option>more concise</option>
                         <option>more persuasive</option>
                         <option>simpler</option>
                     </select>
                    <button onClick={() => handleAction('improve')} disabled={isLoading} className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">
                        {isLoading ? 'Improving...' : 'Improve'}
                    </button>
                </AccordionSection>
                
                 <AccordionSection title="Actions" id="actions">
                    <div className="space-y-2">
                        <button onClick={() => handleAction('summarize')} disabled={isLoading} className="w-full px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50">
                            {isLoading ? 'Summarizing...' : 'Summarize Letter'}
                        </button>
                        <button onClick={onToggleScanner} disabled={isLoading} className="w-full px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 flex items-center justify-center">
                            <CameraIcon className="w-4 h-4 mr-2" />
                            Scan Document
                        </button>
                         <button onClick={onAnalyze} disabled={isLoading} className="w-full px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 flex items-center justify-center">
                            <BeakerIcon className="w-4 h-4 mr-2" />
                            Analyze Document
                        </button>
                    </div>
                </AccordionSection>

                <AccordionSection title="Variables" id="variables">
                    <div className="space-y-2">
                        {variables.map(v => (
                            <div key={v.tag} className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50">
                                <button onClick={() => insertVariable(v.tag)} className="text-left font-mono text-sm text-indigo-600 dark:text-indigo-400">
                                  {v.tag}
                                </button>
                                <InfoIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" title={v.description} />
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {error && <p className="p-4 text-sm text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default AiActionsMenu;
