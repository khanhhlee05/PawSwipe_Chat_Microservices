import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Mail, MessageSquare, User, Lock, Eye, EyeOff, Loader2, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  })

  const { signup, isSigningUp } = useAuthStore()

  const validateForm = () => { 
    if (!formData.fullName.trim()) return toast.error("Full name is required")
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!formData.password.trim()) return toast.error("Password is required")
    if (formData.password.trim().length < 6) return toast.error("Password is too short")
    if (!formData.role) return toast.error("Please select a role")

    return true 
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const success = validateForm()

    if (success === true){
      signup(formData)
    }
  }
  return (
    <div className="min-h-screen grid lg: grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group ">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PawPrint className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2"> Create Account </h1>
              <p className='text-base-content/60'> Create an account to join vibrant PawSwipe Community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="form-control">
              <label className="label">
                <span className='label-text'>Full Name</span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='size-5 text-base-content/40' />
                </div>
                <input
                  type='text'
                  className={`input input-bordered w-full pl-10`}
                  placeholder='Your Name'
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>


            <div className="form-control">
              <label className="label">
                <span className='label-text'>Email</span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input
                  type='text'
                  className={`input input-bordered w-full pl-10`}
                  placeholder='you@email.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">I am a</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.role === 'user' ? 'border-primary bg-primary/10' : 'border-base-300'
                  }`}>
                  <input
                    type="radio"
                    name="role"
                    className="radio radio-primary"
                    checked={formData.role === 'user'}
                    onChange={() => setFormData({ ...formData, role: 'user' })}
                  />
                  <div>
                    <p className="font-medium">User</p>
                    <p className="text-sm text-base-content/60">Looking to adopt</p>
                  </div>
                </label>

                <label className={`flex items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.role === 'shelter' ? 'border-primary bg-primary/10' : 'border-base-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    className="radio radio-primary"
                    checked={formData.role === 'shelter'}
                    onChange={() => setFormData({ ...formData, role: 'shelter' })}
                  />
                  <div>
                    <p className="font-medium">Shelter</p>
                    <p className="text-sm text-base-content/60">Offering pets</p>
                  </div>
                </label>
              </div>
            </div>
            
            
            <button type = 'submit' className='btn btn-primary w-full' disabled={isSigningUp}>
                  {
                    isSigningUp ? (
                      <>
                        <Loader2 className='size-5 animate-spin'/>
                        Loading...
                      </>
                    ) : ("Create Account")
                  }
            </button>

          </form>

          <div className = "text-center">
            <p className = "text-base-content/60">
                  Already have an account? {" "}
                  <Link to = "/login" className="link link-primary">
                    Sign in 
                  </Link>
            </p>
          </div>
        </div>

      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join the PawSwipe community"
        subtitle="Join PawSwipe to find new home for our adorable friends"
      />

    </div>
  )
}

export default SignUpPage
