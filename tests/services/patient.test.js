import { findOrCreatePatient, registerPatient } from '../../src/services/patient.js';
import { Patient } from '../../src/models/patient.js';

// Mock the Patient model
jest.mock('../../src/models/patient.js');

describe('Patient Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreatePatient', () => {
    it('should return existing patient if found', async () => {
      const mockPatient = { phone: '+1234567890', name: 'John' };
      Patient.findOne.mockResolvedValue(mockPatient);

      const result = await findOrCreatePatient('+1234567890');

      expect(Patient.findOne).toHaveBeenCalledWith({ phone: '+1234567890' });
      expect(result).toBe(mockPatient);
      expect(Patient).not.toHaveBeenCalled(); // No new instance
    });

    it('should create new patient if not found', async () => {
      const mockSavedPatient = { phone: '+1234567890', save: jest.fn().mockResolvedValue() };
      Patient.findOne.mockResolvedValue(null);
      Patient.mockImplementation(() => mockSavedPatient);

      const result = await findOrCreatePatient('+1234567890');

      expect(Patient.findOne).toHaveBeenCalledWith({ phone: '+1234567890' });
      expect(Patient).toHaveBeenCalledWith({ phone: '+1234567890' });
      expect(mockSavedPatient.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedPatient);
    });

    it('should throw error if findOne fails', async () => {
      Patient.findOne.mockRejectedValue(new Error('DB error'));

      await expect(findOrCreatePatient('+1234567890')).rejects.toThrow('Failed to find or create patient: DB error');
    });

    it('should throw error if save fails', async () => {
      Patient.findOne.mockResolvedValue(null);
      const mockPatient = { phone: '+1234567890', save: jest.fn().mockRejectedValue(new Error('Save error')) };
      Patient.mockImplementation(() => mockPatient);

      await expect(findOrCreatePatient('+1234567890')).rejects.toThrow('Failed to find or create patient: Save error');
    });
  });

  describe('registerPatient', () => {
    it('should update existing patient', async () => {
      const mockPatient = {
        phone: '+1234567890',
        name: 'Old Name',
        save: jest.fn().mockResolvedValue()
      };
      Patient.findOne.mockResolvedValue(mockPatient);

      const result = await registerPatient('+1234567890', 'New Name', 'Male', new Date('1990-01-01'));

      expect(Patient.findOne).toHaveBeenCalledWith({ phone: '+1234567890' });
      expect(mockPatient.name).toBe('New Name');
      expect(mockPatient.gender).toBe('Male');
      expect(mockPatient.dateOfBirth).toEqual(new Date('1990-01-01'));
      expect(mockPatient.save).toHaveBeenCalled();
      expect(result).toBe(mockPatient);
    });

    it('should create new patient if not found', async () => {
      const mockSavedPatient = {
        phone: '+1234567890',
        name: 'New Name',
        gender: 'Male',
        dateOfBirth: new Date('1990-01-01'),
        save: jest.fn().mockResolvedValue()
      };
      Patient.findOne.mockResolvedValue(null);
      Patient.mockImplementation(() => mockSavedPatient);

      const result = await registerPatient('+1234567890', 'New Name', 'Male', new Date('1990-01-01'));

      expect(Patient.findOne).toHaveBeenCalledWith({ phone: '+1234567890' });
      expect(Patient).toHaveBeenCalledWith({
        phone: '+1234567890',
        name: 'New Name',
        gender: 'Male',
        dateOfBirth: new Date('1990-01-01')
      });
      expect(mockSavedPatient.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedPatient);
    });

    it('should throw error if findOne fails', async () => {
      Patient.findOne.mockRejectedValue(new Error('DB error'));

      await expect(registerPatient('+1234567890', 'Name')).rejects.toThrow('Failed to register patient: DB error');
    });

    it('should throw error if save fails', async () => {
      Patient.findOne.mockResolvedValue(null);
      const mockPatient = { save: jest.fn().mockRejectedValue(new Error('Save error')) };
      Patient.mockImplementation(() => mockPatient);

      await expect(registerPatient('+1234567890', 'Name')).rejects.toThrow('Failed to register patient: Save error');
    });

    // Edge case: partial data
    it('should handle undefined gender and dateOfBirth', async () => {
      const mockPatient = {
        phone: '+1234567890',
        save: jest.fn().mockResolvedValue()
      };
      Patient.findOne.mockResolvedValue(mockPatient);

      await registerPatient('+1234567890', 'Name', undefined, undefined);

      expect(mockPatient.name).toBe('Name');
      expect(mockPatient.gender).toBeUndefined();
      expect(mockPatient.dateOfBirth).toBeUndefined();
    });
  });
});