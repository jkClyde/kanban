'use client'
// File: components/projects/FilterPanel.js

import { SortAsc, SortDesc } from "lucide-react"

export default function FilterPanel({
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  sortField,
  sortDirection,
  handleSort,
  setSortDirection,
  availableTags
}) {
  // All possible statuses
  const statuses = ['All', 'Completed', 'In Progress', 'Planning', 'On Hold', 'Canceled']

  return (
    <div className="mb-6 p-4 bg-sidebar rounded-lg  ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status filter */}
        <div >
          <label className="block text-sm font-medium mb-1 text-white">Status</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-header"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        {/* Tag filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Tag</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-header"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="All">All Tags</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        {/* Sort controls */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Sort by</label>
          <div className="flex gap-2">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-header"
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="completion">Completion %</option>
            </select>
            <button 
              className="p-2 border border-gray-300 rounded-lg bg-white text-sidebar"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              aria-label={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
            >
              {sortDirection === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}