"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { store } from "@/lib/store"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Camera,
  Package,
  Truck,
  CheckCircle,
  Upload,
  MapPin,
  User,
} from "lucide-react"
import type { Task, TaskStatus } from "@/lib/types"

export function VolunteerUploadProof() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [proofDialogOpen, setProofDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [proofType, setProofType] = useState<"pickup" | "delivery">("pickup")
  const [proofUrl, setProofUrl] = useState("")

  const loadTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await store.getVolunteerTasks(user.id)
    setTasks(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  if (!user) return null

  const activeTasks = tasks.filter((t) => t.status === "in-progress")

  async function handleUploadProof() {
    if (!selectedTask) return

    try {
      // For pickup proof
      if (proofType === "pickup") {
        await fetch(`/api/tasks/${selectedTask.id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pickupPhotoUrl: proofUrl }),
        })
        toast.success("Pickup proof uploaded successfully!")
      } else {
        // For delivery proof
        await fetch(`/api/tasks/${selectedTask.id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryPhotoUrl: proofUrl }),
        })
        toast.success("Delivery proof uploaded successfully!")
      }
      setProofDialogOpen(false)
      setProofUrl("")
      loadTasks()
    } catch {
      toast.error("Failed to upload proof")
    }
  }

  function openProofDialog(task: Task, type: "pickup" | "delivery") {
    setSelectedTask(task)
    setProofType(type)
    setProofUrl("")
    setProofDialogOpen(true)
  }

  function TaskProofCard({ task }: { task: Task }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {task.donationType} Pickup
            </span>
            <Badge className="bg-chart-3/20 text-foreground">In Progress</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Donor Info */}
          <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Donor: {task.donorName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{task.location}</span>
            </div>
          </div>

          {/* Proof Buttons */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Upload Proof</p>
            
            {/* Pickup Proof */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Before Pickup</span>
                  {task.pickupPhotoUrl ? (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="h-3 w-3" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not uploaded</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant={task.pickupPhotoUrl ? "outline" : "default"}
                onClick={() => openProofDialog(task, "pickup")}
              >
                {task.pickupPhotoUrl ? "Update" : "Upload"}
              </Button>
            </div>

            {/* Delivery Proof */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">After Delivery</span>
                  {task.deliveryPhotoUrl ? (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="h-3 w-3" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not uploaded</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant={task.deliveryPhotoUrl ? "outline" : "default"}
                onClick={() => openProofDialog(task, "delivery")}
                disabled={!task.pickupPhotoUrl}
              >
                {task.deliveryPhotoUrl ? "Update" : "Upload"}
              </Button>
            </div>
          </div>

          {/* Complete Button */}
          {task.pickupPhotoUrl && task.deliveryPhotoUrl && (
            <Button
              className="w-full"
              onClick={async () => {
                await store.updateTaskStatus(task.id, "completed")
                toast.success("Task completed!")
                loadTasks()
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Proof</h1>
        <p className="text-muted-foreground">
          Upload proof photos for your active pickup tasks
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading tasks...</p>
          </CardContent>
        </Card>
      ) : activeTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No active tasks. Start a task from My Tasks tab to upload proof.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeTasks.map((task) => (
            <TaskProofCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Proof Upload Dialog */}
      <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload {proofType === "pickup" ? "Pickup" : "Delivery"} Proof
            </DialogTitle>
            <DialogDescription>
              {proofType === "pickup"
                ? "Take a photo of the items before picking them up"
                : "Take a photo after delivering the items"}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="font-medium text-foreground">
                  {selectedTask.donationType} from {selectedTask.donorName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedTask.location}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="proof-url">Photo URL</Label>
                <Input
                  id="proof-url"
                  placeholder="https://example.com/photo.jpg"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to your proof photo
                </p>
              </div>
              <Button onClick={handleUploadProof}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Proof
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
