import React from 'react';
import type { BatchStatus } from '../types/biocycle';
import { Activity, CheckCircle2, Clock, AlertTriangle, Archive, Sparkles } from 'lucide-react';

interface BatchStatusBadgeProps {
  status: BatchStatus;
}

export const BatchStatusBadge: React.FC<BatchStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Optimal':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-emerald">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Optimal</span>
        </span>
      );
    case 'Processing':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-blue">
          <Activity className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span>Processing</span>
        </span>
      );
    case 'Caution':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-amber">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <span>Caution</span>
        </span>
      );
    case 'Harvest Ready':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-900/40 text-teal-300 border border-teal-500/40">
          <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-bounce" />
          <span>Harvest Ready</span>
        </span>
      );
    case 'Pending Recommendation':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-900/40 text-purple-300 border border-purple-500/40">
          <Clock className="h-3.5 w-3.5 text-purple-400" />
          <span>Pending Rec</span>
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700">
          <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
          <span>Completed</span>
        </span>
      );
    case 'Archived':
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-900 text-gray-400 border border-gray-800">
          <Archive className="h-3.5 w-3.5" />
          <span>Archived</span>
        </span>
      );
  }
};
