import React from 'react';
import { GradeLevel } from '../types';

interface TopicChipsProps {
  topics: Array<{ id: string; title: string; minutes?: number }>;
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  grade: GradeLevel;
}

export const TopicChips: React.FC<TopicChipsProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  grade,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {topics.map((t) => {
        const isSelected = t.id === selectedTopicId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTopic(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            <span>{t.title}</span>
            <span className="text-[10px] opacity-75 font-mono">G{grade}</span>
          </button>
        );
      })}
    </div>
  );
};
