
import React from 'react';
import { AnalysisResult } from '../services/geminiService';
import { XIcon, BeakerIcon, CheckCircleIcon, AlertTriangleIcon, LightbulbIcon } from './icons/Icons';

interface DocAnalyzerModalProps {
    result: AnalysisResult;
    onClose: () => void;
}

const InfoCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h4>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize">{value}</p>
    </div>
);


const DocAnalyzerModal: React.FC<DocAnalyzerModalProps> = ({ result, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center">
                        <BeakerIcon className="w-6 h-6 mr-3 text-indigo-500" />
                        Document Analysis
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close analysis">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <InfoCard title="Detected Tone" value={result.tone || 'N/A'} />
                       <InfoCard title="Sentiment" value={result.sentiment || 'N/A'} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold flex items-center mb-3">
                            <LightbulbIcon className="w-5 h-5 mr-2 text-amber-500" />
                            Suggestions for Improvement
                        </h3>
                        {result.suggestions && result.suggestions.length > 0 ? (
                            <ul className="space-y-3">
                                {result.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <p className="text-slate-700 dark:text-slate-300">{suggestion}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <div className="flex items-center text-slate-500 dark:text-slate-400 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                <AlertTriangleIcon className="w-5 h-5 mr-3" />
                                <p>No specific suggestions were generated.</p>
                            </div>
                        )}
                    </div>
                </main>
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                     <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900">
                        Got it
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DocAnalyzerModal;
