/* ─── Rotating Globe Component ────────────────────────────────────────────── */
const RotatingGlobe = () => {
  return (
    <div className="w-full h-full min-h-[240px] sm:min-h-[300px] md:min-h-[340px] relative flex items-center justify-center px-4">

      {/* Outer slow pulse ring */}
      <div
        className="absolute rounded-full animate-ping"
        style={{
          width: "clamp(240px, 80vw, 320px)",
          height: "clamp(240px, 80vw, 320px)",
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
          animationDuration: "3s",
        }}
      />

      {/* Mid glow — teal */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(280px, 90vw, 350px)",
          height: "clamp(280px, 90vw, 350px)",
          background: "radial-gradient(circle, rgba(3,218,197,0.13) 0%, transparent 65%)",
          filter: "blur(32px)",
        }}
      />

      {/* Core glow — orange, tight */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(220px, 70vw, 275px)",
          height: "clamp(220px, 70vw, 275px)",
          background: "radial-gradient(circle, rgba(249,115,22,0.28) 0%, rgba(251,146,60,0.12) 45%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* Soft white inner bloom */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(140px, 45vw, 168px)",
          height: "clamp(140px, 45vw, 168px)",
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      {/* Globe GIF — sits on top of all glows */}
      <img
        src="/Globe.gif"
        alt="Rotating Globe"
        className="relative z-10 w-full h-full object-contain max-w-[280px] sm:max-w-[340px] md:max-w-[380px] max-h-[280px] sm:max-h-[340px] md:max-h-[380px]"
        style={{ filter: "drop-shadow(0 0 32px rgba(249,115,22,0.5)) drop-shadow(0 0 64px rgba(3,218,197,0.2))" }}
      />
    </div>
  );
};

export default RotatingGlobe;
