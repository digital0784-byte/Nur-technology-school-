import React from 'react';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphSeries {
  name: string;
  points: GraphPoint[];
}

export interface GraphData {
  title: string;
  type: 'line' | 'bar' | 'scatter';
  xLabel: string;
  yLabel: string;
  series: GraphSeries[];
  caption?: string;
}

interface SimpleChartProps {
  graph: GraphData;
}

const SERIES_COLORS = [
  '#059669', // Emerald
  '#2563eb', // Blue
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Pink
];

export const SimpleChart: React.FC<SimpleChartProps> = ({ graph }) => {
  if (!graph || !Array.isArray(graph.series) || graph.series.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs text-slate-400">
        የግራፍ መረጃ አልተገኘም / No graph data available
      </div>
    );
  }

  // Extract all points
  const allPoints: GraphPoint[] = [];
  graph.series.forEach((s) => {
    if (Array.isArray(s.points)) {
      s.points.forEach((pt) => {
        if (typeof pt.x === 'number' && !isNaN(pt.x) && typeof pt.y === 'number' && !isNaN(pt.y)) {
          allPoints.push(pt);
        }
      });
    }
  });

  if (allPoints.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs text-slate-400">
        የግራፍ ነጥቦች አልተገኙም / No chart points to display
      </div>
    );
  }

  // Chart dimensions & layout
  const width = 520;
  const height = 300;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 55;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // Extents
  let minX = Math.min(...allPoints.map((p) => p.x));
  let maxX = Math.max(...allPoints.map((p) => p.x));
  let minY = Math.min(...allPoints.map((p) => p.y));
  let maxY = Math.max(...allPoints.map((p) => p.y));

  // Zero-baseline for bar charts if all positive
  if (graph.type === 'bar' && minY >= 0) {
    minY = 0;
  }

  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }

  // Add small padding to Y extent
  const ySpan = maxY - minY;
  const yPadding = ySpan * 0.08;
  const effectiveMinY = graph.type === 'bar' && minY === 0 ? 0 : minY - yPadding;
  const effectiveMaxY = maxY + yPadding;

  const toSvgX = (x: number) => {
    return padLeft + ((x - minX) / (maxX - minX)) * plotW;
  };

  const toSvgY = (y: number) => {
    return padTop + plotH - ((y - effectiveMinY) / (effectiveMaxY - effectiveMinY)) * plotH;
  };

  // Generate 5 Y-ticks
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => {
    const val = effectiveMinY + (i / (yTickCount - 1)) * (effectiveMaxY - effectiveMinY);
    return {
      val,
      svgY: toSvgY(val),
    };
  });

  // Generate 5 X-ticks
  const xTickCount = 5;
  const xTicks = Array.from({ length: xTickCount }, (_, i) => {
    const val = minX + (i / (xTickCount - 1)) * (maxX - minX);
    return {
      val,
      svgX: toSvgX(val),
    };
  });

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(1);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
          {graph.title || 'ሳይንሳዊ ግራፍ / Scientific Graph'}
        </h4>
        {graph.series.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {graph.series.map((s, idx) => {
              const color = SERIES_COLORS[idx % SERIES_COLORS.length];
              return (
                <div key={idx} className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span>{s.name || `ተከታታይ ${idx + 1}`}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-full h-auto text-slate-500 font-sans select-none"
          style={{ minWidth: '320px' }}
        >
          {/* Grid lines and Y labels */}
          {yTicks.map((t, i) => (
            <g key={`ytick-${i}`}>
              <line
                x1={padLeft}
                y1={t.svgY}
                x2={width - padRight}
                y2={t.svgY}
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 8}
                y={t.svgY + 4}
                textAnchor="end"
                fontSize="10"
                className="fill-slate-500 dark:fill-slate-400 font-mono"
              >
                {formatNumber(t.val)}
              </text>
            </g>
          ))}

          {/* Grid lines and X labels */}
          {xTicks.map((t, i) => (
            <g key={`xtick-${i}`}>
              <line
                x1={t.svgX}
                y1={padTop}
                x2={t.svgX}
                y2={height - padBottom}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="2 2"
              />
              <text
                x={t.svgX}
                y={height - padBottom + 16}
                textAnchor="middle"
                fontSize="10"
                className="fill-slate-500 dark:fill-slate-400 font-mono"
              >
                {formatNumber(t.val)}
              </text>
            </g>
          ))}

          {/* Main X and Y Axes */}
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={height - padBottom}
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
          <line
            x1={padLeft}
            y1={height - padBottom}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={padLeft + plotW / 2}
            y={height - 12}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            className="fill-slate-700 dark:fill-slate-300"
          >
            {graph.xLabel}
          </text>
          <text
            x={16}
            y={padTop + plotH / 2}
            textAnchor="middle"
            transform={`rotate(-90, 16, ${padTop + plotH / 2})`}
            fontSize="11"
            fontWeight="bold"
            className="fill-slate-700 dark:fill-slate-300"
          >
            {graph.yLabel}
          </text>

          {/* Render Series Data */}
          {graph.series.map((s, sIdx) => {
            const color = SERIES_COLORS[sIdx % SERIES_COLORS.length];
            const sortedPoints = [...(s.points || [])]
              .filter((pt) => typeof pt.x === 'number' && typeof pt.y === 'number' && !isNaN(pt.x) && !isNaN(pt.y))
              .sort((a, b) => a.x - b.x);

            if (sortedPoints.length === 0) return null;

            // Bar Chart
            if (graph.type === 'bar') {
              const barWidth = Math.max(6, Math.min(36, (plotW / sortedPoints.length) * 0.6));
              const baselineY = toSvgY(0);

              return (
                <g key={`bar-series-${sIdx}`}>
                  {sortedPoints.map((pt, pIdx) => {
                    const cx = toSvgX(pt.x);
                    const cy = toSvgY(pt.y);
                    const barY = Math.min(cy, baselineY);
                    const barH = Math.max(2, Math.abs(cy - baselineY));
                    return (
                      <rect
                        key={`bar-${pIdx}`}
                        x={cx - barWidth / 2}
                        y={barY}
                        width={barWidth}
                        height={barH}
                        fill={color}
                        rx="3"
                        opacity="0.85"
                        className="hover:opacity-100 transition-opacity"
                      >
                        <title>{`${s.name || ''}: (${pt.x}, ${pt.y})`}</title>
                      </rect>
                    );
                  })}
                </g>
              );
            }

            // Scatter Chart
            if (graph.type === 'scatter') {
              return (
                <g key={`scatter-series-${sIdx}`}>
                  {sortedPoints.map((pt, pIdx) => (
                    <circle
                      key={`pt-${pIdx}`}
                      cx={toSvgX(pt.x)}
                      cy={toSvgY(pt.y)}
                      r="4.5"
                      fill={color}
                      opacity="0.9"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    >
                      <title>{`${s.name || ''}: (${pt.x}, ${pt.y})`}</title>
                    </circle>
                  ))}
                </g>
              );
            }

            // Line Chart (default)
            const pathD = sortedPoints
              .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(pt.x)} ${toSvgY(pt.y)}`)
              .join(' ');

            return (
              <g key={`line-series-${sIdx}`}>
                <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {sortedPoints.map((pt, pIdx) => (
                  <circle
                    key={`dot-${pIdx}`}
                    cx={toSvgX(pt.x)}
                    cy={toSvgY(pt.y)}
                    r="3.5"
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  >
                    <title>{`${s.name || ''}: (${pt.x}, ${pt.y})`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Caption */}
      {graph.caption && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic text-center sm:text-left pt-1 border-t border-slate-100 dark:border-slate-800">
          💡 {graph.caption}
        </p>
      )}
    </div>
  );
};
