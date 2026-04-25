"use client"

import React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogIn, UserPlus, Users, Shield, ArrowLeft } from "lucide-react"
import { ForgotPasswordForm, ResetPasswordForm } from "@/components/auth-forms"

export type AuthMode = 
  | "select-role" 
  | "login" 
  | "login-donor" 
  | "login-volunteer" 
  | "login-admin"
  | "register-donor" 
  | "register-volunteer" 
  | "forgot-password" 
  | "reset-password"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

export function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {mode === "select-role" && (
          <RoleSelection onModeChange={onModeChange} onClose={() => onOpenChange(false)} />
        )}
        {mode === "login-donor" && (
          <DonorLoginForm onModeChange={onModeChange} onClose={() => onOpenChange(false)} />
        )}
        {mode === "login-volunteer" && (
          <VolunteerLoginForm onModeChange={onModeChange} onClose={() => onOpenChange(false)} />
        )}
        {mode === "login-admin" && (
          <AdminLoginForm onModeChange={onModeChange} onClose={() => onOpenChange(false)} />
        )}
        {mode === "register-donor" && (
          <DonorRegisterForm onModeChange={onModeChange} onClose={() => onOpenChange(false)} />
        )}
        {mode === "register-volunteer" && (
          <VolunteerRegisterForm onModeChange={onModeChange} onClose={() => onOpenChange(false)} />
        )}
        {mode === "forgot-password" && (
          <ForgotPasswordForm onModeChange={onModeChange} />
        )}
        {mode === "reset-password" && (
          <ResetPasswordForm onModeChange={onModeChange} />
        )}
      </DialogContent>
    </Dialog>
  )
}

// Role Selection Screen
function RoleSelection({ onModeChange, onClose }: { onModeChange: (m: AuthMode) => void; onClose: () => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5 text-primary" />
          Sign In
        </DialogTitle>
        <DialogDescription>
          Please select your role to continue
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 py-4">
        <Button 
          variant="outline" 
          className="w-full h-12 text-lg font-medium"
          onClick={() => onModeChange("login-donor")}
        >
          <Users className="mr-2 h-5 w-5" />
          Donor Login
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 text-lg font-medium"
          onClick={() => onModeChange("login-volunteer")}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Volunteer Login
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 text-lg font-medium"
          onClick={() => onModeChange("login-admin")}
        >
          <Shield className="mr-2 h-5 w-5" />
          Admin Login
        </Button>
      </div>
    </>
  )
}

