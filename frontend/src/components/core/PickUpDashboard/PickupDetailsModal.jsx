import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, User, Package, AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import gsap from 'gsap';

const PickupDetailsModal = ({ 
  pickup, 
  isOpen, 
  onClose, 
  onMarkSuccessful 
}) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      const ctx = gsap.context(() => {
        gsap.fromTo(modalRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }, modalRef);

      return () => {
        document.body.style.overflow = 'unset';
        ctx.revert();
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!pickup) return null;

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatWasteType = (wasteType) => {
    return wasteType.replace('_', ' ').toUpperCase();
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''}${address.pinCode ? ` - ${address.pinCode}` : ''}`.replace(/^,\s*/, '');
  };

  const handleMarkSuccessful = async () => {
    if (pickup.pickupStatus === 'delivered') {
      toast.error('This pickup has already been marked as delivered');
      return;
    }

    try {
      await onMarkSuccessful(pickup._id, pickup.isEmergency);
      onClose();
    } catch (error) {
      console.error('Error marking pickup as successful:', error);
      toast.error('Failed to update pickup status');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 max-h-64"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {pickup.isEmergency ? (
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
                ) : (
                  <Package className="w-6 h-6 mr-2 text-green-500" />
                )}
                {pickup.isEmergency ? 'Emergency Pickup' : 'Scheduled Pickup'} Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(pickup.pickupStatus)}`}>
                {pickup.pickupStatus.toUpperCase()}
              </span>
              {pickup.isEmergency && (
                <span className="ml-2 inline-flex items-center px-3 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200">
                  URGENT
                </span>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {pickup.userId?.firstName} {pickup.userId?.lastName}
                </p>
                {pickup.userId?.contactNumber && (
                  <p className="text-gray-700 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                    <span className="font-medium">Contact:</span> {pickup.userId.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Pickup Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Pickup Address:</p>
                  <p className="text-gray-700">{formatAddress(pickup.address)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Scheduled Date:</p>
                  <p className="text-gray-700">{new Date(pickup.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Waste Type:</p>
                  <p className="text-gray-700">{formatWasteType(pickup.wasteType)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Kg</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Quantity:</p>
                  <p className="text-gray-700">{pickup.quantity} kg</p>
                </div>
              </div>
            </div>

            {/* Waste Image */}
            {pickup.imageURL && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Waste Image</h3>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={pickup.imageURL}
                    alt="Waste"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              
              {pickup.pickupStatus !== 'delivered' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMarkSuccessful}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark as Successful
                </motion.button>
              )}

              {pickup.pickupStatus === 'delivered' && (
                <div className="flex-1 px-6 py-3 bg-green-100 text-green-700 rounded-2xl font-medium flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Pickup Completed
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PickupDetailsModal;
