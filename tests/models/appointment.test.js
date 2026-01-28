import { Appointment } from '../../src/models/appointment.js';
import mongoose from 'mongoose';

describe('Appointment Model', () => {
  it('should have patient as required ObjectId ref to Patient', () => {
    const path = Appointment.schema.path('patient');
    expect(path.options.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(path.options.ref).toBe('Patient');
    expect(path.options.required).toBe(true);
  });

  it('should have date as optional Date', () => {
    const path = Appointment.schema.path('date');
    expect(path.options.type).toBe(Date);
    expect(path.options.required).toBeUndefined();
  });

  it('should have department as optional string', () => {
    const path = Appointment.schema.path('department');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBeUndefined();
  });

  it('should have status with enum values and default pending', () => {
    const path = Appointment.schema.path('status');
    expect(path.options.type).toBe(String);
    expect(path.options.enum).toEqual(['pending', 'confirmed', 'cancelled']);
    expect(path.options.default).toBe('pending');
  });

  it('should have timestamps enabled', () => {
    expect(Appointment.schema.options.timestamps).toBe(true);
  });

  // Happy path
  it('should validate successfully with required fields', () => {
    const appointment = new Appointment({ patient: new mongoose.Types.ObjectId() });
    const err = appointment.validateSync();
    expect(err).toBeUndefined();
  });

  // Error case: missing patient
  it('should fail validation without patient', () => {
    const appointment = new Appointment({});
    const err = appointment.validateSync();
    expect(err.errors.patient).toBeDefined();
    expect(err.errors.patient.message).toContain('required');
  });

  // Edge case: invalid status
  it('should fail validation with invalid status', () => {
    const appointment = new Appointment({ patient: new mongoose.Types.ObjectId(), status: 'invalid' });
    const err = appointment.validateSync();
    expect(err.errors.status).toBeDefined();
  });

  // Happy path: valid status
  it('should accept valid statuses', () => {
    ['pending', 'confirmed', 'cancelled'].forEach(status => {
      const appointment = new Appointment({ patient: new mongoose.Types.ObjectId(), status });
      const err = appointment.validateSync();
      expect(err).toBeUndefined();
    });
  });
});