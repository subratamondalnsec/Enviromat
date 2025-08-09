// components/checkout/ProgressSteps.jsx
import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between max-w-md mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep >= step.number
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-6 h-6" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`ml-2 font-medium ${
                currentStep >= step.number
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-44 h-0.5 mx-4 ${
                currentStep > step.number ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;
