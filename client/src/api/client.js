const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'interviewiq_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const isForm = body instanceof FormData;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  // the browser sets the multipart boundary itself for FormData
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body === undefined || isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Check that it is running.');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // a stored token that the server rejects means the session is over
    if (res.status === 401 && token) {
      clearToken();
      window.location.assign('/login');
    }
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}
