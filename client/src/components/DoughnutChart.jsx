import React, { useState, useMemo } from "react";

const COLORS = [
  "#f97316", "#03dac5", "#fb923c", "#14b8a6",
  "#fdba74", "#5eead4", "#ea580c", "#2dd4bf",
];

const DoughnutChart = ({ segments = [], unit = "ETH" }) => {
  const [hovered, setHovered] = useState(null);

  const total = useMemo(
    () => segments.reduce((sum, s) => sum + (s.value || 0), 0),
    [segments]
  );

  // Calculate stroke-dasharray segments
  const RADIUS = 80;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const arcs = useMemo(() => {
    let offset = 0;
    return segments.map((seg, idx) => {
      const pct = total > 0 ? seg.value / total : 0;
      const dash = pct * CIRCUMFERENCE;
      const currentOffset = offset;
      offset += dash;
      return {
        ...seg,
        dash,
        gap: CIRCUMFERENCE - dash,
        offset: -currentOffset,
        color: COLORS[idx % COLORS.length],
        pct: pct * 100,
      };
    });
  }, [segments, total]);

  if (!segments.length || total === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="font-epilogue text-sm text-white/30">No category data</p>
      </div>
    );
  }

  const centerLabel = hovered !== null ? arcs[hovered] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
      {/* SVG Ring */}
      <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {/* Background ring */}
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="24" />

          {/* Data arcs */}
          {arcs.map((arc, idx) => (
            <circle
              key={idx}
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={hovered === idx ? 30 : 24}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
              className="transition-all duration-300 cursor-pointer animate-ringDraw"
              style={{
                "--ring-circumference": CIRCUMFERENCE,
                "--ring-target": arc.offset,
                animationDelay: `${idx * 0.15}s`,
                filter: hovered === idx ? `drop-shadow(0 0 8px ${arc.color})` : "none",
                opacity: hovered !== null && hovered !== idx ? 0.4 : 1,
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel ? (
            <>
              <p className="font-jakarta font-bold text-lg text-white leading-none">
                {centerLabel.value.toFixed(2)}
              </p>
              <p className="font-epilogue text-[10px] text-white/40 mt-1">{unit}</p>
              <p className="font-epilogue text-[10px] text-[#fdba74] mt-0.5">
                {centerLabel.pct.toFixed(1)}%
              </p>
            </>
          ) : (
            <>
              <p className="font-jakarta font-bold text-lg text-white leading-none">
                {total.toFixed(2)}
              </p>
              <p className="font-epilogue text-[10px] text-white/40 mt-1">Total {unit}</p>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {arcs.map((arc, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${hovered === idx ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
              }`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-200"
              style={{
                background: arc.color,
                boxShadow: hovered === idx ? `0 0 8px ${arc.color}` : "none",
                transform: hovered === idx ? "scale(1.3)" : "scale(1)",
              }}
            />
            <span className="font-epilogue text-xs text-white/70 truncate flex-1">
              {arc.label}
            </span>
            <span className="font-jakarta font-semibold text-xs text-white/50 flex-shrink-0">
              {arc.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
