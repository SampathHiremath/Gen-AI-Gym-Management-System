const PROXY_API = '/api';
const DIRECT_API = 'http://127.0.0.1:8000/api';

async function fetchWithFallback(endpoint, options = {}, headers = {}) {
  // Try relative proxy path first
  const proxyUrl = `${PROXY_API}${endpoint}`;
  try {
    const res = await fetch(proxyUrl, { ...options, headers });
    // If proxy returned 502 (Vite proxy couldn't reach backend), retry directly on port 8000
    if (res.status === 502) {
      console.warn(`[API Proxy 502] Retrying directly via ${DIRECT_API}${endpoint}...`);
      const directRes = await fetch(`${DIRECT_API}${endpoint}`, { ...options, headers });
      return directRes;
    }
    return res;
  } catch (err) {
    // If proxy network failed completely, retry directly on port 8000
    console.warn(`[API Network Failed] Retrying directly via ${DIRECT_API}${endpoint}...`, err);
    return await fetch(`${DIRECT_API}${endpoint}`, { ...options, headers });
  }
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Attach session token or custom Gemini Key if present in localStorage
  const token = localStorage.getItem('gym_token');
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  const customKey = localStorage.getItem('gym_gemini_key');
  if (customKey) {
    headers['X-Gemini-Key'] = customKey;
  }

  try {
    const res = await fetchWithFallback(endpoint, options, headers);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Accounts
  login: (credentials) => request('/accounts/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/accounts/register/', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: () => request('/accounts/demo-login/', { method: 'POST' }),
  getProfile: (userId) => request(`/accounts/profile/${userId ? `?user_id=${userId}` : ''}`),
  updateProfile: (profileData) => request('/accounts/profile/', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Memberships
  getPlans: () => request('/memberships/plans/'),
  subscribePlan: (data) => request('/memberships/subscribe/', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentSubscription: (userId) => request(`/memberships/current/${userId ? `?user_id=${userId}` : ''}`),

  // Classes & Trainers
  getClasses: (category) => request(`/classes/${category ? `?category=${category}` : ''}`),
  getTrainers: () => request('/classes/trainers/'),
  getSchedules: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/classes/schedules/${query ? `?${query}` : ''}`);
  },
  bookClass: (data) => request('/classes/book/', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: (userId) => request(`/classes/my-bookings/${userId ? `?user_id=${userId}` : ''}`),
  cancelBooking: (bookingId) => request(`/classes/cancel-booking/${bookingId}/`, { method: 'POST' }),

  // AI Services
  generateWorkout: (data) => request('/ai/generate-workout/', { method: 'POST', body: JSON.stringify(data) }),
  generateMealPlan: (data) => request('/ai/generate-meal-plan/', { method: 'POST', body: JSON.stringify(data) }),
  sendChatMessage: (data) => request('/ai/chat/', { method: 'POST', body: JSON.stringify(data) }),
  getChatHistory: (sessionId) => request(`/ai/chat-history/?session_id=${sessionId}`),
  getFormGuide: (exercise) => request(`/ai/form-advisor/${exercise ? `?exercise=${exercise}` : ''}`),
  getReadinessScore: (data) => request('/ai/readiness/', { method: 'POST', body: JSON.stringify(data) }),

  // Saved Workouts & Meals
  saveWorkout: (data) => request('/ai/save-workout/', { method: 'POST', body: JSON.stringify(data) }),
  getSavedWorkouts: (userId) => request(`/ai/saved-workouts/${userId ? `?user_id=${userId}` : ''}`),
  saveMealPlan: (data) => request('/ai/save-meal-plan/', { method: 'POST', body: JSON.stringify(data) }),
  getSavedMealPlans: (userId) => request(`/ai/saved-meal-plans/${userId ? `?user_id=${userId}` : ''}`),

  // Contact
  submitContact: (data) => request('/contact/', { method: 'POST', body: JSON.stringify(data) }),
};
