'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Shield, CheckCircle, Clock, MapPin, Camera, Plus, Eye, FileText } from 'lucide-react'

interface SafetyReport {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  location: string | null
  photos: string[]
  resolvedAt: string | null
  resolution: string | null
  createdAt: string
  updatedAt: string
  project: {
    id: string
    name: string
  }
  reporter: {
    id: string
    name: string | null
    email: string
  }
}

interface Project {
  id: string
  name: string
}

const severityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
}

const statusColors = {
  OPEN: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
}

const severityIcons = {
  LOW: Shield,
  MEDIUM: AlertTriangle,
  HIGH: AlertTriangle,
  CRITICAL: AlertTriangle,
}

export default function SafetyReporting() {
  const [reports, setReports] = useState<SafetyReport[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterProject, setFilterProject] = useState<string>('all')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM' as SafetyReport['severity'],
    location: '',
    projectId: '',
    photos: [] as File[],
  })

  useEffect(() => {
    fetchReports()
    fetchProjects()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/safety-reports')
      if (!response.ok) throw new Error('Failed to fetch safety reports')
      const data = await response.json()
      setReports(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching safety reports:', error)
      setError('Failed to load safety reports')
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleCreateReport = async () => {
    try {
      // In a real app, you'd upload photos first and get URLs
      const photoUrls: string[] = []
      
      const response = await fetch('/api/safety-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos: photoUrls,
        }),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        resetForm()
        fetchReports()
      }
    } catch (error) {
      console.error('Error creating safety report:', error)
    }
  }

  const handleUpdateStatus = async (reportId: string, status: SafetyReport['status'], resolution?: string) => {
    try {
      const response = await fetch(`/api/safety-reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resolution,
          resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : null,
        }),
      })

      if (response.ok) {
        fetchReports()
        setSelectedReport(null)
      }
    } catch (error) {
      console.error('Error updating safety report:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      severity: 'MEDIUM',
      location: '',
      projectId: '',
      photos: [],
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFilteredReports = () => {
    return reports.filter(report => {
      const statusMatch = filterStatus === 'all' || report.status === filterStatus
      const severityMatch = filterSeverity === 'all' || report.severity === filterSeverity
      const projectMatch = filterProject === 'all' || report.project.id === filterProject
      return statusMatch && severityMatch && projectMatch
    })
  }

  const SafetyReportCard = ({ report }: { report: SafetyReport }) => {
    const SeverityIcon = severityIcons[report.severity]
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedReport(report)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <SeverityIcon className={`w-5 h-5 ${
                report.severity === 'CRITICAL' ? 'text-red-600' :
                report.severity === 'HIGH' ? 'text-orange-600' :
                report.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
              }`} />
              <div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription className="text-sm">
                  {report.project.name}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={statusColors[report.status]}>
                {report.status.replace('_', ' ')}
              </Badge>
              <Badge className={severityColors[report.severity]}>
                {report.severity}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 line-clamp-3">
              {report.description}
            </p>

            {/* Location */}
            {report.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{report.location}</span>
              </div>
            )}

            {/* Photos indicator */}
            {report.photos.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Camera className="w-4 h-4" />
                <span>{report.photos.length} photo{report.photos.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-gray-500">
                Reported by {report.reporter.name || report.reporter.email}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(report.createdAt)}
              </div>
            </div>

            {report.resolvedAt && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Resolved on {formatDate(report.resolvedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredReports = getFilteredReports()

  // Calculate dashboard stats
  const totalReports = reports.length
  const openReports = reports.filter(r => r.status === 'OPEN').length
  const criticalReports = reports.filter(r => r.severity === 'CRITICAL' && r.status !== 'RESOLVED' && r.status !== 'CLOSED').length
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading safety reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safety Reports</h1>
            <p className="text-gray-600 mt-1">Track and manage safety incidents on construction sites</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Report Safety Incident</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Incident Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Brief description of the incident"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      placeholder="Provide detailed information about what happened, when, and any immediate actions taken"
                    />
                  </div>

                  <div>
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={formData.severity} onValueChange={(value: SafetyReport['severity']) => setFormData({...formData, severity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Specific location where incident occurred"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="photos">Photos (Optional)</Label>
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        setFormData({...formData, photos: files})
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload photos of the incident scene or hazard
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReport} className="bg-red-600 hover:bg-red-700">
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{openReports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalReports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <SafetyReportCard key={report.id} report={report} />
          ))}
          
          {filteredReports.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No safety reports found matching your filters
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {React.createElement(severityIcons[selectedReport.severity], { 
                    className: `w-6 h-6 ${
                      selectedReport.severity === 'CRITICAL' ? 'text-red-600' :
                      selectedReport.severity === 'HIGH' ? 'text-orange-600' :
                      selectedReport.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                    }` 
                  })}
                  {selectedReport.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Status and Severity */}
                <div className="flex gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">
                      <Badge className={statusColors[selectedReport.status]}>
                        {selectedReport.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Severity</Label>
                    <div className="mt-1">
                      <Badge className={severityColors[selectedReport.severity]}>
                        {selectedReport.severity}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Project</Label>
                    <div className="mt-1">{selectedReport.project.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <div className="mt-1">{selectedReport.location || 'Not specified'}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Reported By</Label>
                    <div className="mt-1">{selectedReport.reporter.name || selectedReport.reporter.email}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Reported On</Label>
                    <div className="mt-1">{formatDate(selectedReport.createdAt)}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Photos */}
                {selectedReport.photos.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Photos</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedReport.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution */}
                {selectedReport.resolution && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Resolution</Label>
                    <div className="mt-1 p-3 bg-green-50 rounded-lg text-sm">
                      {selectedReport.resolution}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Resolved on {selectedReport.resolvedAt && formatDate(selectedReport.resolvedAt)}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedReport.status !== 'RESOLVED' && selectedReport.status !== 'CLOSED' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'IN_PROGRESS')}
                      disabled={selectedReport.status === 'IN_PROGRESS'}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Mark In Progress
                    </Button>
                    <Button
                      onClick={() => {
                        const resolution = prompt('Please provide resolution details:')
                        if (resolution) {
                          handleUpdateStatus(selectedReport.id, 'RESOLVED', resolution)
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}