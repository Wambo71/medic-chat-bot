import { receiveMessage } from '../../src/controllers/message.js';

// Mock all dependencies
jest.mock('../../src/services/whatsapp.js');
jest.mock('../../src/utils/menu.js');
jest.mock('../../src/services/patient.js');
jest.mock('../../src/services/doctor.js');
jest.mock('../../src/controllers/lab.controller.js');
jest.mock('../../src/services/appointment.js');
jest.mock('../../src/services/conversation.js');
jest.mock('../../src/utils/logger.js');

import { sendWhatsAppMessage } from '../../src/services/whatsapp.js';
import { getMainMenu } from '../../src/utils/menu.js';
import { findOrCreatePatient } from '../../src/services/patient.js';
import { getAvailableDoctors } from '../../src/services/doctor.js';
import { getLabResults } from '../../src/controllers/lab.controller.js';
import { bookAppointment } from '../../src/services/appointment.js';
import { getConversationState, setConversationState, clearConversationState } from '../../src/services/conversation.js';
import logger from '../../src/utils/logger.js';

describe('Message Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {
        entry: [{
          changes: [{
            value: {
              messages: [{
                from: '1234567890',
                text: { body: 'hello' }
              }]
            }
          }]
        }]
      }
    };
    mockRes = {
      sendStatus: jest.fn()
    };
    getConversationState.mockReturnValue({ step: 'menu' });
    getMainMenu.mockReturnValue('Main Menu');
  });

  describe('receiveMessage', () => {
    it('should return 200 for no message', async () => {
      mockReq.body.entry[0].changes[0].value.messages = [];

      await receiveMessage(mockReq, mockRes);

      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
      expect(sendWhatsAppMessage).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid phone', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].from = 'invalid';

      await receiveMessage(mockReq, mockRes);

      expect(logger.error).toHaveBeenCalledWith('Invalid phone number');
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid text', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = '';

      await receiveMessage(mockReq, mockRes);

      expect(logger.error).toHaveBeenCalledWith('Invalid text message');
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should handle menu command "1"', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = '1';

      await receiveMessage(mockReq, mockRes);

      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', '📅 Book Appointment\nSend: BOOK');
      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should handle "doctors" command', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'doctors';
      getAvailableDoctors.mockResolvedValue(['Dr. Smith - Cardiology']);

      await receiveMessage(mockReq, mockRes);

      expect(getAvailableDoctors).toHaveBeenCalled();
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Available Doctors:\nDr. Smith - Cardiology');
    });

    it('should handle "doctors" with no doctors', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'doctors';
      getAvailableDoctors.mockResolvedValue([]);

      await receiveMessage(mockReq, mockRes);

      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'No doctors available.');
    });

    it('should handle "results" command', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'results';
      findOrCreatePatient.mockResolvedValue({ _id: 'patientId' });
      getLabResults.mockResolvedValue([{ testName: 'Blood Test', status: 'ready' }]);

      await receiveMessage(mockReq, mockRes);

      expect(findOrCreatePatient).toHaveBeenCalledWith('1234567890');
      expect(getLabResults).toHaveBeenCalledWith('patientId');
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Your Lab Results:\nBlood Test: ready');
    });

    it('should handle "results" with no results', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'results';
      findOrCreatePatient.mockResolvedValue({ _id: 'patientId' });
      getLabResults.mockResolvedValue([]);

      await receiveMessage(mockReq, mockRes);

      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'No lab results found.');
    });

    it('should handle "book" command', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'book';

      await receiveMessage(mockReq, mockRes);

      expect(setConversationState).toHaveBeenCalledWith('1234567890', { step: 'book_department', data: {} });
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Please enter the department (e.g., General, Pediatrics, Gynecology):');
    });

    it('should handle conversation step book_department', async () => {
      getConversationState.mockReturnValue({ step: 'book_department', data: {} });
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'cardiology';

      await receiveMessage(mockReq, mockRes);

      expect(setConversationState).toHaveBeenCalledWith('1234567890', { step: 'book_date', data: { department: 'cardiology' } });
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Please enter the appointment date (YYYY-MM-DD):');
    });

    it('should handle conversation step book_date with valid date', async () => {
      getConversationState.mockReturnValue({ step: 'book_date', data: { department: 'Cardiology' } });
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = '2023-12-01';
      findOrCreatePatient.mockResolvedValue({ _id: 'patientId' });
      bookAppointment.mockResolvedValue({ status: 'confirmed', date: new Date('2023-12-01'), department: 'Cardiology' });

      await receiveMessage(mockReq, mockRes);

      expect(findOrCreatePatient).toHaveBeenCalledWith('1234567890');
      expect(bookAppointment).toHaveBeenCalledWith('patientId', 'Cardiology', new Date('2023-12-01'));
      expect(clearConversationState).toHaveBeenCalledWith('1234567890');
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Appointment booked for 2023-12-01 in Cardiology.');
    });

    it('should handle conversation step book_date with invalid date', async () => {
      getConversationState.mockReturnValue({ step: 'book_date', data: { department: 'Cardiology' } });
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'invalid-date';

      await receiveMessage(mockReq, mockRes);

      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Invalid date format. Please enter YYYY-MM-DD:');
      expect(clearConversationState).not.toHaveBeenCalled();
    });

    it('should handle booking failure', async () => {
      getConversationState.mockReturnValue({ step: 'book_date', data: { department: 'Cardiology' } });
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = '2023-12-01';
      findOrCreatePatient.mockResolvedValue({ _id: 'patientId' });
      bookAppointment.mockRejectedValue(new Error('Booking failed'));

      await receiveMessage(mockReq, mockRes);

      expect(clearConversationState).toHaveBeenCalledWith('1234567890');
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Failed to book appointment: Booking failed');
    });

    it('should handle unknown command', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'unknown';

      await receiveMessage(mockReq, mockRes);

      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Main Menu');
    });

    it('should handle "stop" command', async () => {
      mockReq.body.entry[0].changes[0].value.messages[0].text.body = 'stop';

      await receiveMessage(mockReq, mockRes);

      expect(clearConversationState).toHaveBeenCalledWith('1234567890');
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'You have been unsubscribed.');
    });

    it('should handle unknown conversation step', async () => {
      getConversationState.mockReturnValue({ step: 'unknown', data: {} });

      await receiveMessage(mockReq, mockRes);

      expect(clearConversationState).toHaveBeenCalledWith('1234567890');
      expect(sendWhatsAppMessage).toHaveBeenCalledWith('1234567890', 'Unknown step. Returning to menu.\nMain Menu');
    });

    it('should return 500 on error', async () => {
      getConversationState.mockImplementation(() => { throw new Error('Test error'); });

      await receiveMessage(mockReq, mockRes);

      expect(logger.error).toHaveBeenCalledWith('Error handling message:', expect.any(Error));
      expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});