import { Doctor } from '../../src/models/doctor.js';

describe('Doctor Model', () => {
  it('should have name as required string', () => {
    const path = Doctor.schema.path('name');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBe(true);
  });

  it('should have specialty as required string', () => {
    const path = Doctor.schema.path('specialty');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBe(true);
  });

  it('should have available as boolean with default true', () => {
    const path = Doctor.schema.path('available');
    expect(path.options.type).toBe(Boolean);
    expect(path.options.default).toBe(true);
  });

  it('should have timestamps enabled', () => {
    expect(Doctor.schema.options.timestamps).toBe(true);
  });

  // Happy path
  it('should validate successfully with required fields', () => {
    const doctor = new Doctor({ name: 'Dr. Smith', specialty: 'Cardiology' });
    const err = doctor.validateSync();
    expect(err).toBeUndefined();
  });

  // Error case: missing name
  it('should fail validation without name', () => {
    const doctor = new Doctor({ specialty: 'Cardiology' });
    const err = doctor.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  // Error case: missing specialty
  it('should fail validation without specialty', () => {
    const doctor = new Doctor({ name: 'Dr. Smith' });
    const err = doctor.validateSync();
    expect(err.errors.specialty).toBeDefined();
  });

  // Edge case: empty strings
  it('should fail validation with empty name', () => {
    const doctor = new Doctor({ name: '', specialty: 'Cardiology' });
    const err = doctor.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  it('should fail validation with empty specialty', () => {
    const doctor = new Doctor({ name: 'Dr. Smith', specialty: '' });
    const err = doctor.validateSync();
    expect(err.errors.specialty).toBeDefined();
  });

  // Happy path: available defaults to true
  it('should default available to true', () => {
    const doctor = new Doctor({ name: 'Dr. Smith', specialty: 'Cardiology' });
    expect(doctor.available).toBe(true);
  });

  // Edge case: set available to false
  it('should allow setting available to false', () => {
    const doctor = new Doctor({ name: 'Dr. Smith', specialty: 'Cardiology', available: false });
    expect(doctor.available).toBe(false);
  });
});