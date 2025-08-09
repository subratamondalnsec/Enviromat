// components/pickup/ScheduledPickups.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, User, Package } from 'lucide-react';
import gsap from 'gsap';

const ScheduledPickups = ({ pickups, refSetter }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(listRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }, listRef);

    return () => ctx.revert();
  }, [pickups]);

  return (
    <div 
      ref={refSetter}
      className="bg-white rounded-3xl p-4 md:p-6 shadow-lg h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
          <Package className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-500" />
          Scheduled Pickups
        </h2>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          {pickups.length} Today
        </span>
      </div>

      <div ref={listRef} className="space-y-3 max-h-96 overflow-y-auto">
        {pickups.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No scheduled pickups today</p>
          </div>
        ) : (
          pickups.map((pickup) => (
            <motion.div
              key={pickup.id}
              className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {pickup.customerName}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pickup.wasteType === 'plastic' ? 'bg-green-100 text-green-800' :
                  pickup.wasteType === 'paper' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pickup.wasteType}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{pickup.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{pickup.time}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledPickups;
