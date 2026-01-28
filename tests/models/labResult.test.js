import { LabResult } from '../../src/models/labResult.js';
import mongoose from 'mongoose';

describe('LabResult Model', () => {
  it('should have patient as required ObjectId ref to Patient', () => {
    const path = LabResult.schema.path('patient');
    expect(path.options.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(path.options.ref).toBe('Patient');
    expect(path.options.required).toBe(true);
  });

  it('should have testName as optional string', () => {
    const path = LabResult.schema.path('testName');
    expect(path.options.type).toBe(String);
    expect(path.options.required).toBeUndefined();
  });

  it('should have status with enum values and default pending', () => {
    const path = LabResult.schema.path('status');
    expect(path.options.type).toBe(String);
    expect(path.options.enum).toEqual(['pending', 'ready']);
    expect(path.options.default).toBe('pending');
  });

  it('should have timestamps enabled', () => {
    expect(LabResult.schema.options.timestamps).toBe(true);
  });

  // Happy path
  it('should validate successfully with required fields', () => {
    const labResult = new LabResult({ patient: new mongoose.Types.ObjectId() });
    const err = labResult.validateSync();
    expect(err).toBeUndefined();
  });

  // Error case: missing patient
  it('should fail validation without patient', () => {
    const labResult = new LabResult({});
    const err = labResult.validateSync();
    expect(err.errors.patient).toBeDefined();
  });

  // Edge case: invalid status
  it('should fail validation with invalid status', () => {
    const labResult = new LabResult({ patient: new mongoose.Types.ObjectId(), status: 'invalid' });
    const err = labResult.validateSync();
    expect(err.errors.status).toBeDefined();
  });

  // Happy path: valid statuses
  it('should accept valid statuses', () => {
    ['pending', 'ready'].forEach(status => {
      const labResult = new LabResult({ patient: new mongoose.Types.ObjectId(), status });
      const err = labResult.validateSync();
      expect(err).toBeUndefined();
    });
  });

  // Edge case: optional testName
  it('should allow empty testName', () => {
    const labResult = new LabResult({ patient: new mongoose.Types.ObjectId(), testName: '' });
    const err = labResult.validateSync();
    expect(err).toBeUndefined();
  });
});