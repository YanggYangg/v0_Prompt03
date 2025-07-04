"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import type { WorkItem } from "@/lib/mock-data"

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  type: "epic" | "story" | "task" | "subtask"
  item?: WorkItem | null
  onSave: (data: Partial<WorkItem>) => void
}

const statusOptions = ["new", "in progress", "reviewing", "done", "closed"]
const priorityOptions = ["low", "normal", "medium", "high"]
const assigneeOptions = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"]

export function ItemModal({ isOpen, onClose, mode, type, item, onSave }: ItemModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "new",
    priority: "normal",
    estimatedTime: 0,
    progress: 0,
    estimatedStartDate: "",
    estimatedEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === "edit" && item) {
      setFormData({
        title: item.title,
        description: item.description,
        assignee: item.assignee,
        status: item.status,
        priority: item.priority,
        estimatedTime: item.estimatedTime,
        progress: item.progress,
        estimatedStartDate: item.estimatedStartDate,
        estimatedEndDate: item.estimatedEndDate,
        actualStartDate: item.actualStartDate,
        actualEndDate: item.actualEndDate,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        assignee: "",
        status: "new",
        priority: "normal",
        estimatedTime: 0,
        progress: 0,
        estimatedStartDate: "",
        estimatedEndDate: "",
        actualStartDate: "",
        actualEndDate: "",
      })
    }
    setErrors({})
  }, [mode, item, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (formData.estimatedStartDate && formData.estimatedEndDate) {
      if (new Date(formData.estimatedStartDate) > new Date(formData.estimatedEndDate)) {
        newErrors.estimatedEndDate = "End date must be after start date"
      }
    }

    if (formData.actualStartDate && formData.actualEndDate) {
      if (new Date(formData.actualStartDate) > new Date(formData.actualEndDate)) {
        newErrors.actualEndDate = "Actual end date must be after actual start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getModalTitle = () => {
    const action = mode === "create" ? "Create" : "Edit"
    const itemType = type.charAt(0).toUpperCase() + type.slice(1)
    return `${action} ${itemType}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder={`Enter ${type} title`}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder={`Describe this ${type}...`}
                rows={3}
              />
            </div>
          </div>

          {/* Assignment and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Assignee</Label>
              <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assigneeOptions.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="0"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange("estimatedTime", Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label>Progress: {formData.progress}%</Label>
              <Slider
                value={[formData.progress]}
                onValueChange={(value) => handleInputChange("progress", value[0])}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h4 className="font-medium">Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedStartDate">Estimated Start Date</Label>
                <Input
                  id="estimatedStartDate"
                  type="date"
                  value={formData.estimatedStartDate}
                  onChange={(e) => handleInputChange("estimatedStartDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
                <Input
                  id="estimatedEndDate"
                  type="date"
                  value={formData.estimatedEndDate}
                  onChange={(e) => handleInputChange("estimatedEndDate", e.target.value)}
                  className={errors.estimatedEndDate ? "border-red-500" : ""}
                />
                {errors.estimatedEndDate && <p className="text-sm text-red-500 mt-1">{errors.estimatedEndDate}</p>}
              </div>

              <div>
                <Label htmlFor="actualStartDate">Actual Start Date</Label>
                <Input
                  id="actualStartDate"
                  type="date"
                  value={formData.actualStartDate}
                  onChange={(e) => handleInputChange("actualStartDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="actualEndDate">Actual End Date</Label>
                <Input
                  id="actualEndDate"
                  type="date"
                  value={formData.actualEndDate}
                  onChange={(e) => handleInputChange("actualEndDate", e.target.value)}
                  className={errors.actualEndDate ? "border-red-500" : ""}
                />
                {errors.actualEndDate && <p className="text-sm text-red-500 mt-1">{errors.actualEndDate}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
