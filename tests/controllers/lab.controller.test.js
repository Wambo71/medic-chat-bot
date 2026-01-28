import { getLabResults } from '../../src/controllers/lab.controller.js';
import { LabResult } from '../../src/models/labResult.js';

// Mock the LabResult model
jest.mock('../../src/models/labResult.js');

describe('Lab Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLabResults', () => {
    it('should return lab results for patient', async () => {
      const mockResults = [
        { testName: 'Blood Test', status: 'ready' },
        { testName: 'Urine Test', status: 'ready' }
      ];
      LabResult.find.mockResolvedValue(mockResults);

      const result = await getLabResults('patientId');

      expect(LabResult.find).toHaveBeenCalledWith({ patient: 'patientId', status: 'ready' });
      expect(result).toBe(mockResults);
    });

    it('should return empty array if no results', async () => {
      LabResult.find.mockResolvedValue([]);

      const result = await getLabResults('patientId');

      expect(result).toEqual([]);
    });

    it('should throw error if find fails', async () => {
      LabResult.find.mockRejectedValue(new Error('DB error'));

      await expect(getLabResults('patientId')).rejects.toThrow('Failed to retrieve lab results: DB error');
    });

    // Edge case: invalid patientId
    it('should handle invalid patientId', async () => {
      LabResult.find.mockResolvedValue([]);

      const result = await getLabResults(null);

      expect(LabResult.find).toHaveBeenCalledWith({ patient: null, status: 'ready' });
      expect(result).toEqual([]);
    });
  });
});