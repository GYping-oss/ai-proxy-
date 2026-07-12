import type { NextApiRequest, NextApiResponse } from 'next';

const TARGETS: Record<string, string> = {
  chatgpt: 'https://chatgpt.com',
  claude: 'https://claude.ai',
};

export const config = {
  api: { bodyParser: false, externalResolver: true },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { target, path } = req.query as { target: string; path: string };
  const baseUrl = TARGETS[target];
  if (!baseUrl) return res.status(400).json({ error: 'Unknown target' });

  const targetUrl = `${baseUrl}/${(path || '').replace(/^\//, '')}`;
  
  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([k, v]) => {
    if (!['host', 'x-forwarded-host', 'connection'].includes(k)) {
      headers[k] = Array.isArray(v) ? v[0] : v || '';
    }
  });
  headers['host'] = new URL(baseUrl).host;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? (req as any).body : undefined,
      redirect: 'manual',
    });

    res.status(response.status);
    response.headers.forEach((v, k) => {
      if (!['content-security-policy', 'x-frame-options', 'content-encoding'].includes(k.toLowerCase())) {
        res.setHeader(k, v);
      }
    });
    res.setHeader('access-control-allow-origin', '*');

    if (response.body) {
      const reader = (response.body as any).getReader();
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (e: any) {
    res.status(502).json({ error: e.message });
  }
}
