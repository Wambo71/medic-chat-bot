import { Patient } from '../../src/models/patient.js';

describe('Patient Model', () => {
  it('should have name as required string', () => {
    const path = Patient.schema.path('name');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBe(true);
  });

  it('should have phone as required unique string', () => {
    const path = Patient.schema.path('phone');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBe(true);
    expect(path.options.unique).toBe(true);
  });

  it('should have gender as optional string', () => {
    const path = Patient.schema.path('gender');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBeUndefined();
  });

  it('should have dateOfBirth as optional date', () => {
    const path = Patient.schema.path('dateOfBirth');
    expect(path.options.type).toBe(Date);
    expect(path.options.required).toBeUndefined();
  });

  it('should have timestamps enabled', () => {
    expect(Patient.schema.options.timestamps).toBe(true);
  });

  // Happy path: valid patient
  it('should validate successfully with required fields', () => {
    const patient = new Patient({ name: 'John Doe', phone: '+1234567890' });
    const err = patient.validateSync();
    expect(err).toBeUndefined();
  });

  // Error case: missing name
  it('should fail validation without name', () => {
    const patient = new Patient({ phone: '+1234567890' });
    const err = patient.validateSync();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.name.message).toContain('required');
  });

  // Error case: missing phone
  it('should fail validation without phone', () => {
    const patient = new Patient({ name: 'John Doe' });
    const err = patient.validateSync();
    expect(err.errors.phone).toBeDefined();
    expect(err.errors.phone.message).toContain('required');
  });

  // Edge case: empty strings (should still require)
  it('should fail validation with empty name', () => {
    const patient = new Patient({ name: '', phone: '+1234567890' });
    const err = patient.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  it('should fail validation with empty phone', () => {
    const patient = new Patient({ name: 'John Doe', phone: '' });
    const err = patient.validateSync();
    expect(err.errors.phone).toBeDefined();
  });
});