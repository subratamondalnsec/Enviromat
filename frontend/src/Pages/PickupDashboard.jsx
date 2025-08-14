// components/PickupDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { toast } from 'react-hot-toast';

// Import all modular components
import DashboardHeader from '../components/core/PickUpDashboard/DashboardHeader';
import ScheduledPickups from '../components/core/PickUpDashboard/ScheduledPickup';
import EmergencyPickups from '../components/core/PickUpDashboard/EmergencyPickup';
import PickupStatistics from '../components/core/PickUpDashboard/PickupStatistics';
import ProfileEditModal from '../components/core/PickUpDashboard/ProfileEdit';

// Import profile API
import { getPickerProfile } from '../services/operations/profileAPI';

const PickupDashboard = () => {
  const pageRef = useRef(null);
  const scheduledRef = useRef(null);
  const emergencyRef = useRef(null);
  const statsRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.profile);

  // Profile state - will be populated from API
  const [profile, setProfile] = useState(null);

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // TODO: Replace with real API data - Sample scheduled pickups data
  const [scheduledPickups] = useState([
    {
      id: 1,
      customerName: "Priya Sharma",
      location: "Salt Lake City, Kolkata, WB",
      time: "10:00 AM - 11:00 AM",
      wasteType: "plastic"
    },
    {
      id: 2,
      customerName: "Amit Banerjee",
      location: "New Town, Kolkata, WB", 
      time: "11:30 AM - 12:30 PM",
      wasteType: "paper"
    },
    {
      id: 3,
      customerName: "Susmita Roy",
      location: "Park Street, Kolkata, WB",
      time: "2:00 PM - 3:00 PM",
      wasteType: "metal"
    },
    {
      id: 4,
      customerName: "Rahul Das",
      location: "Howrah, WB",
      time: "3:30 PM - 4:30 PM",
      wasteType: "plastic"
    }
  ]);

  // TODO: Replace with real API data - Sample emergency pickups data  
  const [emergencyPickups] = useState([
    {
      id: 101,
      customerName: "Neha Gupta",
      location: "Ballygunge, Kolkata, WB",
      requestedTime: "ASAP",
      priority: "Critical",
      reason: "Overflowing waste bin blocking entrance"
    },
    {
      id: 102,
      customerName: "Sohan Mukherjee", 
      location: "Dumdum, Kolkata, WB",
      requestedTime: "Within 2 hours",
      priority: "High",
      reason: "Medical waste disposal needed urgently"
    }
  ]);

  // TODO: Replace with real API data - Sample monthly statistics data
  const [monthlyStats] = useState({
    days: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug', '7 Aug', '8 Aug'],
    pickups: [5, 8, 6, 9, 7, 10, 8, 12],
    wasteTypes: [45, 30, 15, 25] // Plastic, Paper, Metal, Organic
  });

  // Fetch picker profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.accountType === 'Picker') {
        try {
          // Comment out API call temporarily to avoid infinite loading
          // const profileData = await dispatch(getPickerProfile(user._id));
          // setProfile(profileData);
          
          // Use user data directly for now
          setProfile({
            name: `${user.firstName} ${user.lastName}`,
            pic: user.image,
            email: user.email,
            phone: user.contactNumber || '',
            location: user.address ? `${user.address.city}, ${user.address.state}` : '',
            travelMode: user.vehicleDetails?.vehicleType?.toLowerCase() || 'bike',
            password: ""
          });
        } catch (error) {
          console.error('Failed to fetch picker profile:', error);
          // Use user data as fallback
          setProfile({
            name: `${user.firstName} ${user.lastName}`,
            pic: user.image,
            email: user.email,
            phone: user.contactNumber || '',
            location: user.address ? `${user.address.city}, ${user.address.state}` : '',
            travelMode: user.vehicleDetails?.vehicleType?.toLowerCase() || 'bike',
            password: ""
          });
        }
      } else {
        // Set default profile for demo purposes
        setProfile({
          name: "Demo Picker",
          pic: "",
          email: "picker@demo.com",
          phone: "+91 9800112233",
          location: "Kolkata, WB",
          travelMode: "bike",
          password: ""
        });
      }
    };

    fetchProfile();
  }, [user]);

  // Handle profile edit
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditModal(false);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const elements = [
        scheduledRef.current,
        emergencyRef.current,
        statsRef.current
      ].filter(Boolean);

      gsap.set(elements, {
        y: 30,
        opacity: 0
      });

      const tl = gsap.timeline();
      tl.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, [profile]);

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show fallback if no profile data available
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      ref={pageRef}
    >
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardHeader 
          profile={profile}
          onEditProfile={handleEditProfile}
        />
      </motion.div>

      <div className="p-8 space-y-8">
        {/* Top section - Scheduled and Emergency Pickups side by side */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left section - Scheduled Pickups */}
          <div 
            className="flex-1"
            ref={scheduledRef}
          >
            <ScheduledPickups pickups={scheduledPickups} />
          </div>

          {/* Right section - Emergency Pickups */}
          <div 
            className="flex-1"
            ref={emergencyRef}
          >
            <EmergencyPickups emergencies={emergencyPickups} />
          </div>
        </div>

        {/* Bottom section - Statistics (full width) */}
        <div ref={statsRef}>
          <PickupStatistics monthlyData={monthlyStats} />
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PickupDashboard;
