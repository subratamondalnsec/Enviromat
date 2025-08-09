// components/pickup/EmergencyPickups.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, MapPin, Clock, User, Zap } from 'lucide-react';
import gsap from 'gsap';

const EmergencyPickups = ({ emergencies, refSetter }) => {
  const listRef = useRef(null);

  // Add null check for emergencies
  const safeEmergencies = emergencies || [];

  useEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(listRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }, listRef);

    return () => ctx.revert();
  }, [safeEmergencies]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      ref={refSetter}
      className="bg-white rounded-3xl p-4 md:p-6 shadow-lg h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-red-600 flex items-center">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          Emergency Pickups
        </h2>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
          {safeEmergencies.length} Urgent
        </span>
      </div>

      <div ref={listRef} className="space-y-3 max-h-96 overflow-y-auto">
        {safeEmergencies.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No emergency pickups</p>
          </div>
        ) : (
          safeEmergencies.map((emergency) => (
            <motion.div
              key={emergency.id}
              className="border-l-4 border-red-500 bg-red-50 rounded-2xl p-4 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {emergency.customerName}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(emergency.priority)}`}>
                  {emergency.priority}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="truncate">{emergency.location}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-red-500" />
                  <span>{emergency.requestedTime}</span>
                </div>
                <p className="text-sm text-red-700 font-medium">
                  {emergency.reason}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyPickups;
