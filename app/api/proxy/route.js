export const runtime = 'edge';

const TARGETS = {
  chatgpt: 'https://chatgpt.com',
  claude: 'https://claude.ai',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const path = searchParams.get('path') || '';
  const baseUrl = TARGETS[target];
  if (!baseUrl) return new Response('Unknown target', { status: 400 });

  const targetUrl = `${baseUrl}/${path.replace(/^\//, '')}`;
  
  const headers = new Headers();
  headers.set('host', new URL(baseUrl).host);
  headers.set('user-agent', request.headers.get('user-agent') || 'Mozilla/5.0');

  try {
    const response = await fetch(targetUrl, { headers, redirect: 'manual' });
    const resHeaders = new Headers(response.headers);
    ['content-security-policy', 'x-frame-options'].forEach(h => resHeaders.delete(h));
    return new Response(response.body, { status: response.status, headers: resHeaders });
  } catch (e) {
    return new Response(e.message, { status: 502 });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const path = searchParams.get('path') || '';
  const baseUrl = TARGETS[target];
  if (!baseUrl) return new Response('Unknown target', { status: 400 });

  const targetUrl = `${baseUrl}/${path.replace(/^\//, '')}`;
  const headers = new Headers(request.headers);
  headers.set('host', new URL(baseUrl).host);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: request.body,
      redirect: 'manual',
    });
    const resHeaders = new Headers(response.headers);
    ['content-security-policy', 'x-frame-options'].forEach(h => resHeaders.delete(h));
    return new Response(response.body, { status: response.status, headers: resHeaders });
  } catch (e) {
    return new Response(e.message, { status: 502 });
  }
}
