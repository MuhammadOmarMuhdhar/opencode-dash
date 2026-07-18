---
title: Opencode Telematics 
---

Open-source dashboard that visualizes your opencode usage. The data stays on your device, there's no backend, no account, and nothing gets sent anywhere.

Source on [GitHub](https://github.com/your-org/opencode-telematics).

--

```sql overview
select
      total_sessions,
      total_messages,
      total_parts,
      total_projects,
      total_cost,
      total_tokens,
      avg_session_cost,
      avg_messages_per_session,
      date_from,
      date_to
from opencode.overviewStats
```

## Activity

<Value data={overview} column=date_from fmt="mmm d, yyyy"/> - <Value data={overview} column=date_to fmt="mmm d, yyyy"/>

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
select
      date,
      sessions,
      messages,
      cost,
      tokens
from opencode.sessionsOverTime
order by date
```

<CalendarHeatmap
  data={sessions_over_time}
  date="date"
  value="sessions"
  title="Daily Activity"
  subtitle="Opencode sessions per day"
  yearLabel={true}
  dayLabel={true}
  chartAreaHeight={150}
  legend={false}
/>

```sql model_distribution
select
      modelId,
      sessionCount,
      totalCost,
      totalTokens
from opencode.modelDistribution
order by totalTokens desc
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
}/>
</div>

<LinkButton url='/activity'>See full activity breakdown →</LinkButton>

-----

# Costing

You have used **<Value data={overview} column=total_cost fmt=usd2 />** in tokens this period (<Value data={overview} column=date_from fmt="mmm d, yyyy"/> – <Value data={overview} column=date_to fmt="mmm d, yyyy"/>).


<!-- <DataTable data={model_distribution}>
    <Column id=modelId title="Model" />
    <Column id=totalTokens contentType=number fmt=num0 title="Tokens" />
    <Column id=totalCost contentType=number fmt=usd title="Cost" />
</DataTable> -->

```sql daily_cost_by_model
select date, modelId, cost
from opencode.modelUsageByDay
order by date
```

<BarChart
    data={daily_cost_by_model}
    x=date
    y=cost
    series=modelId
    title="Daily Costs"
    subtitle="Cost breakdown by model per day"
    fmt=usd
    echartsOptions={{ yAxis: { minInterval: 1, axisLabel: { formatter: (value) => Math.round(value) } }, legend: { left: 'left', top: 45 }, grid: { top: 80 } }}
/>


```sql project_list
select
      project,
      vcs,
      sessionCount as Sessions,
      totalTokens as Tokens,
      totalCost as Cost
from opencode.projectCostList
```

<DataTable data={project_list} title="Projects" subtitle="Token usage and cost by project">
    <Column id=project />
    <Column id=Sessions contentType=number fmt=num0 />
    <Column id=Tokens contentType=number fmt=num0 />
    <Column id=Cost contentType=number fmt=usd />
</DataTable>

<LinkButton url='/cost'>See full cost breakdown →</LinkButton>
