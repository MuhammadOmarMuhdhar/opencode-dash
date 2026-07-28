---
title: Opencode Dash
---

<!-- Open-source dashboard that visualizes your opencode usage.  -->

<!-- The data stays on your device, there's no backend, no account, and nothing gets sent anywhere. -->

<!-- Source on [GitHub](https://github.com/your-org/opencode-telematics). -->


```sql overview
WITH filtered_sessions AS (
  SELECT * FROM opencode.sessionRows
  WHERE ('${inputs.dateRange.start}' = '' OR session_date >= '${inputs.dateRange.start}')
    AND ('${inputs.dateRange.end}' = '' OR session_date <= '${inputs.dateRange.end}')
)
SELECT
  (SELECT COUNT(*) FROM filtered_sessions) as total_sessions,
  (SELECT SUM(message_count) FROM opencode.messageCounts WHERE session_id IN (SELECT id FROM filtered_sessions)) as total_messages,
  (SELECT SUM(part_count) FROM opencode.partCounts WHERE session_id IN (SELECT id FROM filtered_sessions)) as total_parts,
  (SELECT COUNT(DISTINCT display_name) FROM opencode.projectInfo WHERE id IN (SELECT project_id FROM filtered_sessions)) as total_projects,
  COALESCE(ROUND(SUM(cost), 6), 0) as total_cost,
  COALESCE(SUM(tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write), 0) as total_tokens,
  COALESCE(ROUND(AVG(cost), 6), 0) as avg_session_cost,
  COALESCE(ROUND(
    (SELECT SUM(message_count) FROM opencode.messageCounts WHERE session_id IN (SELECT id FROM filtered_sessions)) * 1.0 / (SELECT COUNT(*) FROM filtered_sessions), 2
  ), 0) as avg_messages_per_session,
  (SELECT MIN(session_date) FROM filtered_sessions) as date_from,
  (SELECT MAX(session_date) FROM filtered_sessions) as date_to
FROM filtered_sessions
```

<ShareSection title="Activity" sectionId="activity-section">

## Activity

<DateRange name="dateRange" start="2024-01-01" title="Date Range" presetRanges={['Last 7 Days', 'Last 30 Days', 'Year to Date', 'Last 90 Days', 'All Time']} defaultValue='All Time' />

<!-- <Value data={overview} column=date_from fmt="mmm d, yyyy"/> - <Value data={overview} column=date_to fmt="mmm d, yyyy"/> -->

<Grid cols=3>

<BigValue data={overview} value=total_sessions title="Sessions" />
<BigValue data={overview} value=total_messages title="Messages" />
<BigValue data={overview} value=total_tokens title="Tokens" />

<!-- <BigValue data={overview} value=total_cost title="Total Cost" fmt=usd0 />
<BigValue data={overview} value=avg_session_cost title="Avg Cost / Session" fmt=usd2 />
<BigValue data={overview} value=avg_messages_per_session title="Avg Messages / Session" fmt=num1 /> -->

</Grid>

<br>

```sql sessions_over_time
select * from opencode.sessionsOverTime
where ('${inputs.dateRange.start}' = '' OR session_date >= '${inputs.dateRange.start}')
  AND ('${inputs.dateRange.end}' = '' OR session_date <= '${inputs.dateRange.end}')
```

<CalendarHeatmap
  data={sessions_over_time}
  date="session_date"
  value="tokens"
  title="Daily Activity"
  subtitle="Tokens consumer per day"
  yearLabel={true}
  dayLabel={true}
  chartAreaHeight={150}
  legend={false}
  downloadableImage="true"
  downloadableData="true"
/>

```sql model_distribution
WITH filtered AS (
  SELECT * FROM opencode.sessionRows
  WHERE model IS NOT NULL AND model != ''
    AND ('${inputs.dateRange.start}' = '' OR session_date >= '${inputs.dateRange.start}')
    AND ('${inputs.dateRange.end}' = '' OR session_date <= '${inputs.dateRange.end}')
)
SELECT
  modelId,
  provider,
  COUNT(*) as sessionCount,
  ROUND(SUM(cost), 6) as totalCost,
  SUM(tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write) as totalTokens,
  ROUND(AVG(cost), 6) as avgCostPerSession
FROM filtered
GROUP BY modelId, provider
ORDER BY totalTokens desc
```
<div style="height: 300px;">
<ECharts config={
    {
        title: { text: 'Tokens by Model', subtext: 'Per-model token distribution', left: 'left' },
        tooltip: { trigger: 'item', appendToBody: true },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                data: [...model_distribution].map(d => ({
                    name: d.modelId,
                    value: d.totalTokens
                }))
            }
        ]
    }
} downloadableImage="true" downloadableData="true"/>
</div>

