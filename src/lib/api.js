const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.message || 'An error occurred', response.status);
  }
  
  return data;
}

async function fetchWithAuth(endpoint, options = {}) {
  // Try to get token from localStorage first, then cookies
  let token = localStorage.getItem('token');
  if (!token) {
    // Get token from cookies if not in localStorage
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1].trim();
      // Sync localStorage with cookie
      localStorage.setItem('token', token);
    }
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return handleResponse(response);
}

// Auth API
export const authApi = {
  login: (credentials) => 
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  getCurrentUser: () => 
    fetchWithAuth('/auth/profile'),
    
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Asset API
export const assetApi = {
  getProjects: () => 
    fetchWithAuth('/api/projects'),
    
  getAssets: (projectId) => 
    fetchWithAuth(`/api/projects/${projectId}/assets`),
    
  getAssetDetails: (projectId, assetId) => 
    fetchWithAuth(`/api/projects/${projectId}/assets/${assetId}`),
};

// Sensor API
export const sensorApi = {
  getSensors: (projectId, assetId) => 
    fetchWithAuth(`/api/projects/${projectId}/assets/${assetId}/sensors`),
    
  getSensorData: (sensorId, timeRange) => 
    fetchWithAuth(`/api/sensors/${sensorId}/data?timeRange=${timeRange}`),
    
  getLiveData: (sensorId) => 
    fetchWithAuth(`/api/sensors/${sensorId}/live`),
};

// Incident API
export const incidentApi = {
  getIncidents: (filters) => 
    fetchWithAuth('/api/incidents', {
      method: 'GET',
      params: filters,
    }),
    
  createIncident: (incident) => 
    fetchWithAuth('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    }),
    
  updateIncident: (id, updates) => 
    fetchWithAuth(`/api/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
};
