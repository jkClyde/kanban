'use client'


import { useState, useEffect, useTransition } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import ProjectCard from './ProjectCard'
import FilterPanel from './FilterPanel'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'


export default function ProjectsList({ initialProjects }) {
  const [projects] = useState(initialProjects || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  // const [tagFilter, setTagFilter] = useState('All')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [availableTags, setAvailableTags] = useState([])
  const [isPending, startTransition] = useTransition()
  // GEt Search Params Tags
  const searchParams = useSearchParams()
  const tagFromUrl = searchParams.get('tag')
  const [tagFilter, setTagFilter] = useState(tagFromUrl || 'All')


  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10


 

  useEffect(() => {
    const tags = new Set()
    projects.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => tags.add(tag))
      }
    })
    setAvailableTags(Array.from(tags))
  }, [projects])

  // Reset to first page when filters change
  useEffect(() => {
    startTransition(() => {
      setCurrentPage(1)
    })
  }, [searchTerm, statusFilter, tagFilter, sortField, sortDirection])

  // Filter projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter
      const matchesTag = tagFilter === 'All' || 
                        (project.tags && project.tags.includes(tagFilter))
      return matchesSearch && matchesStatus && matchesTag
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (sortField === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      } else if (sortField === 'completion') {
        return sortDirection === 'asc'
          ? a.completion - b.completion
          : b.completion - a.completion
      }
      return 0
    })

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  )

  // Toggle sort direction and field
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Reset all filters
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
    setTagFilter('All')
    setCurrentPage(1)
  }

  // Handle page changes with smooth transitions
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    
    startTransition(() => {
      setCurrentPage(newPage)
      // Scroll to top of projects list on page change
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      if (currentPage <= 2) {
        end = 4
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }
      if (start > 2) {
        pageNumbers.push('...')
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
      if (end < totalPages - 1) {
        pageNumbers.push('...')
      }
      pageNumbers.push(totalPages)
    }
    return pageNumbers
  }

  return (
    <>
      <FilterPanel 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          setSortDirection={setSortDirection}
          availableTags={availableTags}
        />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        

        <h1 className="text-2xl font-bold text-header">Projects ({filteredProjects.length})</h1>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Projects list */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4 text-gray-400">
            <Filter size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No projects found matching your filters.</p>
          {(searchTerm || statusFilter !== 'All' || tagFilter !== 'All') && (
            <button 
              className="mt-4 px-4 py-2 bg-blue_bg text-white rounded-lg hover:bg-blue_bg transition"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4"
            >
              {paginatedProjects.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  activeTagFilter={tagFilter}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center">
              <nav className="flex items-center gap-1" aria-label="Pagination">
                {/* Previous button */}
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentPage === 1 
                      ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => changePage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue_bg text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                {/* Next button */}
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${
                    currentPage === totalPages 
                      ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          )}

          {/* Page info */}
          {filteredProjects.length > 0 && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
            </div>
          )}
        </>
      )}
    </>
  )
}