'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { CalendarDays, Settings, MapPin, DollarSign, Plus, Edit, AlertTriangle, CheckCircle, Wrench, Truck, Users } from 'lucide-react'

interface Equipment {
  id: string
  name: string
  type: 'EXCAVATOR' | 'BULLDOZER' | 'CRANE' | 'LOADER' | 'DUMP_TRUCK' | 'CONCRETE_MIXER' | 'GENERATOR' | 'COMPRESSOR' | 'SCAFFOLDING' | 'TOOLS' | 'OTHER'
  model: string | null
  serialNumber: string | null
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_ORDER' | 'RENTED_OUT'
  purchaseDate: string | null
  purchasePrice: number | null
  hourlyRate: number | null
  dailyRate: number | null
  lastMaintenance: string | null
  nextMaintenance: string | null
  location: string | null
  notes: string | null
  project?: {
    id: string
    name: string
  }
  operator?: {
    id: string
    name: string | null
    email: string
  }
  maintenanceRecords: Array<{
    id: string
    type: string
    description: string
    cost: number | null
    performedAt: string
    performedBy: string | null
    nextDue: string | null
  }>
  createdAt: string
  updatedAt: string
}

const statusColors = {
  AVAILABLE: 'bg-green-100 text-green-800',
  IN_USE: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  OUT_OF_ORDER: 'bg-red-100 text-red-800',
  RENTED_OUT: 'bg-purple-100 text-purple-800',
}

const equipmentIcons = {
  EXCAVATOR: Truck,
  BULLDOZER: Truck,
  CRANE: Truck,
  LOADER: Truck,
  DUMP_TRUCK: Truck,
  CONCRETE_MIXER: Settings,
  GENERATOR: Settings,
  COMPRESSOR: Settings,
  SCAFFOLDING: Settings,
  TOOLS: Wrench,
  OTHER: Settings,
}

