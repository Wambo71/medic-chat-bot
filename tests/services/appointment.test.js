import { bookAppointment } from '../../src/services/appointment.js';
import { Appointment } from '../../src/models/appointment.js';

// Mock the Appointment model
jest.mock('../../src/models/appointment.js');

describe('Appointment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bookAppointment', () => {
    it('should create and save appointment successfully', async () => {
      const mockAppointment = {
        patient: 'patientId',
        department: 'Cardiology',
        date: new Date('2023-12-01'),
        status: 'confirmed',
        save: jest.fn().mockResolvedValue()
      };
      Appointment.mockImplementation(() => mockAppointment);

      const result = await bookAppointment('patientId', 'Cardiology', new Date('2023-12-01'));

      expect(Appointment).toHaveBeenCalledWith({
        patient: 'patientId',
        department: 'Cardiology',
        date: new Date('2023-12-01'),
        status: 'confirmed'
      });
      expect(mockAppointment.save).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'confirmed',
        date: new Date('2023-12-01'),
        department: 'Cardiology'
      });
    });

    it('should throw error if save fails', async () => {
      const mockAppointment = {
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };
      Appointment.mockImplementation(() => mockAppointment);

      await expect(bookAppointment('patientId', 'Cardiology', new Date())).rejects.toThrow('Failed to book appointment: Save error');
    });

    // Edge case: null or undefined inputs
    it('should handle null department', async () => {
      const mockAppointment = {
        patient: 'patientId',
        department: null,
        date: new Date(),
        status: 'confirmed',
        save: jest.fn().mockResolvedValue()
      };
      Appointment.mockImplementation(() => mockAppointment);

      const result = await bookAppointment('patientId', null, new Date());

      expect(Appointment).toHaveBeenCalledWith({
        patient: 'patientId',
        department: null,
        date: expect.any(Date),
        status: 'confirmed'
      });
      expect(result.department).toBeNull();
    });

    it('should handle undefined date', async () => {
      const mockAppointment = {
        patient: 'patientId',
        department: 'Cardiology',
        date: undefined,
        status: 'confirmed',
        save: jest.fn().mockResolvedValue()
      };
      Appointment.mockImplementation(() => mockAppointment);

      const result = await bookAppointment('patientId', 'Cardiology', undefined);

      expect(result.date).toBeUndefined();
    });
  });
});