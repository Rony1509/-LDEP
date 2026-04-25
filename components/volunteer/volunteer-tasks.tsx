"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { store } from "@/lib/store"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, CheckCircle, Upload, Clock, Image } from "lucide-react"
import type { Task, TaskStatus } from "@/lib/types"

const statusColor: Record<TaskStatus, string> = {
  pending: "bg-accent text-accent-foreground",
  "in-progress": "bg-chart-3/20 text-foreground",
  completed: "bg-success text-success-foreground",
}

export function VolunteerTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string>("")

  const loadTasks = useCallback(async () => {
    if (!user) return
    const data = await store.getVolunteerTasks(user.id)
    setTasks(data)
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  if (!user) return null

  const pending = tasks.filter((t) => t.status === "pending")
  const inProgress = tasks.filter((t) => t.status === "in-progress")
  const completed = tasks.filter((t) => t.status === "completed")

  async function handleStartTask(taskId: string) {
    await store.updateTaskStatus(taskId, "in-progress")
    toast.success("Task marked as in progress.")
    loadTasks()
  }

  function openCompleteDialog(task: Task) {
    setSelectedTask(task)
    setProofFile(null)
    setProofPreview("")
    setCompleteDialogOpen(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setProofFile(file)
    const reader = new FileReader()
    reader.onload = () => setProofPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleComplete() {
    if (!selectedTask) return
    if (!proofPreview) {
  toast.error("Please wait for photo to load")
  return
}
const proofUrl = proofPreview
    await store.updateTaskStatus(selectedTask.id, "completed", proofUrl)
    toast.success("Task completed successfully!")
    setCompleteDialogOpen(false)
    setSelectedTask(null)
    loadTasks()
  }

  function TaskTable({ taskList }: { taskList: Task[] }) {
    if (taskList.length === 0) {
      return (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">No tasks found.</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Pickup Location</TableHead>
              
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Proof Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskList.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.donorName}</TableCell>
                <TableCell>{t.donorPhone || "—"}</TableCell>
                <TableCell>{t.donationType}</TableCell>
                <TableCell>{t.location}</TableCell>
                
                <TableCell>
                  <Badge className={statusColor[t.status]}>
                    {t.status === "in-progress"
                      ? "In Progress"
                      : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {t.status === "pending" && (
                    <Button size="sm" onClick={() => handleStartTask(t.id)}>
                      <Play className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                  )}
                  {t.status === "in-progress" && (
                    <Button size="sm" onClick={() => openCompleteDialog(t)}>
                      <Upload className="mr-1 h-3 w-3" />
                      Upload Proof
                    </Button>
                  )}
                  {t.status === "completed" && (
                    <span className="flex items-center gap-1 text-sm text-success">
                      <CheckCircle className="h-3 w-3" />
                      Done
                    </span>
                  )}
                </TableCell>
                <TableCell>
  {t.pickupPhotoUrl || t.proofPhotoUrl ? (
    <button
      className="text-sm text-primary underline hover:opacity-80"
      onClick={() => {
        const url = t.pickupPhotoUrl || t.proofPhotoUrl;
        if (!url) return;

        if (url.startsWith("data:")) {
          const [header, data] = url.split(",");
          const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
          const byteChars = atob(data);
          const byteArr = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteArr[i] = byteChars.charCodeAt(i);
          }
          const blob = new Blob([byteArr], { type: mime });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");
        } else {
          window.open(url, "_blank");
        }
      }}
    >
      View
    </button>
  ) : (
    <span className="text-sm text-muted-foreground">—</span>
  )}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
        <p className="text-muted-foreground">
          View and manage your assigned pickup tasks
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="gap-1">
            <Play className="h-3.5 w-3.5" />
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskTable taskList={tasks} />
        </TabsContent>
        <TabsContent value="pending">
          <TaskTable taskList={pending} />
        </TabsContent>
        <TabsContent value="in-progress">
          <TaskTable taskList={inProgress} />
        </TabsContent>
        <TabsContent value="completed">
          <TaskTable taskList={completed} />
        </TabsContent>
      </Tabs>

      {/* Complete Task Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Proof Photo
            </DialogTitle>
            <DialogDescription>
              ছবি তুলে upload করুন। Upload হলে task automatically completed হবে।
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="font-medium text-foreground">
                  {selectedTask.donationType} — {selectedTask.donorName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedTask.location}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="proof-file">Proof Photo</Label>
                <Input
                  id="proof-file"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Mobile থেকে সরাসরি camera দিয়ে তুলতে পারবেন
                </p>
              </div>

              {proofPreview && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Preview:</p>
                  <img
                    src={proofPreview}
                    alt="Proof preview"
                    className="max-h-48 rounded-lg object-contain border border-border"
                  />
                </div>
              )}

              <Button onClick={handleComplete} disabled={!proofFile}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm & Complete Task
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}