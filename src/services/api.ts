export async function signupUser(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}

export async function loginUser(data: {
  loginIdentifier: string;
  password: string;
}) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export async function forgotPassword(email: string) {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to request password reset');
  return json;
}

export async function resetPassword(data: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset password');
  return json;
}

export async function updateProfile(data: {
  userId: string;
  name?: string;
  avatar?: string;
}) {
  const res = await fetch('/api/auth/update-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update profile');
  return json;
}

export async function generateTTS(data: {
  text: string;
  voiceName: string;
  style: string;
  speed: number;
  pitch: string;
  userId: string;
}) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'TTS generation failed');
  return json;
}

export async function transcribeAudio(audioData: string, language: string, userId?: string) {
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioData, language, userId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Transcription failed');
  return json;
}

export async function generateWriting(data: {
  prompt: string;
  contentType: string;
  tone: string;
  language: string;
  length: string;
  userId?: string;
}) {
  const res = await fetch('/api/writing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Writing generation failed');
  return json;
}

export async function translateText(text: string, targetLanguage: string) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Translation failed');
  return json;
}

export async function fetchProjects(userId: string) {
  const res = await fetch(`/api/projects?userId=${userId}`);
  const json = await res.json();
  return json.projects || [];
}

export async function saveProject(projectData: {
  userId: string;
  title: string;
  type: 'audio' | 'transcribe' | 'writing';
  content: string;
  audioUrl?: string;
  duration?: string;
}) {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  const json = await res.json();
  return json.project;
}

export async function deleteProject(id: string) {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch('/api/admin/stats');
  const json = await res.json();
  return json;
}

export async function verifyAdminPassword(password: string) {
  const res = await fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid admin password');
  }
  return data;
}

export async function updateAdminUserCredits(userId: string, credits: number) {
  const res = await fetch(`/api/admin/users/${userId}/credits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credits }),
  });
  return res.json();
}

export async function deleteUserByAdmin(userId: string) {
  const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
  return res.json();
}
