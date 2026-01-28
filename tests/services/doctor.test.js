import { getAvailableDoctors } from '../../src/services/doctor.js';
import { Doctor } from '../../src/models/doctor.js';

// Mock the Doctor model
jest.mock('../../src/models/doctor.js');

describe('Doctor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableDoctors', () => {
    it('should return formatted list of available doctors', async () => {
      const mockDoctors = [
        { name: 'Dr. Smith', specialty: 'Cardiology' },
        { name: 'Dr. Johnson', specialty: 'Neurology' }
      ];
      Doctor.find.mockResolvedValue(mockDoctors);

      const result = await getAvailableDoctors();

      expect(Doctor.find).toHaveBeenCalledWith({ available: true });
      expect(result).toEqual([
        'Dr. Smith - Cardiology',
        'Dr. Johnson - Neurology'
      ]);
    });

    it('should return empty array if no doctors available', async () => {
      Doctor.find.mockResolvedValue([]);

      const result = await getAvailableDoctors();

      expect(result).toEqual([]);
    });

    it('should throw error if find fails', async () => {
      Doctor.find.mockRejectedValue(new Error('DB error'));

      await expect(getAvailableDoctors()).rejects.toThrow('Failed to fetch doctors: DB error');
    });

    // Edge case: doctors with missing fields
    it('should handle doctors with undefined specialty', async () => {
      const mockDoctors = [
        { name: 'Dr. Smith', specialty: undefined }
      ];
      Doctor.find.mockResolvedValue(mockDoctors);

      const result = await getAvailableDoctors();

      expect(result).toEqual(['Dr. Smith - undefined']);
    });
  });
});