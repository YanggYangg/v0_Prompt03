"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { WorkItem } from "@/lib/mock-data"
import {
  Edit,
  Plus,
  Calendar,
  Clock,
  User,
  Flag,
  Target,
  BookOpen,
  CheckSquare,
  List,
  MessageSquare,
  Paperclip,
} from "lucide-react"

interface MainContentProps {
  selectedItem: WorkItem | null
  data: WorkItem[]
  onEditItem: (item: WorkItem) => void
  onCreateItem: (type: "epic" | "story" | "task" | "subtask", parent?: WorkItem) => void
}

export function MainContent({ selectedItem, data, onEditItem, onCreateItem }: MainContentProps) {
  if (!selectedItem) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Select an item to view details</h3>
          <p className="text-sm text-gray-400">Choose an epic, story, task, or subtask from the sidebar</p>
        </div>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "epic":
        return <Target className="h-5 w-5 text-purple-600" />
      case "story":
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case "task":
        return <CheckSquare className="h-5 w-5 text-green-600" />
      case "subtask":
        return <List className="h-5 w-5 text-orange-600" />
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
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

  const children = data.filter((item) => item.parentId === selectedItem.id)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {getIcon(selectedItem.type)}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h1>
            <p className="text-sm text-gray-500 capitalize">{selectedItem.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedItem.type !== "subtask" && (
            <Button
              onClick={() => onCreateItem(getChildType(selectedItem.type) as any, selectedItem)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {getChildType(selectedItem.type)}
            </Button>
          )}
          <Button variant="outline" onClick={() => onEditItem(selectedItem)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex gap-4 mb-6">
        <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
        <Badge className={getPriorityColor(selectedItem.priority)}>
          <Flag className="h-3 w-3 mr-1" />
          {selectedItem.priority} priority
        </Badge>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Assignment & Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment & Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Assignee</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {selectedItem.assignee ? selectedItem.assignee.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{selectedItem.assignee || "Unassigned"}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Progress</p>
                <span className="text-sm text-gray-600">{selectedItem.progress}%</span>
              </div>
              <Progress value={selectedItem.progress} className="h-2" />
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Estimated Time</p>
                <p className="text-sm text-gray-600">{selectedItem.estimatedTime} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Estimated Dates</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedItem.estimatedStartDate || "Not set"} - {selectedItem.estimatedEndDate || "Not set"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Actual Dates</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedItem.actualStartDate || "Not started"} - {selectedItem.actualEndDate || "Not completed"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Items */}
      {children.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {getChildType(selectedItem.type)}s ({children.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {children.map((child, index) => (
                <div key={child.id}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getIcon(child.type)}
                      <div>
                        <p className="font-medium">{child.title}</p>
                        <p className="text-sm text-gray-500">
                          {child.assignee || "Unassigned"} • {child.progress}% complete
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(child.status)}>{child.status}</Badge>
                  </div>
                  {index < children.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments & Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments ({selectedItem.attachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem.attachments.length === 0 ? (
              <p className="text-sm text-gray-500">No attachments</p>
            ) : (
              <div className="space-y-2">
                {selectedItem.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{attachment}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({selectedItem.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem.comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments</p>
            ) : (
              <div className="space-y-3">
                {selectedItem.comments.map((comment, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
