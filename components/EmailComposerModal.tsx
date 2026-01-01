
import React, { useState } from 'react';
import { EmailComposition } from '../services/geminiService';
import { XIcon, MailIcon } from './icons/Icons';

interface EmailComposerModalProps {
    email: EmailComposition;
    onClose: () => void;
    onUpdate: (email: EmailComposition) => void;
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ email, onClose, onUpdate }) => {
    const { subject, body } = email;

    const handleSend = () => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center">
                        <MailIcon className="w-6 h-6 mr-3 text-indigo-500" />
                        Compose Email
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close email composer">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => onUpdate({ ...email, subject: e.target.value })}
                            className="w-full p-2 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="body" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Body</label>
                        <textarea
                            id="body"
                            value={body}
                            onChange={(e) => onUpdate({ ...email, body: e.target.value })}
                            className="w-full p-2 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            rows={12}
                        />
                    </div>
                </main>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center space-x-3">
                     <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                        Cancel
                    </button>
                     <button onClick={handleSend} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 flex items-center">
                        <MailIcon className="w-4 h-4 mr-2" />
                        Send via Gmail
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default EmailComposerModal;