<!-- <LinkButton url='/activity'>See full activity breakdown →</LinkButton> -->

</ShareSection>

<!-- ----- -->

<div style="padding: 24px">

## Costing

You have used **<Value data={overview} column=total_cost fmt=usd2 />** in tokens this period (<Value data={overview} column=date_from fmt="mmm d, yyyy"/> – <Value data={overview} column=date_to fmt="mmm d, yyyy"/>).


<!-- <DataTable data={model_distribution}>
    <Column id=modelId title="Model" />
    <Column id=totalTokens contentType=number fmt=num0 title="Tokens" />
    <Column id=totalCost contentType=number fmt=usd title="Cost" />
</DataTable> -->

```sql daily_cost_by_model
select * from opencode.modelUsageByDay
where ('${inputs.dateRange.start}' = '' OR session_date >= '${inputs.dateRange.start}')
  AND ('${inputs.dateRange.end}' = '' OR session_date <= '${inputs.dateRange.end}')
```

<BarChart
    data={daily_cost_by_model}
    x=session_date
    y=cost
    series=modelId
    title="Daily Costs"
    subtitle="Cost breakdown by model per day"
    fmt=usd
    echartsOptions={{ yAxis: { minInterval: 1, axisLabel: { formatter: (value) => Math.round(value) } }, legend: { left: 'left', top: 45 }, grid: { top: 80 } }}
/>


```sql project_list
WITH parsed AS (
  SELECT *,
    length(display_name) - length(replace(display_name, '/', '')) as slash_count
  FROM opencode.projectInfo
),
short_paths AS (
  SELECT id, vcs, timeCreated, timeUpdated,
    CASE
      WHEN slash_count = 0 THEN display_name
      WHEN slash_count = 1 THEN regexp_extract(display_name, '([^/]+)$', 1)
      ELSE regexp_extract(display_name, '([^/]+/[^/]+)$', 1)
    END as short_path
  FROM parsed
)
SELECT
  sp.short_path as project,
  COUNT(s.id) as sessionCount,
  ROUND(SUM(COALESCE(s.cost, 0)), 6) as totalCost,
  SUM(COALESCE(s.tokens_input, 0) + COALESCE(s.tokens_output, 0) + COALESCE(s.tokens_reasoning, 0) + COALESCE(s.tokens_cache_read, 0) + COALESCE(s.tokens_cache_write, 0)) as totalTokens
FROM short_paths sp
LEFT JOIN opencode.sessionRows s ON s.project_id = sp.id
  AND ('${inputs.dateRange.start}' = '' OR s.session_date >= '${inputs.dateRange.start}')
  AND ('${inputs.dateRange.end}' = '' OR s.session_date <= '${inputs.dateRange.end}')
GROUP BY sp.short_path
ORDER BY sessionCount DESC
```

<DataTable data={project_list} title="Projects" subtitle="Token usage and cost by project">
    <Column id=project />
    <Column id=sessionCount contentType=number fmt=num0 title="Sessions" />
    <Column id=totalTokens contentType=number fmt=num0 title="Tokens" />
    <Column id=totalCost contentType=number fmt=usd title="Cost" />
</DataTable>

<!-- <LinkButton url='/cost'>See full cost breakdown →</LinkButton> -->

</div>
