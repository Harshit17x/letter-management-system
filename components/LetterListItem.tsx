
import React from 'react';
import { Letter } from '../types';
import { Trash2Icon } from './icons/Icons';

interface LetterListItemProps {
  letter: Letter;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const LetterListItem: React.FC<LetterListItemProps> = ({ letter, isSelected, onSelect, onDelete }) => {
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(window.confirm(`Are you sure you want to delete "${letter.title}"?`)){
            onDelete(letter.id);
        }
    };

  return (
    <div
      onClick={() => onSelect(letter.id)}
      className={`group cursor-pointer p-4 border-b border-slate-200 dark:border-slate-700/50 transition-colors duration-150 ${
        isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/30'
      }`}
    >
        <div className="flex justify-between items-start">
            <h4 className={`font-semibold truncate pr-2 ${isSelected ? 'text-indigo-800 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                {letter.title}
            </h4>
            <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition-opacity"
                title="Delete Letter"
            >
                <Trash2Icon className="w-4 h-4" />
            </button>
        </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{timeAgo(letter.lastModified)}</p>
    </div>
  );
};

export default LetterListItem;
