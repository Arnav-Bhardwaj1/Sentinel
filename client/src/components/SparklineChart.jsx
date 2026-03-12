import React, { useMemo, useRef, useEffect, useState } from "react";

const SparklineChart = ({
  data = [],
  width = 120,
  height = 40,
  strokeColor = "#f97316",
  fillColor = "rgba(249,115,22,0.12)",
}) => {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(500);

  const points = useMemo(() => {
    if (!data.length) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const usableW = width - padding * 2;
    const usableH = height - padding * 2;
    return data.map((val, i) => ({
      x: padding + (i / Math.max(data.length - 1, 1)) * usableW,
      y: padding + usableH - ((val - min) / range) * usableH,
    }));
  }, [data, width, height]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [points]);

  if (!points.length) return null;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`spark-grad-${strokeColor.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="100%" stopColor="#03dac5" />
        </linearGradient>
        <filter id="spark-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Fill area */}
      <path d={areaPath} fill={fillColor} opacity="0.6" />

      {/* Glow line */}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#spark-glow)"
        opacity="0.3"
      />

      {/* Main line with draw animation */}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke={`url(#spark-grad-${strokeColor.replace("#", "")})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-sparkDraw"
        style={{
          "--spark-length": pathLength,
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        }}
      />

      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={strokeColor}
        className="animate-pulse"
        style={{ animationDuration: "2s" }}
      />
    </svg>
  );
};

export default SparklineChart;
