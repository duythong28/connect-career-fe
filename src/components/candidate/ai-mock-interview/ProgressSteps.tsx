import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Tell Us' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Ready' }
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          <div className={`flex flex-col items-center ${idx > 0 ? 'ml-4' : ''}`}>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                step.number === currentStep
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-lg'
                  : step.number < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}
            >
              {step.number < currentStep ? <Check className="w-6 h-6" /> : step.number}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                step.number === currentStep ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < 3 && (
            <div
              className={`w-16 h-1 mx-2 mt-[-20px] rounded transition-all ${
                step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;