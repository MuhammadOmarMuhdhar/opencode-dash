---
title: Models
---

# Model Performance

## Model Distribution

```sql model_distribution
  select
      modelId,
      provider,
      sessionCount,
      totalCost,
      totalTokens,
      avgCostPerSession
  from opencode.modelDistribution
  order by sessionCount desc
```

<BarChart
    data={model_distribution}
    x=modelId
    y=sessionCount
    series=provider
    title="Sessions by Model"
/>

<DataTable data={model_distribution}>
    <Column id=modelId />
    <Column id=provider />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
    <Column id=totalTokens contentType=number fmt=num0 />
    <Column id=avgCostPerSession contentType=number fmt=usd />
</DataTable>

---

## Cost Efficiency

```sql model_efficiency
  select
      modelId,
      provider,
      totalCost,
      totalTokens,
      round(totalTokens * 1.0 / nullif(totalCost, 0), 0) as tokens_per_dollar
  from opencode.modelDistribution
  order by tokens_per_dollar desc
```

<BarChart
    data={model_efficiency}
    x=modelId
    y=tokens_per_dollar
    title="Tokens per Dollar (Cost Efficiency)"
    fmt=num0
/>

---

## Model Switches

```sql model_switches
  select
      modelId,
      provider,
      switches
  from opencode.modelSwitchFrequency
  order by switches desc
```

<DataTable data={model_switches}>
    <Column id=modelId />
    <Column id=provider />
    <Column id=switches contentType=number fmt=num0 />
</DataTable>

---

## Model Usage by Day

```sql model_by_day
  select
      date,
      modelId,
      provider,
      sessions,
      cost
  from opencode.modelUsageByDay
  order by date, sessions desc
```

<LineChart
    data={model_by_day}
    x=date
    y=sessions
    series=modelId
    title="Daily Sessions by Model"
/>
