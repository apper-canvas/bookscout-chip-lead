import alertsData from '../mockData/priceAlerts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PriceAlertService {
  constructor() {
    this.alerts = [...alertsData];
  }

  async getAll() {
    await delay(300);
    return [...this.alerts];
  }

  async getById(id) {
    await delay(200);
    const alert = this.alerts.find(a => a.id === id);
    if (!alert) {
      throw new Error('Alert not found');
    }
    return { ...alert };
  }

  async getByUserId(userId) {
    await delay(250);
    const userAlerts = this.alerts.filter(a => a.userId === userId);
    return [...userAlerts];
  }

  async getActiveAlerts(userId) {
    await delay(250);
    const activeAlerts = this.alerts.filter(a => 
      a.userId === userId && !a.triggered
    );
    return [...activeAlerts];
  }

  async getTriggeredAlerts(userId) {
    await delay(250);
    const triggeredAlerts = this.alerts.filter(a => 
      a.userId === userId && a.triggered
    );
    return [...triggeredAlerts];
  }

  async create(alertData) {
    await delay(300);
    const newAlert = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      triggered: false
    };
    this.alerts.push(newAlert);
    return { ...newAlert };
  }

  async update(id, data) {
    await delay(300);
    const index = this.alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    this.alerts[index] = { ...this.alerts[index], ...data };
    return { ...this.alerts[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    this.alerts.splice(index, 1);
    return { success: true };
  }

  async triggerAlert(id) {
    await delay(200);
    const index = this.alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    this.alerts[index] = { 
      ...this.alerts[index], 
      triggered: true,
      triggeredAt: new Date().toISOString()
    };
    return { ...this.alerts[index] };
  }

  async checkAlerts() {
    await delay(500);
    // This would normally check current prices against alert thresholds
    // For demo purposes, we'll randomly trigger some alerts
    const activeAlerts = this.alerts.filter(a => !a.triggered);
    const triggeredCount = Math.floor(Math.random() * 3);
    
    for (let i = 0; i < triggeredCount && i < activeAlerts.length; i++) {
      const randomAlert = activeAlerts[Math.floor(Math.random() * activeAlerts.length)];
      await this.triggerAlert(randomAlert.id);
    }
    
    return { triggeredCount };
  }
}

export default new PriceAlertService();