// Donor Login Form
function DonorLoginForm({ onModeChange, onClose }: { onModeChange: (m: AuthMode) => void; onClose: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await login(email, password, "donor")
      if (result.success && result.user?.role === "donor") {
        toast.success(`Welcome back, ${result.user.name}!`)
        onClose()
        } else if (result.error?.startsWith("role_mismatch:")) {
        const actualRole = result.error.split(":")[1]
        setError(`You are registered as a ${actualRole}. Please use the ${actualRole.charAt(0).toUpperCase()}${actualRole.slice(1)} login.`)
      } else {
        setError(result.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Donor Login
        </DialogTitle>
        <DialogDescription>
          Please enter your login and password
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

       {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start justify-between gap-2">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="flex-shrink-0 opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-login-email">Username / Email</Label>
          <Input
            id="donor-login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-login-password">Password</Label>
          <Input
            id="donor-login-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={() => onModeChange("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onModeChange("register-donor")}
          >
            Sign Up
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={() => onModeChange("select-role")}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Role Selection
          </button>
        </div>
      </form>
    </>
  )
}

// Volunteer Login Form
function VolunteerLoginForm({ onModeChange, onClose }: { onModeChange: (m: AuthMode) => void; onClose: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await login(email, password, "volunteer")
      if (result.success && result.user?.role === "volunteer") {
        if (result.user.volunteerStatus === "approved") {
          toast.success(`Welcome back, ${result.user.name}!`)
          onClose()
        } else {
          setError("Your account is pending approval. Please wait for admin to approve.")
        }
      } else if (result.error?.startsWith("role_mismatch:")) {
        const actualRole = result.error.split(":")[1]
        setError(`You are registered as a ${actualRole}. Please use the ${actualRole.charAt(0).toUpperCase()}${actualRole.slice(1)} login.`)
      } else {
        setError(result.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Volunteer Login
        </DialogTitle>
        <DialogDescription>
          Please enter your login and password
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start justify-between gap-2">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="flex-shrink-0 opacity-70 hover:opacity-100">✕</button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-login-email">Username / Email</Label>
          <Input
            id="vol-login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-login-password">Password</Label>
          <Input
            id="vol-login-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={() => onModeChange("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onModeChange("register-volunteer")}
          >
            Sign Up
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={() => onModeChange("select-role")}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Role Selection
          </button>
        </div>
      </form>
    </>
  )
}

// Admin Login Form
function AdminLoginForm({ onModeChange, onClose }: { onModeChange: (m: AuthMode) => void; onClose: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await login(email, password, "admin")
      if (result.success && result.user?.role === "admin") {
        toast.success(`Welcome back, ${result.user.name}!`)
        onClose()
        } else if (result.error?.startsWith("role_mismatch:")) {
        const actualRole = result.error.split(":")[1]
        setError(`You are registered as a ${actualRole}. Please use the ${actualRole.charAt(0).toUpperCase()}${actualRole.slice(1)} login.`)
      } else {
        setError(result.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admin Login
        </DialogTitle>
        <DialogDescription>
          Please enter your login and password
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start justify-between gap-2">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="flex-shrink-0 opacity-70 hover:opacity-100">✕</button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-login-email">Username / Email</Label>
          <Input
            id="admin-login-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-login-password">Password</Label>
          <Input
            id="admin-login-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={() => onModeChange("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={() => onModeChange("select-role")}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Role Selection
          </button>
        </div>
      </form>
    </>
  )
}

// Donor Registration Form
function DonorRegisterForm({ onModeChange, onClose }: { onModeChange: (m: AuthMode) => void; onClose: () => void }) {
  const { registerDonor } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    // Validate phone number (must be 11 digits)
    const phoneDigits = form.phone.replace(/\D/g, "")
    if (phoneDigits.length !== 11) {
      setError("Phone number must be exactly 11 digits")
      return
    }
    
    setLoading(true)
    try {
      const result = await registerDonor(form.name, form.email, form.phone, form.address, form.password)
      if (result.success) {
        setSuccess(true)
        toast.success("Registration successful! Please go to login.")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Registration Successful
          </DialogTitle>
          <DialogDescription>
            Your donor account has been created
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Please Go to Login</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account has been registered successfully. Please login with your credentials.
            </p>
          </div>
          <Button onClick={() => onModeChange("login-donor")} className="w-full">
            Go to Login
          </Button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={() => onModeChange("select-role")}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Role Selection
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Donor Registration
        </DialogTitle>
        <DialogDescription>
          Create your donor account
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-name">Full Name</Label>
          <Input id="donor-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-email">Email</Label>
          <Input id="donor-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-phone">Phone (11 digits)</Label>
          <Input 
            id="donor-phone" 
            type="tel" 
            placeholder="01712345678" 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            maxLength={11}
            required 
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-address">Address</Label>
          <Input id="donor-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="donor-password">Password</Label>
          <Input id="donor-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Submit"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button type="button" className="font-medium text-primary hover:underline" onClick={() => onModeChange("login-donor")}>Sign In</button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={() => onModeChange("select-role")}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Role Selection
          </button>
        </div>
      </form>
    </>
  )
}

// Volunteer Registration Form
function VolunteerRegisterForm({ onModeChange, onClose }: { onModeChange: (m: AuthMode) => void; onClose: () => void }) {
  const { registerVolunteer } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", qualifications: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    // Validate phone number (must be 11 digits)
    const phoneDigits = form.phone.replace(/\D/g, "")
    if (phoneDigits.length !== 11) {
      setError("Phone number must be exactly 11 digits")
      return
    }
    
    setLoading(true)
    try {
      const result = await registerVolunteer(form.name, form.email, form.phone, form.qualifications, form.password, form.address)
      if (result.success) {
        setSuccess(true)
        toast.info("Registration submitted! Please wait for admin approval.")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Registration Submitted</DialogTitle>
          <DialogDescription>
            Your volunteer application has been submitted
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Pending Admin Approval</p>
            <p className="mt-1 text-sm text-muted-foreground">
              An admin will review your qualifications and approve your account.
              You will be able to log in once approved.
            </p>
          </div>
          <Button variant="outline" onClick={() => onModeChange("login-volunteer")}>
            Back to Sign In
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Volunteer Registration
        </DialogTitle>
        <DialogDescription>
          Apply to become a volunteer coordinator
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-name">Full Name</Label>
          <Input id="vol-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-email">Email</Label>
          <Input id="vol-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-phone">Phone (11 digits)</Label>
          <Input 
            id="vol-phone" 
            type="tel" 
            placeholder="01712345678" 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            maxLength={11}
            required 
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-address">Address / Service Area</Label>
          <Input 
            id="vol-address" 
            placeholder="e.g., Mirpur, Dhanmondi, Uttara, Khilgaon" 
            value={form.address} 
            onChange={(e) => setForm({ ...form, address: e.target.value })} 
            required 
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-quals">Qualifications</Label>
          <Textarea id="vol-quals" placeholder="Describe your qualifications and experience..." value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="vol-password">Password</Label>
          <Input id="vol-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button type="button" className="font-medium text-primary hover:underline" onClick={() => onModeChange("login-volunteer")}>Sign In</button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={() => onModeChange("select-role")}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Role Selection
          </button>
        </div>
      </form>
    </>
  )
}

