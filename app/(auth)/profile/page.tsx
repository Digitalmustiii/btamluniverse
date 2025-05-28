'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Camera, Edit3, Save, X, LogOut, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  location?: string
  avatar_url?: string
  bio?: string
  custom_uid?: string
  created_at: string
}

export default function Profile() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [formData, setFormData] = useState({
    fullName: '', 
    phone: '', 
    location: '', 
    bio: ''
  })
  const [passwordData, setPasswordData] = useState({
    current: '', 
    new: '', 
    confirm: '', 
    show: false, 
    visible: false
  })

  const showMessage = useCallback((text: string, type: 'success' | 'error') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }, [])

  const generateCustomUID = useCallback(() => {
    const timestamp = Date.now().toString(36).slice(-6).toUpperCase()
    const random = Math.random().toString(36).slice(-4).toUpperCase()
    return `BTAML-${timestamp}-${random}`
  }, [])

  const handleBackToHome = useCallback(() => {
    router.push('/')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }, [router])

  const fetchProfile = useCallback(async () => {
    try {
      console.log('Starting fetchProfile...')
      setLoading(true)
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      console.log('Auth user:', authUser, 'Auth error:', authError)
      
      if (authError || !authUser) {
        console.log('No auth user, redirecting to login')
        router.push('/login')
        return
      }

      console.log('Fetching profile for user:', authUser.id)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log('Profile data:', profileData, 'Profile error:', profileError)

      let profile: UserProfile

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create new one
        console.log('Creating new profile...')
        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || '',
          phone: authUser.user_metadata?.phone || '',
          location: authUser.user_metadata?.location || '',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          bio: authUser.user_metadata?.bio || '',
          custom_uid: generateCustomUID(),
          created_at: authUser.created_at
        }

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (insertError) {
          console.error('Failed to create profile:', insertError)
          showMessage('Failed to create profile', 'error')
          setLoading(false)
          return
        }

        profile = insertedProfile
      } else if (profileError) {
        // Other database error
        console.error('Database error:', profileError)
        showMessage('Database error: ' + profileError.message, 'error')
        setLoading(false)
        return
      } else {
        profile = profileData
        // Generate custom_uid if missing
        if (!profile.custom_uid) {
          const customUID = generateCustomUID()
          await supabase
            .from('profiles')
            .update({ custom_uid: customUID })
            .eq('id', authUser.id)
          profile.custom_uid = customUID
        }
      }

      console.log('Setting user profile:', profile)
      setUser(profile)
      setFormData({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || ''
      })

    } catch (err) {
      console.error('Profile fetch error:', err)
      showMessage('Failed to load profile: ' + (err as Error).message, 'error')
    } finally {
      console.log('fetchProfile completed, setting loading to false')
      setLoading(false)
    }
  }, [router, generateCustomUID, showMessage])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    if (file.size > 2 * 1024 * 1024) {
      showMessage('Image must be smaller than 2MB', 'error')
      return
    }

    setSaving(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName)

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      await fetchProfile()
      showMessage('Avatar updated successfully!', 'success')
    } catch (err) {
      console.error('Avatar upload error:', err)
      showMessage('Failed to upload avatar', 'error')
    } finally {
      setSaving(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async () => {
    if (!user || !formData.fullName.trim()) {
      showMessage('Full name is required', 'error')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      // Update the current user state instead of refetching
      setUser(prev => prev ? { ...prev, ...updateData } : null)
      setEditing(false)
      showMessage('Profile updated successfully!', 'success')
    } catch (err) {
      console.error('Profile update error:', err)
      showMessage('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      showMessage('New passwords do not match', 'error')
      return
    }
    if (passwordData.new.length < 6) {
      showMessage('Password must be at least 6 characters', 'error')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.new })
      if (error) throw error

      setPasswordData({ current: '', new: '', confirm: '', show: false, visible: false })
      showMessage('Password updated successfully!', 'success')
    } catch (err) {
      console.error('Password update error:', err)
      showMessage('Failed to update password', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (err) {
      console.error('Sign out error:', err)
      showMessage('Failed to sign out', 'error')
    }
  }

  const cancelEdit = useCallback(() => {
    if (!user) return
    setEditing(false)
    setFormData({
      fullName: user.full_name || '',
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || ''
    })
  }, [user])

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log('useEffect triggered, calling fetchProfile')
    fetchProfile()
  }, [fetchProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F4007] via-[#1a6b0f] to-[#0F4007] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F4007] via-[#1a6b0f] to-[#0F4007] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
          <p className="mb-4">Unable to load your profile data.</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4007] via-[#1a6b0f] to-[#0F4007] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button 
          onClick={handleBackToHome}
          className="inline-flex items-center text-white hover:text-green-200 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-white/95 rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0F4007] to-[#1a6b0f] rounded-full flex items-center justify-center text-white overflow-hidden">
                  {user.avatar_url ? (
                    <Image 
                      src={user.avatar_url} 
                      alt="User Avatar" 
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  <Camera size={16} className="text-gray-600" />
                </button>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.full_name || 'User'}</h2>
              <p className="text-gray-600 text-sm mb-4">{user.email}</p>
              <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                ID: {user.custom_uid || 'Generating...'}
              </p>
            </div>

            <button 
              onClick={handleSignOut} 
              className="w-full mt-6 flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white/95 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)} 
                    className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={cancelEdit} 
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile} 
                      disabled={saving} 
                      className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'fullName', required: true },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Location', key: 'location' },
                  { label: 'Email', key: 'email', readonly: true, value: user.email }
                ].map(({ label, key, required, readonly, value }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {editing && !readonly ? (
                      <input 
                        type="text"
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {value || formData[key as keyof typeof formData] || 'Not provided'}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {editing ? (
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {formData.bio || 'No bio provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white/95 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Change Password</h3>
                {!passwordData.show && (
                  <button 
                    onClick={() => setPasswordData(prev => ({ ...prev, show: true }))} 
                    className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {passwordData.show && (
                <div className="space-y-4">
                  {[
                    { field: 'current', label: 'Current Password', type: passwordData.visible ? 'text' : 'password' },
                    { field: 'new', label: 'New Password', type: 'password' },
                    { field: 'confirm', label: 'Confirm Password', type: 'password' }
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <div className="relative">
                        <input 
                          type={type}
                          value={passwordData[field as keyof typeof passwordData] as string}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {field === 'current' && (
                          <button 
                            type="button"
                            onClick={() => setPasswordData(prev => ({ ...prev, visible: !prev.visible }))} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordData.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setPasswordData({ current: '', new: '', confirm: '', show: false, visible: false })} 
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePasswordChange} 
                      disabled={saving || !passwordData.current || !passwordData.new || !passwordData.confirm} 
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}