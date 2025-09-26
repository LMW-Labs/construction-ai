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
import { Progress } from '@/components/ui/progress'
import { Calculator, TrendingUp, DollarSign, Plus, Trash2, Brain, FileText } from 'lucide-react'

interface CostEstimate {
  id: string
  name: string
  totalCost: number
  laborCost: number | null
  materialCost: number | null
  equipmentCost: number | null
  overheadCost: number | null
  profitMargin: number | null
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  validUntil: string | null
  createdAt: string
  updatedAt: string
  project: {
    id: string
    name: string
  }
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
    category: 'Labor' | 'Materials' | 'Equipment'
  }>
}

interface Project {
  id: string
  name: string
  description?: string
}

interface LineItem {
  description: string
  quantity: number
  unit: string
  unitPrice: number
  category: 'Labor' | 'Materials' | 'Equipment'
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-yellow-100 text-yellow-800',
}

export default function CostEstimationTool() {
  const [estimates, setEstimates] = useState<CostEstimate[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEstimate, setSelectedEstimate] = useState<CostEstimate | null>(null)
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    validUntil: '',
    profitMargin: 15,
    overheadCost: 0,
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      description: '',
      quantity: 1,
      unit: 'unit',
      unitPrice: 0,
      category: 'Materials' as LineItem['category'],
    }
  ])

  const [aiPrompt, setAiPrompt] = useState('')

  useEffect(() => {
    fetchEstimates()
    fetchProjects()
  }, [])

  const fetchEstimates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cost-estimates')
      if (!response.ok) throw new Error('Failed to fetch cost estimates')
      const data = await response.json()
      setEstimates(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching cost estimates:', error)
      setError('Failed to load cost estimates')
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

  const generateAiEstimate = async () => {
    setIsAiGenerating(true)
    try {
      const mockAiLineItems: LineItem[] = [
        {
          description: 'Concrete foundation (cubic yards)',
          quantity: 150,
          unit: 'cubic yard',
          unitPrice: 180,
          category: 'Materials',
        },
        {
          description: 'Steel reinforcement bars',
          quantity: 5000,
          unit: 'lbs',
          unitPrice: 0.65,
          category: 'Materials',
        },
        {
          description: 'Skilled labor - foundation work',
          quantity: 240,
          unit: 'hours',
          unitPrice: 45,
          category: 'Labor',
        },
      ]

      setLineItems(mockAiLineItems)
      setFormData({
        ...formData,
        name: `AI Generated Estimate - ${aiPrompt}`,
      })
    } catch (error) {
      console.error('Error generating AI estimate:', error)
    } finally {
      setIsAiGenerating(false)
    }
  }

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        description: '',
        quantity: 1,
        unit: 'unit',
        unitPrice: 0,
        category: 'Materials',
      }
    ])
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const calculateTotals = () => {
    const subtotals = lineItems.reduce(
      (acc, item) => {
        const total = item.quantity * item.unitPrice
        acc[item.category.toLowerCase()] += total
        acc.total += total
        return acc
      },
      { labor: 0, materials: 0, equipment: 0, total: 0 }
    )

    const overhead = formData.overheadCost || 0
    const subtotalWithOverhead = subtotals.total + overhead
    const profit = (subtotalWithOverhead * formData.profitMargin) / 100
    const grandTotal = subtotalWithOverhead + profit

    return {
      ...subtotals,
      overhead,
      profit,
      grandTotal,
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const totals = calculateTotals()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading cost estimates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cost Estimation</h1>
            <p className="text-gray-600 mt-1">AI-powered construction cost estimation and management</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Estimate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Cost Estimate</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="ai" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Generate
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ai" className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">AI-Powered Estimation</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Describe your construction project and let AI generate detailed cost estimates.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Project Description</Label>
                        <Textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Describe the construction project"
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        onClick={generateAiEstimate}
                        disabled={!aiPrompt || isAiGenerating}
                        className="w-full"
                      >
                        {isAiGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating AI Estimate...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate AI Estimate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="manual">
                  <div className="text-sm text-gray-600 mb-4">
                    Create a detailed cost estimate by adding individual line items.
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Estimate Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter estimate name"
                    />
                  </div>
                  
                  <div>
                    <Label>Project</Label>
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
                  
                  <div>
                    <Label>Valid Until</Label>
                    <Input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Profit Margin (%)</Label>
                    <Input
                      type="number"
                      value={formData.profitMargin}
                      onChange={(e) => setFormData({...formData, profitMargin: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Line Items</Label>
                    <Button type="button" onClick={addLineItem} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {lineItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                        <div className="col-span-4">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                            placeholder="Item description"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <Label className="text-xs">Qty</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label className="text-xs">Unit</Label>
                          <Input
                            value={item.unit}
                            onChange={(e) => updateLineItem(index, 'unit', e.target.value)}
                            placeholder="unit"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label className="text-xs">Unit Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label className="text-xs">Category</Label>
                          <Select 
                            value={item.category} 
                            onValueChange={(value: LineItem['category']) => updateLineItem(index, 'category', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Labor">Labor</SelectItem>
                              <SelectItem value="Materials">Materials</SelectItem>
                              <SelectItem value="Equipment">Equipment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Cost Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Labor:</span>
                        <span className="font-medium">{formatCurrency(totals.labor)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials:</span>
                        <span className="font-medium">{formatCurrency(totals.materials)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equipment:</span>
                        <span className="font-medium">{formatCurrency(totals.equipment)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(totals.total)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Overhead:</span>
                        <span className="font-medium">{formatCurrency(totals.overhead)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit ({formData.profitMargin}%):</span>
                        <span className="font-medium">{formatCurrency(totals.profit)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-bold text-base text-blue-600">
                        <span>Total:</span>
                        <span>{formatCurrency(totals.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => console.log('Create estimate')} disabled={!formData.name || !formData.projectId}>
                    Create Estimate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {estimates.filter(e => e.status === 'SUBMITTED').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {estimates.filter(e => e.status === 'APPROVED').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(estimates.reduce((sum, e) => sum + e.totalCost, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estimates.map((estimate) => (
            <Card key={estimate.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEstimate(estimate)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{estimate.name}</CardTitle>
                    <CardDescription>{estimate.project.name}</CardDescription>
                  </div>
                  <Badge className={statusColors[estimate.status]}>
                    {estimate.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(estimate.totalCost)}
                    </div>
                    <div className="text-sm text-gray-500">Total Estimate</div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <div>Created: {formatDate(estimate.createdAt)}</div>
                    {estimate.validUntil && (
                      <div>Valid until: {formatDate(estimate.validUntil)}</div>
                    )}
                    <div>{estimate.lineItems.length} line items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {estimates.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No cost estimates found. Create your first estimate to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}