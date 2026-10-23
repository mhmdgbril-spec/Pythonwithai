import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  buildSystemInstruction,
  buildLocalEducationalFallback,
  type AssistantContextInfo
} from './src/utils/aiAssistantUtils.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'hero-of-python-assistant' });
  });

  // Smart Python Assistant Chat Endpoint (Server-Side Gemini API)
  app.post('/api/assistant/chat', async (req, res) => {
    const { message, history = [], context, studentName, codeContext } = req.body as {
      message?: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
      context?: AssistantContextInfo;
      studentName?: string;
      codeContext?: string;
    };

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'يرجى كتابة سؤالك البرمجي أولاً.' });
      return;
    }

    const safeContext: AssistantContextInfo = context || {
      activeTab: 'dashboard',
      contextTitle: 'منصة بطل بايثون والتقنية الرقمية',
      contextSubtitle: 'مدارس النخبة العلمية الأهلية بالدمام',
      contextBadge: 'مساعد بايثون العام',
      keyTopics: ['أساسيات بايثون', 'الجمل الشرطية والحلقات', 'تطبيقات الذكاء الاصطناعي']
    };

    const systemInstruction = buildSystemInstruction(safeContext, studentName);
    const apiKey = process.env.GEMINI_API_KEY;

    // If GEMINI_API_KEY is not configured in the environment, return the rich educational tutor response
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      const reply = buildLocalEducationalFallback(message, safeContext);
      res.json({
        reply,
        source: 'local-tutor',
        model: 'gemini-3.8-flash'
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
      const contents = recentHistory.map(turn => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.content }]
      }));

      const fullUserPrompt = codeContext && codeContext.trim()
        ? `${message.trim()}\n\nالكود المرفق من الطالب للمراجعة أو الشرح:\n\`\`\`python\n${codeContext.trim()}\n\`\`\``
        : message.trim();

      contents.push({
        role: 'user',
        parts: [{ text: fullUserPrompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.5
        }
      });

      const replyText = response.text?.trim() || buildLocalEducationalFallback(message, safeContext);
      res.json({
        reply: replyText,
        source: 'gemini',
        model: 'gemini-3.8-flash'
      });
    } catch (error) {
      console.error('Gemini API Error in /api/assistant/chat:', error);
      // Graceful educational fallback if API call fails (e.g. network/quota issue in preview)
      const fallbackReply = buildLocalEducationalFallback(message, safeContext);
      res.json({
        reply: fallbackReply,
        source: 'local-tutor',
        model: 'gemini-3.8-flash'
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hero of Python Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
