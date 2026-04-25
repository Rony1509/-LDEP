"use client"

import { useState, useEffect } from "react"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, User, Clock } from "lucide-react"
import { toast } from "sonner"

interface Message {
  _id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: string
}

export function ContactMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    try {
      const data = await store.getContactMessages()
      setMessages(data)
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(message: Message) {
    if (!message.isRead) {
      const result = await store.markContactMessageRead(message._id)
      if (!result.success) {
        console.warn("Could not mark message as read (may be deleted):", result.error)
        // Still allow viewing the message even if mark as read fails
      } else {
        setMessages(messages.map(m => 
          m._id === message._id ? { ...m, isRead: true } : m
        ))
      }
    }
    setSelectedMessage(message)
  }

  async function deleteMessage(messageId: string) {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    try {
      await store.deleteContactMessage(messageId)
      setMessages(messages.filter(m => m._id !== messageId))
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null)
      }
      toast.success("Message deleted")
    } catch (error) {
      toast.error("Failed to delete message")
    }
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading messages...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Message List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contact Messages</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} unread</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No messages yet</p>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedMessage?._id === message._id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:bg-muted/50"
                  } ${!message.isRead ? "bg-primary/5" : ""}`}
                  onClick={() => markAsRead(message)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium truncate">{message.name}</span>
                        {!message.isRead && (
                          <Badge className="h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMessage(message._id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedMessage.email}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="border-t pt-4 text-sm text-muted-foreground">
                <p>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

