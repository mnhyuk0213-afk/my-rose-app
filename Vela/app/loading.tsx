export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }} role="status" aria-label="로딩 중">
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, border: "4px solid #E5E8EB", borderTopColor: "#3182F6",
          borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 }}>페이지를 불러오는 중입니다</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}
