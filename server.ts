import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('API_KEY_INVALID');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.post('/api/reading', async (req, res) => {
  try {
    const { systemPrompt, userQuery } = req.body;

    if (!userQuery || typeof userQuery !== 'string') {
      res.status(400).json({ error: 'INVALID_REQUEST', message: '缺少有效的提問與卦象資料' });
      return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userQuery,
      config: {
        systemInstruction:
          systemPrompt ||
          '你是一位深諳《周易》經傳原典、兼具現代心理學反思視野與決策顧問素養的易經哲學解讀師。請使用臺灣繁體中文回答。',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreEssence: {
              type: Type.STRING,
              description:
                '① 卦象核心意義：說明此卦的上下卦象徵、時勢結構與主要精神（約 100~150 字）。',
            },
            questionAnalysis: {
              type: Type.STRING,
              description:
                '② 針對問題的解析：緊密結合使用者提問，指出此卦象提供哪些思考角度與處境洞察（約 150~220 字）。',
            },
            blindSpots: {
              type: Type.STRING,
              description:
                '③ 值得注意的盲點：指出使用者在此議題上可能忽略的條件、情緒慣性、風險或矛盾（約 100~160 字）。',
            },
            actionableSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '④ 具體行動建議：提出 3 個可實際執行的具體行動方向，每點簡明扼要。',
            },
            oneLineSummary: {
              type: Type.STRING,
              description:
                '⑤ 一句話總結：以簡潔、有啟發性且契合卦意的語句收尾（約 20~40 字）。',
            },
          },
          required: [
            'coreEssence',
            'questionAnalysis',
            'blindSpots',
            'actionableSteps',
            'oneLineSummary',
          ],
          propertyOrdering: [
            'coreEssence',
            'questionAnalysis',
            'blindSpots',
            'actionableSteps',
            'oneLineSummary',
          ],
        },
      },
    });

    const jsonText = (response.text ?? '').trim();
    if (!jsonText) {
      res.status(502).json({ error: 'EMPTY_RESPONSE', message: 'AI 未回傳有效內容' });
      return;
    }

    const parsedData = JSON.parse(jsonText);
    res.json({ data: parsedData });
  } catch (err: any) {
    console.error('Gemini API reading error:', err);
    const msg = String(err?.message || '');
    const status = err?.status || err?.statusCode;

    if (
      msg.includes('API_KEY_INVALID') ||
      msg.includes('API key not valid') ||
      status === 401 ||
      status === 403
    ) {
      res.status(401).json({ error: 'API_KEY_INVALID' });
      return;
    }

    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || status === 429) {
      res.status(429).json({ error: 'RATE_LIMIT_EXCEEDED' });
      return;
    }

    res.status(500).json({ error: 'SERVER_ERROR', message: msg || 'Internal server error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
