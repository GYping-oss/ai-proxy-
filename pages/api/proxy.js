export const config = {
  runtime: 'edge',
};

const TARGETS = {
  chatgpt: 'https://chatgpt.com',
  claude: 'https://claude.ai',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('target');
  const path = url.searchParams.get('path') || '';
  const baseUrl = TARGETS[target];
  
  if (!baseUrl) return new Response('Unknown target', { status: 400 });

  const targetUrl = `${baseUrl}/${path.replace(/^\//, '')}${url.search.replace(/^\?/, '').replace(/&?target=[^&]*/, '').replace(/&?path=[^&]*/, '') ? '?' + url.search.replace(/^\?/, '').replace(/&?target=[^&]*/, '').replace(/&?path=[^&]*/, '') : ''}`;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(baseUrl).host);
  ['x-forwarded-host', 'x-real-ip', 'x-vercel-ip', 'x-vercel-proxy'].forEach(h => headers.delete(h));

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'manual',
    });

    const resHeaders = new Headers(response.headers);
    ['content-security-policy', 'x-frame-options'].forEach(h => resHeaders.delete(h));
    resHeaders.set('access-control-allow-origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (e) {
    return new Response(e.message, { status: 502 });
  }
}
