import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 60, textAlign: "center" }}>
      <h1>AI Proxy</h1>
      <div style={{ marginTop: 30, fontSize: 18 }}>
        <Link href="/chatgpt/" style={{ marginRight: 20 }}>ChatGPT</Link>
        <Link href="/claude/">Claude</Link>
      </div>
    </div>
  );
}