export default function EquipmentDashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/equipment')
      if (!response.ok) throw new Error('Failed to fetch equipment')
      const data = await response.json()
      setEquipment(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching equipment:', error)
      setError('Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const getMaintenanceStatus = (equipment: Equipment) => {
    if (!equipment.nextMaintenance) return null
    const nextDate = new Date(equipment.nextMaintenance)
    const now = new Date()
    const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntil < 0) return { status: 'overdue', days: Math.abs(daysUntil) }
    if (daysUntil <= 7) return { status: 'due_soon', days: daysUntil }
    return { status: 'scheduled', days: daysUntil }
  }

  const getUtilizationRate = (equipment: Equipment) => {
    // Mock calculation - in real app would be based on actual usage data
    if (equipment.status === 'IN_USE') return Math.floor(Math.random() * 40) + 60
    if (equipment.status === 'AVAILABLE') return Math.floor(Math.random() * 30)
    return 0
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString()
  }

  const getFilteredEquipment = () => {
    return equipment.filter(item => {
      const statusMatch = filterStatus === 'all' || item.status === filterStatus
      const typeMatch = filterType === 'all' || item.type === filterType
      const searchMatch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      return statusMatch && typeMatch && searchMatch
    })
  }

  const EquipmentCard = ({ equipment }: { equipment: Equipment }) => {
    const Icon = equipmentIcons[equipment.type]
    const maintenanceStatus = getMaintenanceStatus(equipment)
    const utilizationRate = getUtilizationRate(equipment)
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEquipment(equipment)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-lg">{equipment.name}</CardTitle>
                <CardDescription>
                  {equipment.model} • {equipment.type.replace('_', ' ')}
                </CardDescription>
              </div>
            </div>
            <Badge className={statusColors[equipment.status]}>
              {equipment.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Location and Project */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {equipment.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{equipment.location}</span>
                </div>
              )}
              {equipment.project && (
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{equipment.project.name}</span>
                </div>
              )}
            </div>

            {/* Operator */}
            {equipment.operator && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{equipment.operator.name || equipment.operator.email}</span>
              </div>
            )}

            {/* Utilization Rate */}
            {equipment.status === 'IN_USE' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilization</span>
                  <span>{utilizationRate}%</span>
                </div>
                <Progress value={utilizationRate} className="h-2" />
              </div>
            )}

            {/* Maintenance Status */}
            {maintenanceStatus && (
              <div className="flex items-center gap-2 text-sm">
                {maintenanceStatus.status === 'overdue' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Maintenance overdue by {maintenanceStatus.days} days</span>
                  </>
                )}
                {maintenanceStatus.status === 'due_soon' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-600">Maintenance due in {maintenanceStatus.days} days</span>
                  </>
                )}
                {maintenanceStatus.status === 'scheduled' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Next maintenance in {maintenanceStatus.days} days</span>
                  </>
                )}
              </div>
            )}

            {/* Rates */}
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
              {equipment.hourlyRate && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-gray-500" />
                  <span>{formatCurrency(equipment.hourlyRate)}/hr</span>
                </div>
              )}
              {equipment.dailyRate && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-gray-500" />
                  <span>{formatCurrency(equipment.dailyRate)}/day</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredEquipment = getFilteredEquipment()

  // Calculate dashboard stats
  const totalEquipment = equipment.length
  const inUseEquipment = equipment.filter(e => e.status === 'IN_USE').length
  const availableEquipment = equipment.filter(e => e.status === 'AVAILABLE').length
  const maintenanceEquipment = equipment.filter(e => e.status === 'MAINTENANCE' || e.status === 'OUT_OF_ORDER').length
  const overdueMaintenance = equipment.filter(e => {
    const status = getMaintenanceStatus(e)
    return status?.status === 'overdue'
  }).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading equipment...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
            <p className="text-gray-600 mt-1">Track machinery, maintenance, and utilization</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipment}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Use</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inUseEquipment}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableEquipment}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{maintenanceEquipment}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueMaintenance}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="IN_USE">In Use</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              <SelectItem value="OUT_OF_ORDER">Out of Order</SelectItem>
              <SelectItem value="RENTED_OUT">Rented Out</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="EXCAVATOR">Excavator</SelectItem>
              <SelectItem value="BULLDOZER">Bulldozer</SelectItem>
              <SelectItem value="CRANE">Crane</SelectItem>
              <SelectItem value="LOADER">Loader</SelectItem>
              <SelectItem value="DUMP_TRUCK">Dump Truck</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
          
          {filteredEquipment.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No equipment found matching your filters
            </div>
          )}
        </div>

        {/* Equipment Detail Modal */}
        {selectedEquipment && (
          <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {React.createElement(equipmentIcons[selectedEquipment.type], { className: "w-6 h-6 text-blue-600" })}
                  {selectedEquipment.name}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <div className="mt-1">
                        <Badge className={statusColors[selectedEquipment.status]}>
                          {selectedEquipment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Type</Label>
                      <div className="mt-1">{selectedEquipment.type.replace('_', ' ')}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Model</Label>
                      <div className="mt-1">{selectedEquipment.model || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Serial Number</Label>
                      <div className="mt-1">{selectedEquipment.serialNumber || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Location</Label>
                      <div className="mt-1">{selectedEquipment.location || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Purchase Date</Label>
                      <div className="mt-1">{formatDate(selectedEquipment.purchaseDate)}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Purchase Price</Label>
                      <div className="mt-1">{formatCurrency(selectedEquipment.purchasePrice)}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Hourly Rate</Label>
                      <div className="mt-1">{formatCurrency(selectedEquipment.hourlyRate)}/hr</div>
                    </div>
                  </div>
                  
                  {selectedEquipment.notes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Notes</Label>
                      <div className="mt-1 text-sm">{selectedEquipment.notes}</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="maintenance">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Last Maintenance</Label>
                        <div className="mt-1">{formatDate(selectedEquipment.lastMaintenance)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Next Maintenance</Label>
                        <div className="mt-1">{formatDate(selectedEquipment.nextMaintenance)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500 mb-2 block">Maintenance History</Label>
                      <div className="space-y-2">
                        {selectedEquipment.maintenanceRecords.length > 0 ? (
                          selectedEquipment.maintenanceRecords.map((record) => (
                            <div key={record.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{record.type}</div>
                                  <div className="text-sm text-gray-600">{record.description}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatDate(record.performedAt)} {record.performedBy && `• by ${record.performedBy}`}
                                  </div>
                                </div>
                                {record.cost && (
                                  <div className="text-sm font-medium">{formatCurrency(record.cost)}</div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No maintenance records found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="usage">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Current Utilization</Label>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Usage Rate</span>
                            <span>{getUtilizationRate(selectedEquipment)}%</span>
                          </div>
                          <Progress value={getUtilizationRate(selectedEquipment)} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Revenue Generated</Label>
                        <div className="mt-1 text-lg font-semibold">
                          {formatCurrency(Math.floor(Math.random() * 50000) + 10000)}
                        </div>
                        <div className="text-xs text-gray-500">This month</div>
                      </div>
                    </div>
                    
                    {selectedEquipment.project && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Current Project</Label>
                        <div className="mt-1">
                          <div className="p-3 border rounded-lg">
                            <div className="font-medium">{selectedEquipment.project.name}</div>
                            {selectedEquipment.operator && (
                              <div className="text-sm text-gray-600 mt-1">
                                Operated by {selectedEquipment.operator.name || selectedEquipment.operator.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}