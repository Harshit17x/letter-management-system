
import React from 'react';
import { Letter, Template, View } from '../types';
import LetterListItem from './LetterListItem';
import TemplateListItem from './TemplateListItem';
import { FileTextIcon, LayersIcon, PlusCircleIcon, SettingsIcon, Trash2Icon } from './icons/Icons';

interface LayoutProps {
  view: View;
  setView: (view: View) => void;
  letters: Letter[];
  templates: Template[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewLetter: (templateId?: string) => void;
  onNewTemplate: () => void;
  onDeleteItem: (id: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  view,
  setView,
  letters,
  templates,
  selectedId,
  onSelect,
  onNewLetter,
  onNewTemplate,
  onDeleteItem,
  children,
}) => {
  const sortedLetters = [...letters].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  
  return (
    <div className="flex w-full h-screen">
      <nav className="w-16 bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-between py-4 border-r border-slate-200 dark:border-slate-700/50">
        <div>
          <button 
            onClick={() => setView(View.Letters)}
            className={`p-2 rounded-lg transition-colors duration-200 ${view === View.Letters ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            aria-label="Letters"
            title="Letters"
          >
            <FileTextIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setView(View.Templates)}
            className={`mt-4 p-2 rounded-lg transition-colors duration-200 ${view === View.Templates ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            aria-label="Templates"
            title="Templates"
          >
            <LayersIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
           <button 
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Settings"
            title="Settings"
           >
             <SettingsIcon className="w-6 h-6" />
           </button>
        </div>
      </nav>

      <aside className="w-80 bg-slate-100/50 dark:bg-slate-800/20 border-r border-slate-200 dark:border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{view === View.Letters ? 'Letters' : 'Templates'}</h2>
          <button 
            onClick={view === View.Letters ? () => onNewLetter() : onNewTemplate}
            className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            title={view === View.Letters ? 'New Letter' : 'New Template'}
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {view === View.Letters && sortedLetters.map(letter => 
            <LetterListItem 
              key={letter.id} 
              letter={letter} 
              isSelected={selectedId === letter.id}
              onSelect={onSelect}
              onDelete={onDeleteItem}
            />
          )}
          {view === View.Templates && templates.map(template => 
            <TemplateListItem 
              key={template.id} 
              template={template} 
              isSelected={selectedId === template.id}
              onSelect={onSelect}
              onNewLetter={onNewLetter}
              onDelete={onDeleteItem}
            />
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white dark:bg-slate-800/50">
        {children}
      </main>
    </div>
  );
};

export default Layout;
