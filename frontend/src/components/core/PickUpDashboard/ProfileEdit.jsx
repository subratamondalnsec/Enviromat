// components/pickup/ProfileEditModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Lock, Bike, Truck } from 'lucide-react';
import gsap from 'gsap';

const ProfileEditModal = ({ isOpen, profile, onSave, onClose }) => {
  const [formData, setFormData] = useState(profile);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      if (modalRef.current) {
        gsap.fromTo(modalRef.current,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    }
  }, [isOpen, profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    onSave(formData);
  };

  const travelModes = [
    { value: 'bike', label: 'Bike', icon: <Bike className="w-5 h-5" /> },
    { value: 'cycle', label: 'Cycle', icon: <Bike className="w-5 h-5" /> },
    { value: 'e-scooter', label: 'E-Scooter', icon: <Bike className="w-5 h-5" /> },
    { value: 'mini-truck', label: 'Mini-Truck', icon: <Truck className="w-5 h-5" /> }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4"

        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 relative max-h-[95vh] overflow-y-auto"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            {/* <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                New Password (optional)
              </label>
              <input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword || ''}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your new password"
              />
            </div>

            {/* Travel Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mode of Travel *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {travelModes.map((mode) => (
                  <label
                    key={mode.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.travelMode === mode.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="travelMode"
                      value={mode.value}
                      checked={formData.travelMode === mode.value}
                      onChange={(e) => handleChange('travelMode', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      {mode.icon}
                      <span className="font-medium">{mode.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileEditModal;
