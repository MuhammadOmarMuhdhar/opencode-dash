<script>
  export let data = [];
  export let date = 'date';
  export let value = 'value';
  export let title = '';
  export let subtitle = '';
  export let colorScale = ['#f6f8fa', '#6baed6', '#3182bd', '#08519c', '#08306b'];
  export let yearLabel = false;
  export let dayLabel = false;
  export let chartAreaHeight = 180;

  let tooltip = { show: false, x: 0, y: 0, date: '', value: '' };

  const cellGap = 2;
  const topOffset = 18;
  $: leftOffset = dayLabel ? 28 : 0;

  const cellSize = 16;

  $: records = data
    .map(d => ({ date: new Date(d[date]), value: +d[value] }))
    .filter(d => !isNaN(d.date));

  $: valueExtent = [
    records.length ? Math.min(...records.map(d => d.value)) : 0,
    records.length ? Math.max(...records.map(d => d.value)) : 1
  ];

  function hexToRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }

  function interpolateColor(t, c1, c2) {
    const [r1, g1, b1] = hexToRgb(c1);
    const [r2, g2, b2] = hexToRgb(c2);
    const r = Math.round(r1 + t * (r2 - r1));
    const g = Math.round(g1 + t * (g2 - g1));
    const b = Math.round(b1 + t * (b2 - b1));
    return `rgb(${r}, ${g}, ${b})`;
  }

  $: color = (v) => {
    const [min, max] = valueExtent;
    if (v === 0 || v == null) return colorScale[0];
    if (max === min) return colorScale[1];
    const t = (v - min) / (max - min);
    return interpolateColor(Math.max(0, Math.min(1, t)), colorScale[0], colorScale[1]);
  };

  $: valueByDate = new Map(records.map(d => [d.date.toDateString(), d.value]));

  function startOfWeek(d) {
    const r = new Date(d);
    const day = r.getDay();
    const offset = day === 0 ? 6 : day - 1;
    r.setDate(r.getDate() - offset);
    r.setHours(0, 0, 0, 0);
    return r;
  }

  $: minYear = records.length
    ? Math.min(...records.map(d => d.date.getFullYear()))
    : new Date().getFullYear();
  $: maxYear = records.length
    ? Math.max(...records.map(d => d.date.getFullYear()))
    : new Date().getFullYear();

  $: startDate = new Date(minYear, 0, 1);
  $: endDate = new Date(maxYear, 11, 31);

  $: gridStart = startOfWeek(startDate);
  $: totalDays = Math.ceil((endDate - gridStart) / 86400000) + 7;
  $: totalWeeks = Math.ceil(totalDays / 7);

  $: days = Array.from({ length: totalWeeks * 7 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  $: monthLabels = (() => {
    const labels = [];
    let last = -1;
    for (let w = 0; w < totalWeeks; w++) {
      const d = days[w * 7];
      const m = d.getMonth();
      if (m !== last) {
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        labels.push({ week: w, label: month });
        last = m;
      }
    }
    return labels;
  })();

  $: svgWidth = totalWeeks * (cellSize + cellGap) + leftOffset + 4;
  $: svgHeight = 7 * (cellSize + cellGap) + topOffset + 4;

  function fmtDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function showTooltip(e, d, v) {
    tooltip = {
      show: true,
      x: e.clientX + 12,
      y: e.clientY - 12,
      date: fmtDate(d),
      value: v !== undefined ? `${v} session${v === 1 ? '' : 's'}` : 'No data'
    };
  }

  function moveTooltip(e) {
    tooltip = { ...tooltip, x: e.clientX + 12, y: e.clientY - 12 };
  }

  function hideTooltip() {
    tooltip = { ...tooltip, show: false };
  }
</script>

<div class="calendar-heatmap">
  {#if title}<div class="chart-title">{title}</div>{/if}
  {#if subtitle}<div class="chart-subtitle">{subtitle}</div>{/if}

  <div class="heatmap-scroll">
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${leftOffset}, ${topOffset})`}>
        {#each monthLabels as m}
          <text x={m.week * (cellSize + cellGap)} y={-6} font-size="10" fill="#656d76">
            {m.label}
          </text>
        {/each}

        {#each days as d, i}
          {@const week = Math.floor(i / 7)}
          {@const dow = i % 7}
          {@const v = valueByDate.get(d.toDateString())}
          <rect
            x={week * (cellSize + cellGap)}
            y={dow * (cellSize + cellGap)}
            width={cellSize}
            height={cellSize}
            rx="2"
            ry="2"
            fill={color(v)}
            stroke="#e2e8f0"
            stroke-width="1"
            on:mouseenter={(e) => showTooltip(e, d, v)}
            on:mousemove={moveTooltip}
            on:mouseleave={hideTooltip}
          />
        {/each}
      </g>
    </svg>
  </div>

  {#if tooltip.show}
    <div class="heatmap-tooltip" style="left: {tooltip.x}px; top: {tooltip.y}px;">
      <div class="tooltip-date">{tooltip.date}</div>
      <div class="tooltip-value">{tooltip.value}</div>
    </div>
  {/if}
</div>

<style>
  .calendar-heatmap {
    font-family: inherit;
    position: relative;
  }
  .chart-title {
    font-weight: 600;
    font-size: 14px;
    color: #1a1a1a;
  }
  .chart-subtitle {
    font-size: 12px;
    color: #656d76;
    margin-bottom: 8px;
  }
  .heatmap-scroll {
    overflow-x: auto;
    max-width: 100%;
  }
  rect {
    cursor: pointer;
    transition: filter 0.1s;
  }
  rect:hover {
    filter: brightness(0.85);
    stroke: #1a1a1a;
  }
  .heatmap-tooltip {
    position: fixed;
    z-index: 9999;
    background: #1a1a1a;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.4;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    white-space: nowrap;
  }
  .tooltip-date {
    color: #9ca3af;
    font-size: 11px;
  }
  .tooltip-value {
    font-weight: 600;
  }
</style>
