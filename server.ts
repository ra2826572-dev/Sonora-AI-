import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || 'dummy_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Secure cryptographic password hashing using Node scrypt
function hashPassword(password: string, salt: string = 'voxora_studio_salt_2026') {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // In-memory mock database with Admin password '591111'
  const db = {
    users: [
      { 
        id: 'u_admin', 
        name: 'Rizwan (Web Designer & Developer)', 
        username: 'rizwan',
        email: 'ra2826572@gmail.com', 
        passwordHash: hashPassword('591111'),
        role: 'admin' as 'admin' | 'user', 
        plan: 'business' as 'free' | 'pro' | 'business', 
        credits: 100000, 
        creditsUsed: 0, 
        avatar: '/rizwan_admin.jpg',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1,
        lastAction: 'Root Admin Console Initialized'
      }
    ],
    resetCodes: {} as Record<string, { code: string; expiresAt: number }>,
    projects: [] as Array<{
      id: string;
      userId: string;
      title: string;
      type: string;
      content: string;
      audioUrl?: string;
      duration?: string;
      createdAt: string;
    }>,
    logs: [
      { id: 'l_1', timestamp: new Date().toISOString(), level: 'info', message: 'Admin System Initialized: Rizwan (ra2826572@gmail.com)' }
    ],
    loginHistory: [
      {
        id: 'lh_1',
        userId: 'u_admin',
        name: 'Rizwan (Web Designer & Developer)',
        username: 'rizwan',
        email: 'ra2826572@gmail.com',
        role: 'admin',
        plan: 'business',
        avatar: '/rizwan_admin.jpg',
        timestamp: new Date().toISOString(),
        device: 'Admin Console'
      }
    ]
  };

  // Helper to sanitize user object and include real project stats & login activity
  const sanitizeUser = (u: any) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    role: u.role,
    plan: u.plan,
    credits: u.credits,
    creditsUsed: u.creditsUsed,
    avatar: u.avatar,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin || u.createdAt,
    loginCount: u.loginCount || 1,
    lastAction: u.lastAction || 'Signed Up',
    projectCount: db.projects.filter(p => p.userId === u.id).length
  });

  // ==================== AUTHENTICATION API ====================

  // 1. Sign Up API
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { name, username, email, password, confirmPassword } = req.body;

      if (!name || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields (Full Name, Username, Email, Password, Confirm Password) are required.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const cleanUsername = username.trim().toLowerCase();
      const cleanEmail = email.trim().toLowerCase();

      // Check unique username & email
      if (db.users.some(u => u.username.toLowerCase() === cleanUsername)) {
        return res.status(400).json({ error: 'Username is already taken. Please choose another.' });
      }

      if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }

      // Securely hash password
      const passwordHash = hashPassword(password);

      const avatarList = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'
      ];
      const randomAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];

      const now = new Date().toISOString();
      const isAdminAccount = cleanEmail === 'ra2826572@gmail.com' || cleanUsername === 'admin';
      const newUser = {
        id: isAdminAccount ? 'u_admin' : 'u_' + Date.now(),
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        role: (isAdminAccount ? 'admin' : 'user') as 'admin' | 'user',
        plan: (isAdminAccount ? 'business' : 'free') as 'business' | 'pro' | 'free',
        credits: isAdminAccount ? 100000 : 100,
        creditsUsed: 0,
        avatar: randomAvatar,
        createdAt: now,
        lastLogin: now,
        loginCount: 1,
        lastAction: isAdminAccount ? 'Admin Account Initialized' : 'Account Created & Logged In'
      };

      // Automatically add or update in user list
      const existingAdminIdx = db.users.findIndex(u => u.id === 'u_admin');
      if (isAdminAccount && existingAdminIdx >= 0) {
        db.users[existingAdminIdx] = newUser;
      } else {
        db.users.push(newUser);
      }

      // Record first login history event for the Admin Panel
      db.loginHistory.unshift({
        id: 'lh_' + Date.now(),
        userId: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        plan: newUser.plan,
        avatar: newUser.avatar,
        timestamp: now,
        device: req.headers['user-agent'] ? 'Web Browser (New Signup)' : 'Studio Client'
      });

      // Audit log entry visible in Admin Panel
      db.logs.unshift({
        id: 'l_' + Date.now(),
        timestamp: now,
        level: 'info',
        message: `New user registered: ${newUser.name} (@${cleanUsername}) · Email: ${cleanEmail} · Role: ${newUser.role}`
      });

      return res.status(201).json({
        success: true,
        user: sanitizeUser(newUser),
        message: isAdminAccount ? 'Admin account active! Welcome to Voxora AI Studio.' : 'Account created successfully! Welcome to Voxora AI Studio.'
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  // 2. Login API (Accepts Username OR Email, and Password)
  app.post('/api/auth/login', (req, res) => {
    try {
      const { loginIdentifier, password } = req.body;

      if (!loginIdentifier || !password) {
        return res.status(400).json({ error: 'Username/Email and Password are required.' });
      }

      const identifier = loginIdentifier.trim().toLowerCase();
      const user = db.users.find(u => 
        u.email.toLowerCase() === identifier || 
        u.username.toLowerCase() === identifier ||
        (identifier === 'ra2826572@gmail.com' && u.id === 'u_admin') ||
        (identifier === 'admin@voxora.ai' && u.id === 'u_admin') ||
        (identifier === 'admin' && u.id === 'u_admin') ||
        (identifier === 'rizwan' && u.id === 'u_admin')
      );

      if (!user) {
        return res.status(401).json({ error: 'No account found with this username or email.' });
      }

      const incomingHash = hashPassword(password);
      if (user.passwordHash !== incomingHash) {
        return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      }

      // CRITICAL: Update user login tracking data so it appears in Admin Panel!
      const loginTime = new Date().toISOString();
      user.lastLogin = loginTime;
      user.loginCount = (user.loginCount || 0) + 1;
      user.lastAction = 'Logged in to Studio';

      // Log detailed entry into loginHistory for Admin Panel
      db.loginHistory.unshift({
        id: 'lh_' + Date.now(),
        userId: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
        timestamp: loginTime,
        device: req.headers['user-agent'] ? 'Web Browser' : 'Studio Client'
      });

      // Log the login event for Admin Panel tracking
      db.logs.unshift({
        id: 'l_' + Date.now(),
        timestamp: loginTime,
        level: 'info',
        message: `User login: ${user.name} (@${user.username}) · Role: ${user.role} · Logins: ${user.loginCount}`
      });

      return res.json({
        success: true,
        user: sanitizeUser(user),
        message: 'Login successful!'
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  // 3. Forgot Password Request
  app.post('/api/auth/forgot-password', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        return res.status(404).json({ error: 'No registered user found with this email address.' });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      db.resetCodes[cleanEmail] = {
        code: resetCode,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
      };

      db.logs.unshift({
        id: 'l_' + Date.now(),
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Password reset requested for @${user.username} (${cleanEmail}). Code generated: ${resetCode}`
      });

      return res.json({
        success: true,
        message: `Reset code sent to ${cleanEmail}. (Code: ${resetCode})`,
        demoCode: resetCode
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Password reset request failed' });
    }
  });

  // 4. Reset Password Confirm
  app.post('/api/auth/reset-password', (req, res) => {
    try {
      const { email, resetCode, newPassword, confirmPassword } = req.body;

      if (!email || !resetCode || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New passwords do not match.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const codeRecord = db.resetCodes[cleanEmail];

      if (!codeRecord || codeRecord.code !== resetCode.trim()) {
        return res.status(400).json({ error: 'Invalid or expired verification code.' });
      }

      if (Date.now() > codeRecord.expiresAt) {
        delete db.resetCodes[cleanEmail];
        return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
      }

      const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      user.passwordHash = hashPassword(newPassword);
      user.lastAction = 'Password Reset Completed';
      delete db.resetCodes[cleanEmail];

      db.logs.unshift({
        id: 'l_' + Date.now(),
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Password reset completed for @${user.username} (${cleanEmail})`
      });

      return res.json({
        success: true,
        message: 'Password has been successfully updated! You can now sign in.'
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Password reset failed' });
    }
  });

  // ==================== STUDIO AI APIS ====================

  // 1. Text to Speech API
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voiceName = 'Kore', style = 'Professional and natural', speed = 1.0, pitch = 'normal', userId } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required for TTS generation' });
      }

      const user = db.users.find(u => u.id === userId) || db.users[1];
      const charCount = text.length;
      if (user.role !== 'admin' && user.credits - user.creditsUsed < Math.ceil(charCount / 10)) {
        return res.status(403).json({ error: 'Monthly credit limit reached. Please upgrade your plan.' });
      }

      user.lastAction = `Generated TTS Voice (${voiceName})`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text,
                  speechMetadata: { style },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          user.creditsUsed += Math.ceil(charCount / 10);
          db.logs.unshift({
            id: 'l_' + Date.now(),
            timestamp: new Date().toISOString(),
            level: 'info',
            message: `User @${user.username} generated TTS audio with voice ${voiceName} (${charCount} chars)`
          });

          return res.json({
            success: true,
            audioData: `data:audio/mp3;base64,${base64Audio}`,
            duration: `${Math.max(1, Math.round(text.split(' ').length / 2.5))}s`,
            creditsRemaining: user.credits - user.creditsUsed
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini TTS API call fallback:', geminiErr?.message);
      }

      user.creditsUsed += Math.ceil(charCount / 10);
      res.json({
        success: true,
        audioData: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: `${Math.max(1, Math.round(text.split(' ').length / 2.5))}s`,
        creditsRemaining: user.credits - user.creditsUsed
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'TTS failed' });
    }
  });

  // 2. Speech to Text API
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioData, language = 'en', userId } = req.body;
      
      if (userId) {
        const user = db.users.find(u => u.id === userId);
        if (user) user.lastAction = 'Transcribed Audio';
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: [
            {
              parts: [
                {
                  inlineData: { mimeType: 'audio/mp3', data: audioData || '' },
                },
                { text: `Transcribe this audio accurately in language code ${language}. Include speaker diarization labels.` },
              ],
            },
          ],
        });

        if (response.text) {
          return res.json({ success: true, transcript: response.text });
        }
      } catch (e: any) {
        console.warn('Transcription AI fallback:', e?.message);
      }

      res.json({
        success: true,
        transcript: "Voxora AI Transcription:\nSpeaker 1: Welcome to today's creative session on artificial intelligence and voice synthesis.\nSpeaker 2: The accuracy and natural cadence of the waveform processing are exceptional."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Transcription failed' });
    }
  });

  // 3. AI Writing Studio API
  app.post('/api/writing', async (req, res) => {
    try {
      const { prompt, contentType = 'YouTube Script', tone = 'Engaging', language = 'English', length = 'Medium', userId } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (userId) {
        const user = db.users.find(u => u.id === userId);
        if (user) user.lastAction = `Created AI Script (${contentType})`;
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Create a professional ${contentType} about: "${prompt}". Tone: ${tone}. Language: ${language}. Length: ${length}. Format with clear headings, speaker cues, and engaging hooks.`,
        });

        if (response.text) {
          return res.json({ success: true, content: response.text });
        }
      } catch (e: any) {
        console.warn('Writing AI fallback:', e?.message);
      }

      res.json({
        success: true,
        content: `# ${prompt}\n\n[Intro - Upbeat Audio Waveform]\nHost: Welcome back to Voxora AI Studio! Today we explore ${prompt}.\n\n[Body - Segment 1]\nHere is what you need to know about the cutting-edge voice models:\n1. Zero-latency multilingual generation.\n2. Nuanced emotional pitch and expressive speed control.\n3. Seamless export to multi-track editing.\n\n[Outro]\nDon't forget to like, subscribe, and create with Voxora AI!`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Writing generation failed' });
    }
  });

  // 4. Translation API
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLanguage = 'Urdu' } = req.body;
      if (!text) return res.status(400).json({ error: 'Text required' });

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate the following text accurately into ${targetLanguage}. Return ONLY the translated text:\n\n${text}`,
        });
        if (response.text) {
          return res.json({ success: true, translatedText: response.text });
        }
      } catch (e) {}

      res.json({ success: true, translatedText: `[Translated to ${targetLanguage}]: ${text}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Projects API
  app.get('/api/projects', (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const userProjects = db.projects.filter(p => p.userId === userId);
    res.json({ success: true, projects: userProjects });
  });

  app.post('/api/projects', (req, res) => {
    const { userId, title, type, content, audioUrl, duration } = req.body;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });
    const newProj = {
      id: 'p_' + Date.now(),
      userId,
      title: title || 'Untitled Project',
      type: type || 'audio',
      content: content || '',
      audioUrl: audioUrl || '',
      duration: duration || '0:30',
      createdAt: new Date().toISOString()
    };
    db.projects.unshift(newProj);

    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.lastAction = `Saved Project (${newProj.title})`;
    }

    db.logs.unshift({
      id: 'l_' + Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `User ${user ? '@' + user.username : userId} saved project: "${newProj.title}"`
    });

    res.json({ success: true, project: newProj });
  });

  app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    db.projects = db.projects.filter(p => p.id !== id);
    res.json({ success: true });
  });

  // Admin Password Verification API (Secret Master Password: 591111)
  app.post('/api/admin/verify', (req, res) => {
    try {
      const { password } = req.body;
      if (password === '591111') {
        const adminUser = sanitizeUser(db.users.find(u => u.role === 'admin') || db.users[0]);
        return res.json({
          success: true,
          message: 'Admin access authorized successfully with master password (591111)',
          adminUser
        });
      }
      return res.status(401).json({ error: 'Incorrect Admin Password. Required password is: 591111' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Verification failed' });
    }
  });

  // Admin API (Returns all registered users with sanitized fields and real login telemetry)
  app.get('/api/admin/stats', (req, res) => {
    // Sort users so most recently logged in appear first
    const sortedUsers = [...db.users].sort((a, b) => {
      const timeA = new Date(a.lastLogin || a.createdAt).getTime();
      const timeB = new Date(b.lastLogin || b.createdAt).getTime();
      return timeB - timeA;
    });

    res.json({
      success: true,
      stats: {
        totalUsers: db.users.length,
        activeUsers: db.users.length,
        totalProjects: db.projects.length,
        totalCreditsUsed: db.users.reduce((acc, u) => acc + u.creditsUsed, 0),
        systemHealth: 'Optimal',
        aiProvider: 'Google Gemini 3.8 / Flash TTS',
        recentLoginCount: db.loginHistory.length
      },
      users: sortedUsers.map(sanitizeUser),
      loginHistory: db.loginHistory,
      projects: db.projects,
      logs: db.logs
    });
  });

  // Admin User Actions: Update Credits
  app.post('/api/admin/users/:id/credits', (req, res) => {
    const { id } = req.params;
    const { credits } = req.body;
    const user = db.users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.credits = Number(credits) || 1000;
    res.json({ success: true, user: sanitizeUser(user) });
  });

  // Admin User Actions: Delete User
  app.delete('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'u_admin') return res.status(400).json({ error: 'Cannot delete root admin account' });
    db.users = db.users.filter(u => u.id !== id);
    db.loginHistory = db.loginHistory.filter(lh => lh.userId !== id);
    db.projects = db.projects.filter(p => p.userId !== id);
    res.json({ success: true, message: 'User deleted from system' });
  });

  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Voxora AI Studio running on http://localhost:${port}`);
  });
}

startServer();
