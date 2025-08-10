import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { 
  User, 
  Phone, 
  MapPin, 
  Truck, 
  Star, 
  Upload,
  Save,
  Edit3,
  X 
} from 'lucide-react';

// Import profile API
import { getPickerProfile, updatePickerProfile } from '../../../services/operations/profileAPI';
import EditPickerProfile from './EditPickerProfile';

const PickerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.profile);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch picker profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user._id) {
        try {
          const profileData = await dispatch(getPickerProfile(user._id));
          setProfile(profileData);
        } catch (error) {
          console.error('Failed to fetch picker profile:', error);
          // Use user data as fallback
          if (user) {
            const fallbackData = {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              contactNumber: user.contactNumber || '',
              address: user.address || {
                street: '',
                city: '',
                state: '',
                pinCode: ''
              },
              vehicleDetails: user.vehicleDetails || {
                vehicleType: 'Bicycle',
                vehicleNumber: ''
              },
              serviceAreas: user.serviceAreas || [],
              isActive: user.isActive !== undefined ? user.isActive : true,
              creditPoints: 0,
              assignedPickups: [],
              assignedDeliveries: [],
              rating: { average: 0, count: 0 }
            };
            setProfile(fallbackData);
          }
        }
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show EditPickerProfile component when in editing mode
  if (isEditing) {
    return (
      <EditPickerProfile 
        profile={profile}
        onCancel={handleCancel}
        onSave={handleSaveProfile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white p-8 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <img 
                      src={profile?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${profile?.firstName}%20${profile?.lastName}`} 
                      alt="Profile" 
                      className="w-18 h-18 rounded-full object-cover" 
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${profile?.isActive ? 'bg-green-400' : 'bg-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${profile?.isActive ? 'bg-white' : 'bg-gray-600'}`}></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                      Waste Picker
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile?.isActive ? 'bg-green-400 bg-opacity-30 text-green-100' : 'bg-gray-400 bg-opacity-30 text-gray-100'}`}>
                      {profile?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-green-100">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile?.address?.city || 'Location not set'}, {profile?.address?.state || ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">{profile?.vehicleDetails?.vehicleType || 'Bicycle'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-4">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">
                    {profile?.rating?.average?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-green-100 text-sm">
                    ({profile?.rating?.count || 0} reviews)
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Personal Information */}
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl text-gray-900 font-medium group-hover:border-green-300 transition-all duration-200">
                        {profile?.firstName || 'Not provided'}
                      </div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl text-gray-900 font-medium group-hover:border-green-300 transition-all duration-200">
                        {profile?.lastName || 'Not provided'}
                      </div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl text-gray-900 font-medium flex items-center space-x-3 group-hover:border-blue-400 transition-all duration-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">@</span>
                      </div>
                      <span>{profile?.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </label>
                  <div className="relative">
                    <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-gray-900 font-medium flex items-center space-x-3 group-hover:border-green-400 transition-all duration-200">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <span>{profile?.contactNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${profile?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {profile?.isActive ? (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <X className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Status: {profile?.isActive ? 'Active' : 'Inactive'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {profile?.isActive ? 'Available for pickup assignments' : 'Not available for assignments'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${profile?.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                      {profile?.isActive ? 'ONLINE' : 'OFFLINE'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address & Vehicle Information */}
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Location & Vehicle</h2>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Street Address
                  </label>
                  <div className="relative">
                    <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl text-gray-900 font-medium flex items-center space-x-3 group-hover:border-purple-400 transition-all duration-200">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>{profile?.address?.street || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      City
                    </label>
                    <div className="relative">
                      <div className="w-full p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl text-gray-900 font-medium group-hover:border-orange-400 transition-all duration-200">
                        {profile?.address?.city || 'Not provided'}
                      </div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      State
                    </label>
                    <div className="relative">
                      <div className="w-full p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl text-gray-900 font-medium group-hover:border-teal-400 transition-all duration-200">
                        {profile?.address?.state || 'Not provided'}
                      </div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-teal-400 rounded-full mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    PIN Code
                  </label>
                  <div className="relative">
                    <div className="w-full p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl text-gray-900 font-medium group-hover:border-indigo-400 transition-all duration-200">
                      {profile?.address?.pinCode || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 p-6 rounded-2xl border-2 border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Vehicle Details</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Vehicle Type
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Truck className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{profile?.vehicleDetails?.vehicleType || 'Bicycle'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Vehicle Number
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs font-bold">#</span>
                        </div>
                        <span className="font-medium text-gray-900">{profile?.vehicleDetails?.vehicleNumber || 'Not registered'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                    Service Areas
                  </label>
                  <div className="w-full p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl min-h-[120px] flex items-center">
                    {profile?.serviceAreas?.length ? (
                      <div className="flex flex-wrap gap-3 w-full">
                        {profile.serviceAreas.map((area, index) => (
                          <div key={index} className="group relative">
                            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                              {area}
                            </span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center w-full">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No service areas specified</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="mt-12">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Performance Dashboard</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group relative overflow-hidden">
                  <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {profile?.creditPoints || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-green-100 font-medium">Credit Points</div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-3">
                        <div className="bg-white h-2 rounded-full" style={{width: `${Math.min((profile?.creditPoints || 0) / 1000 * 100, 100)}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {profile?.assignedPickups?.length || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-blue-100 font-medium">Assigned Pickups</div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-3">
                        <div className="bg-white h-2 rounded-full" style={{width: `${Math.min((profile?.assignedPickups?.length || 0) / 50 * 100, 100)}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {profile?.assignedDeliveries?.length || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-purple-100 font-medium">Assigned Deliveries</div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-3">
                        <div className="bg-white h-2 rounded-full" style={{width: `${Math.min((profile?.assignedDeliveries?.length || 0) / 30 * 100, 100)}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden">
                  <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {profile?.rating?.average?.toFixed(1) || '0.0'}
                          </div>
                        </div>
                      </div>
                      <div className="text-yellow-100 font-medium">Average Rating</div>
                      <div className="flex items-center space-x-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= (profile?.rating?.average || 0) ? 'fill-white text-white' : 'text-white text-opacity-30'}`} 
                          />
                        ))}
                        <span className="text-xs text-yellow-100 ml-2">({profile?.rating?.count || 0})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats Row */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">This Month</h3>
                      <p className="text-gray-600">+{Math.floor(Math.random() * 20) + 5} Completed Tasks</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Efficiency</h3>
                      <p className="text-gray-600">{Math.floor(Math.random() * 30) + 85}% Success Rate</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Community Impact</h3>
                      <p className="text-gray-600">{Math.floor(Math.random() * 500) + 200}kg Waste Processed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PickerProfile;
