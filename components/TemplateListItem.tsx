
import React from 'react';
import { Template } from '../types';
import { FilePlusIcon, Trash2Icon } from './icons/Icons';

interface TemplateListItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onNewLetter: (templateId: string) => void;
  onDelete: (id: string) => void;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({ template, isSelected, onSelect, onNewLetter, onDelete }) => {

    const handleCreateLetter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onNewLetter(template.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
         if(window.confirm(`Are you sure you want to delete template "${template.name}"?`)){
            onDelete(template.id);
        }
    };

  return (
    <div
      onClick={() => onSelect(template.id)}
      className={`group cursor-pointer p-4 border-b border-slate-200 dark:border-slate-700/50 transition-colors duration-150 ${
        isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/30'
      }`}
    >
        <div className="flex justify-between items-center">
             <h4 className={`font-semibold truncate ${isSelected ? 'text-indigo-800 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                {template.name}
            </h4>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={handleCreateLetter} 
                    className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400" 
                    title="New letter from template"
                >
                    <FilePlusIcon className="w-4 h-4" />
                </button>
                 <button
                    onClick={handleDelete}
                    className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Delete Template"
                >
                    <Trash2Icon className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default TemplateListItem;
