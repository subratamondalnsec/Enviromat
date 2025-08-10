// Test file to verify profile completeness logic
import { isPickerProfileComplete, getMissingProfileFields } from '../utils/profileUtils';

// Test cases for profile completeness
console.log('Testing profile completeness logic...');

// Complete profile
const completeProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  contactNumber: '1234567890',
  address: {
    street: '123 Main St',
    city: 'Kolkata',
    state: 'WB',
    pinCode: '700001'
  },
  vehicleDetails: {
    vehicleType: 'Bicycle',
    vehicleNumber: 'WB12345'
  },
  serviceAreas: ['Salt Lake', 'New Town'],
  isActive: true
};

// Incomplete profile (missing contact number)
const incompleteProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  contactNumber: '', // Missing
  address: {
    street: '123 Main St',
    city: 'Kolkata',
    state: 'WB',
    pinCode: '700001'
  },
  vehicleDetails: {
    vehicleType: 'Bicycle',
    vehicleNumber: 'WB12345'
  },
  serviceAreas: ['Salt Lake', 'New Town'],
  isActive: true
};

// Empty profile
const emptyProfile = null;

console.log('Complete profile:', isPickerProfileComplete(completeProfile)); // Should be true
console.log('Incomplete profile:', isPickerProfileComplete(incompleteProfile)); // Should be false
console.log('Empty profile:', isPickerProfileComplete(emptyProfile)); // Should be false

console.log('Missing fields for complete profile:', getMissingProfileFields(completeProfile)); // Should be []
console.log('Missing fields for incomplete profile:', getMissingProfileFields(incompleteProfile)); // Should include 'Contact Number'
console.log('Missing fields for empty profile:', getMissingProfileFields(emptyProfile)); // Should include all fields
