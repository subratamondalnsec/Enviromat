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
import { getPickerProfile, updatePickerProfile } from '../../services/operations/profileAPI';

const PickerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.profile);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    vehicleDetails: {
      vehicleType: 'Bicycle',
      vehicleNumber: ''
    },
    serviceAreas: [],
    isActive: true
  });

  // Fetch picker profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user._id) {
        try {
          const profileData = await dispatch(getPickerProfile(user._id));
          setProfile(profileData);
          setFormData({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || '',
            contactNumber: profileData.contactNumber || '',
            address: {
              street: profileData.address?.street || '',
              city: profileData.address?.city || '',
              state: profileData.address?.state || '',
              pinCode: profileData.address?.pinCode || ''
            },
            vehicleDetails: {
              vehicleType: profileData.vehicleDetails?.vehicleType || 'Bicycle',
              vehicleNumber: profileData.vehicleDetails?.vehicleNumber || ''
            },
            serviceAreas: profileData.serviceAreas || [],
            isActive: profileData.isActive !== undefined ? profileData.isActive : true
          });
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
              isActive: user.isActive !== undefined ? user.isActive : true
            };
            setProfile(fallbackData);
            setFormData(fallbackData);
          }
        }
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleServiceAreasChange = (e) => {
    const areas = e.target.value.split(',').map(area => area.trim()).filter(area => area);
    setFormData(prev => ({
      ...prev,
      serviceAreas: areas
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      toast.error('User not found');
      return;
    }

    try {
      await dispatch(updatePickerProfile(user._id, formData));
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        contactNumber: profile.contactNumber || '',
        address: profile.address || {
          street: '',
          city: '',
          state: '',
          pinCode: ''
        },
        vehicleDetails: profile.vehicleDetails || {
          vehicleType: 'Bicycle',
          vehicleNumber: ''
        },
        serviceAreas: profile.serviceAreas || [],
        isActive: profile.isActive !== undefined ? profile.isActive : true
      });
    }
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

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-200 rounded-3xl shadow-lg border border-[#57ce7f]"


        >
          {/* Header */}
          <div className="bg-green-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                  <p className="text-green-100">Waste Picker</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {profile?.rating?.average?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-green-100">
                    ({profile?.rating?.count || 0} reviews)
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-4 px-4 py-2 bg-[#D1FADF] text-gray-600 rounded-xl transition-colors flex items-center space-x-2"

                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active for pickup assignments
                      </span>
                    </label>
                  </div>
                </div>

                {/* Address & Vehicle Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Address & Vehicle Details
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="address.pinCode"
                      value={formData.address.pinCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleDetails.vehicleType"
                      value={formData.vehicleDetails.vehicleType}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    >
                      <option value="Bicycle">Bicycle</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleDetails.vehicleNumber"
                      value={formData.vehicleDetails.vehicleNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g. WB 02 1234"
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Areas (comma-separated)
                    </label>
                    <textarea
                      name="serviceAreas"
                      value={formData.serviceAreas.join(', ')}
                      onChange={handleServiceAreasChange}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="e.g. Salt Lake, New Town, Park Street"
                      className={`w-full p-3 border border-gray-300 rounded-lg ${
                        !isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {profile?.creditPoints || 0}
                    </div>
                    <div className="text-sm text-gray-600">Credit Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile?.assignedPickups?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Assigned Pickups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {profile?.assignedDeliveries?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Assigned Deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {profile?.rating?.average?.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PickerProfile;
