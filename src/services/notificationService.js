/**
 * Service to manage browser notifications
 */
export const notificationService = {
  isSupported() {
    return 'Notification' in window;
  },

  isGranted() {
    return this.isSupported() && Notification.permission === 'granted';
  },

  async requestPermission() {
    if (!this.isSupported()) {
      return false;
    }
    if (this.isGranted()) {
      return true;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  show(title, body) {
    if (this.isGranted()) {
      new Notification(title, {
        body,
        tag: 'focusloop-timer',
        icon: '/favicon.svg'
      });
    }
  }
};
