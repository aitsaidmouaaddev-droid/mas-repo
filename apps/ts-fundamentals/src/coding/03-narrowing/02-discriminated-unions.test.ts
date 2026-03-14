import {
  AsyncState,
  renderState,
  TrafficLight,
  getWaitTime,
  NotificationPayload,
  sendNotification,
} from './02-discriminated-unions';

describe('02 — Discriminated Unions', () => {
  describe('renderState', () => {
    it('should return Loading... for loading state', () => {
      const state: AsyncState<string> = { status: 'loading' };
      expect(renderState(state, (s) => s)).toBe('Loading...');
    });

    it('should call render for success state', () => {
      const state: AsyncState<{ name: string }> = { status: 'success', data: { name: 'Alice' } };
      const result = renderState(state, (d) => `User: ${d.name}`);
      expect(result).toBe('User: Alice');
    });

    it('should return error message for error state', () => {
      const state: AsyncState<string> = {
        status: 'error',
        error: new Error('Network error'),
        retryCount: 2,
      };
      const result = renderState(state, (s) => s);
      expect(result).toContain('Network error');
      expect(result).toContain('2');
    });
  });

  describe('getWaitTime', () => {
    it('should return duration for red light', () => {
      const light: TrafficLight = { color: 'red', duration: 30 };
      expect(getWaitTime(light)).toBe(30);
    });

    it('should return duration for yellow light', () => {
      const light: TrafficLight = { color: 'yellow', duration: 5, isFlashing: false };
      expect(getWaitTime(light)).toBe(5);
    });

    it('should return duration for green light', () => {
      const light: TrafficLight = { color: 'green', duration: 45, isPedestrianActive: false };
      expect(getWaitTime(light)).toBe(45);
    });
  });

  describe('sendNotification', () => {
    it('should handle Email payload', () => {
      const email: NotificationPayload = { to: 'alice@example.com', subject: 'Hi', body: 'Hello!' };
      expect(sendNotification(email)).toContain('alice@example.com');
    });

    it('should handle SMS payload', () => {
      const sms: NotificationPayload = { phone: '+33612345678', text: 'Code: 1234' };
      expect(sendNotification(sms)).toContain('+33612345678');
    });

    it('should handle Push payload', () => {
      const push: NotificationPayload = {
        deviceId: 'device-001',
        title: 'Alert',
        message: 'Hello',
      };
      expect(sendNotification(push)).toContain('device-001');
    });
  });
});
