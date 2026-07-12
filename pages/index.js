export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 60, textAlign: "center" }}>
      <h1>AI Proxy</h1>
      <div style={{ marginTop: 30, fontSize: 18 }}>
        <a href="/chatgpt/" style={{ marginRight: 20 }}>ChatGPT</a>
        <a href="/claude/">Claude</a>
      </div>
    </div>
  );
}
