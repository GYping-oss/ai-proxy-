const TARGETS = {
  chatgpt: 'https://chatgpt.com',
  claude: 'https://claude.ai',
};

export const config = {
  api: { bodyParser: false, externalResolver: true },
};

export default async function handler(req, res) {
  const { target, path } = req.query;
  const baseUrl = TARGETS[target];
  if (!baseUrl) return res.status(400).json({ error: 'Unknown target' });

  const targetUrl = `${baseUrl}/${(path || '').replace(/^\//, '')}`;

  const headers = {};
  Object.entries(req.headers).forEach(([k, v]) => {
    if (!['host', 'x-forwarded-host', 'connection'].includes(k)) {
      headers[k] = Array.isArray(v) ? v[0] : v || '';
    }
  });
  headers['host'] = new URL(baseUrl).host;
  headers['accept-encoding'] = 'identity';

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
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
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
