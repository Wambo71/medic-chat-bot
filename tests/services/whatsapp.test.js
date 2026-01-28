import { sendWhatsAppMessage } from '../../src/services/whatsapp.js';
import axios from 'axios';
import logger from '../../src/utils/logger.js';

// Mock axios and logger
jest.mock('axios');
jest.mock('../../src/utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock process.env
const mockEnv = {
  WHATSAPP_ACCESS_TOKEN: 'test_token',
  WHATSAPP_PHONE_NUMBER_ID: 'test_id'
};
process.env = { ...process.env, ...mockEnv };

describe('WhatsApp Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWhatsAppMessage', () => {
    it('should send message successfully', async () => {
      const mockResponse = { data: 'success' };
      axios.post.mockResolvedValue(mockResponse);

      await sendWhatsAppMessage('+1234567890', 'Hello World');

      expect(axios.post).toHaveBeenCalledWith(
        `https://graph.facebook.com/v18.0/${mockEnv.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: '+1234567890',
          type: 'text',
          text: { body: 'Hello World' }
        },
        {
          headers: {
            Authorization: `Bearer ${mockEnv.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(logger.info).toHaveBeenCalledWith('Message sent:', mockResponse.data);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should log error on failure', async () => {
      const mockError = { response: { data: 'error data' } };
      axios.post.mockRejectedValue(mockError);

      await sendWhatsAppMessage('+1234567890', 'Hello');

      expect(logger.error).toHaveBeenCalledWith('Error sending message:', mockError.response.data);
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should log error message if no response data', async () => {
      const mockError = { message: 'Network error' };
      axios.post.mockRejectedValue(mockError);

      await sendWhatsAppMessage('+1234567890', 'Hello');

      expect(logger.error).toHaveBeenCalledWith('Error sending message:', mockError.message);
    });

    // Edge case: empty message
    it('should send empty message', async () => {
      axios.post.mockResolvedValue({ data: 'success' });

      await sendWhatsAppMessage('+1234567890', '');

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          text: { body: '' }
        }),
        expect.any(Object)
      );
    });

    // Edge case: invalid phone number (but service doesn't validate)
    it('should attempt to send to invalid phone', async () => {
      axios.post.mockResolvedValue({ data: 'success' });

      await sendWhatsAppMessage('invalid', 'Hello');

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          to: 'invalid'
        }),
        expect.any(Object)
      );
    });
  });
});