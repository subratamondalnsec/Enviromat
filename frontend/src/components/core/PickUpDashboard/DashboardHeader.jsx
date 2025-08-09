// components/pickup/DashboardHeader.jsx
import React from 'react';
import { motion } from 'motion/react';
import { User, Edit3, MapPin } from 'lucide-react';

const DashboardHeader = ({ profile, onEditClick }) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-4 md:p-6 text-white mb-4 md:mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <img
              src={profile.pic}
              alt={profile.name}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{profile.name}</h1>
            <p className="text-green-100 text-sm md:text-base flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {profile.location}
            </p>
            <p className="text-green-100 text-xs md:text-sm">
              Travel Mode: {profile.travelMode}
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEditClick}
          className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
          aria-label="Edit Profile"
        >
          <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
        </motion.button>
      </div>
    </div>
  );
};

export default DashboardHeader;
