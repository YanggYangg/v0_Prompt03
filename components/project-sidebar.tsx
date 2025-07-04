"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { WorkItem } from "@/lib/mock-data"
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Target,
  BookOpen,
  CheckSquare,
  List,
} from "lucide-react"

interface ProjectSidebarProps {
  data: WorkItem[]
  selectedItem: WorkItem | null
  onSelectItem: (item: WorkItem) => void
  onCreateItem: (type: "epic" | "story" | "task" | "subtask", parent?: WorkItem) => void
  onEditItem: (item: WorkItem) => void
  onDeleteItem: (item: WorkItem) => void
}

export function ProjectSidebar({
  data,
  selectedItem,
  onSelectItem,
  onCreateItem,
  onEditItem,
  onDeleteItem,
}: ProjectSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "epic":
        return <Target className="h-4 w-4 text-purple-600" />
      case "story":
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case "task":
        return <CheckSquare className="h-4 w-4 text-green-600" />
      case "subtask":
        return <List className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-gray-100 text-gray-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "reviewing":
        return "bg-yellow-100 text-yellow-800"
      case "done":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChildType = (parentType: string) => {
    switch (parentType) {
      case "epic":
        return "story"
      case "story":
        return "task"
      case "task":
        return "subtask"
      default:
        return "subtask"
    }
  }

  const renderItem = (item: WorkItem, level = 0) => {
    const children = data.filter((d) => d.parentId === item.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isSelected = selectedItem?.id === item.id

    return (
      <div key={item.id} className="space-y-1">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
            isSelected ? "bg-blue-50 border border-blue-200" : ""
          }`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          {hasChildren ? (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleExpanded(item.id)}>
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex-1 flex items-center gap-2 min-w-0" onClick={() => onSelectItem(item)}>
            {getIcon(item.type)}
            <span className="text-sm font-medium truncate">{item.title}</span>
            <Badge variant="secondary" className={`text-xs ${getStatusColor(item.status)}`}>
              {item.status}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {item.type !== "subtask" && (
                <DropdownMenuItem onClick={() => onCreateItem(getChildType(item.type) as any, item)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add {getChildType(item.type)}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEditItem(item)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteItem(item)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">{children.map((child) => renderItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const epics = data.filter((item) => item.type === "epic")

  return (
    <div className="p-4 space-y-2">
      {epics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">No epics yet</p>
          <p className="text-xs text-gray-400">Create your first epic to get started</p>
        </div>
      ) : (
        epics.map((epic) => renderItem(epic))
      )}
    </div>
  )
}
