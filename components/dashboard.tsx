"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project-sidebar"
import { MainContent } from "@/components/main-content"
import { ItemModal } from "@/components/item-modal"
import { mockData, type WorkItem } from "@/lib/mock-data"
import { LogOut, Plus } from "lucide-react"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [modalType, setModalType] = useState<"epic" | "story" | "task" | "subtask">("epic")
  const [modalParent, setModalParent] = useState<WorkItem | null>(null)
  const [data, setData] = useState(mockData)

  const handleCreateItem = (type: "epic" | "story" | "task" | "subtask", parent?: WorkItem) => {
    setModalMode("create")
    setModalType(type)
    setModalParent(parent || null)
    setIsModalOpen(true)
  }

  const handleEditItem = (item: WorkItem) => {
    setModalMode("edit")
    setModalType(item.type)
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSaveItem = (itemData: Partial<WorkItem>) => {
    if (modalMode === "create") {
      const newItem: WorkItem = {
        id: Date.now().toString(),
        type: modalType,
        parentId: modalParent?.id || null,
        title: itemData.title || "",
        description: itemData.description || "",
        assignee: itemData.assignee || "",
        status: itemData.status || "new",
        priority: itemData.priority || "normal",
        estimatedTime: itemData.estimatedTime || 0,
        progress: itemData.progress || 0,
        estimatedStartDate: itemData.estimatedStartDate || "",
        estimatedEndDate: itemData.estimatedEndDate || "",
        actualStartDate: itemData.actualStartDate || "",
        actualEndDate: itemData.actualEndDate || "",
        attachments: itemData.attachments || [],
        comments: itemData.comments || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setData([...data, newItem])
    } else if (selectedItem) {
      setData(
        data.map((item) =>
          item.id === selectedItem.id ? { ...item, ...itemData, updatedAt: new Date().toISOString() } : item,
        ),
      )
    }
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleDeleteItem = (item: WorkItem) => {
    // Delete item and all its children
    const itemsToDelete = [item.id]
    const findChildren = (parentId: string) => {
      data.forEach((d) => {
        if (d.parentId === parentId) {
          itemsToDelete.push(d.id)
          findChildren(d.id)
        }
      })
    }
    findChildren(item.id)

    setData(data.filter((d) => !itemsToDelete.includes(d.id)))
    if (selectedItem?.id === item.id) {
      setSelectedItem(null)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <Button size="sm" onClick={() => handleCreateItem("epic")} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Epic
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ProjectSidebar
              data={data}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              onCreateItem={handleCreateItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 overflow-auto">
            <MainContent
              selectedItem={selectedItem}
              data={data}
              onEditItem={handleEditItem}
              onCreateItem={handleCreateItem}
            />
          </main>
        </SidebarInset>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        type={modalType}
        item={selectedItem}
        onSave={handleSaveItem}
      />
    </SidebarProvider>
  )
}
