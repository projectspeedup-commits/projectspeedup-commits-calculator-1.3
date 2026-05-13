/**
 * Service for communicating with the PostgreSQL-powered backend.
 */

const API_URL = ''; // Empty string means current origin

export interface CalculationData {
  id?: string;
  userId: string;
  profileType: 'round' | 'hex';
  steelGrade: string;
  selectedTarget: string;
  selectedRaw: string;
  orderWeight: string;
  orderedLength: string;
  lengthInputValue: string;
  lengthInputSource: string;
  frontCoef: string;
  backCoef: string;
  usefulLength: string;
  sellPrice: string;
  rawPriceUsed: string;
  scrapPriceUsed: string;
  remnantPriceUsed: string;
  label: string;
  createdAt?: any;
}

export const backendService = {
  async getCalculations(userId: string): Promise<CalculationData[]> {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/api/calculations?userId=${userId}&_t=${timestamp}`);
    if (!response.ok) throw new Error('Failed to fetch calculations');
    return response.json();
  },

  async saveCalculation(data: CalculationData): Promise<any> {
    const response = await fetch(`${API_URL}/api/calculations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save calculation');
    return response.json();
  },

  async deleteCalculation(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/calculations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete calculation');
  },

  async clearHistory(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/calculations?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear history');
  },

  async getSettings(userId: string): Promise<any> {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/api/settings/${userId}?_t=${timestamp}`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async saveSettings(userId: string, data: any): Promise<void> {
    const response = await fetch(`${API_URL}/api/settings/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save settings');
  },

  async getGlobalSettings(): Promise<any> {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/api/global-settings?_t=${timestamp}`);
    if (!response.ok) throw new Error('Failed to fetch global settings');
    return response.json();
  },

  async saveGlobalSettings(data: any): Promise<void> {
    const response = await fetch(`${API_URL}/api/global-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save global settings');
  },
  
  async getAdminData(type: string): Promise<any> {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/api/admin-data/${type}?_t=${timestamp}`);
    if (!response.ok) throw new Error('Failed to fetch admin data');
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  },

  async saveAdminData(type: string, data: any): Promise<void> {
    const response = await fetch(`${API_URL}/api/admin-data/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save admin data');
  }
};
