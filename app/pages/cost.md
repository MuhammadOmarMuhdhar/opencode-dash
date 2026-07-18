---
title: Cost & Tokens
---

# Cost & Token Economics

## Summary

```sql cost_summary
  select
      total_cost,
      total_tokens,
      total_input,
      total_output,
      total_reasoning,
      total_cache_read,
      total_cache_write
  from opencode.costSummary
```

<BigValue data={cost_summary} value=total_cost title="Total Spend" fmt=usd />
<BigValue data={cost_summary} value=total_tokens title="Total Tokens" />
<BigValue data={cost_summary} value=total_cache_read title="Cache Read Tokens" />

---

## Token Breakdown

```sql token_breakdown
  select
      'Input' as category,
      total_input as tokens
  from opencode.costSummary
  union all
  select
      'Output',
      total_output
  from opencode.costSummary
  union all
  select
      'Reasoning',
      total_reasoning
  from opencode.costSummary
  union all
  select
      'Cache Read',
      total_cache_read
  from opencode.costSummary
  union all
  select
      'Cache Write',
      total_cache_write
  from opencode.costSummary
```

<BarChart
    data={token_breakdown}
    x=category
    y=tokens
    title="Token Breakdown"
    fmt=num0
/>

---

## Daily Cost

```sql daily_cost
  select
      date,
      cost,
      tokens
  from opencode.dailyCost
  order by date
```

<AreaChart
    data={daily_cost}
    x=date
    y=cost
    title="Daily Cost"
    fmt=usd
/>

---

## Cost by Model

```sql cost_by_model
  select
      modelId,
      provider,
      sessionCount,
      totalCost,
      totalTokens,
      avgCostPerSession
  from opencode.costByModel
  order by totalCost desc
```

<BarChart
    data={cost_by_model}
    x=modelId
    y=totalCost
    series=provider
    title="Total Cost by Model"
    fmt=usd
/>

<DataTable data={cost_by_model}>
    <Column id=modelId />
    <Column id=provider />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
    <Column id=totalTokens contentType=number fmt=num0 />
    <Column id=avgCostPerSession contentType=number fmt=usd />
</DataTable>

---

## Cost by Project

```sql cost_by_project
  select
      projectId,
      worktree,
      sessionCount,
      totalCost,
      totalTokens
  from opencode.costByProject
  order by totalCost desc
```

<BarChart
    data={cost_by_project}
    x=worktree
    y=totalCost
    title="Cost by Project"
    fmt=usd
/>

<DataTable data={cost_by_project}>
    <Column id=worktree />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
    <Column id=totalTokens contentType=number fmt=num0 />
</DataTable>

---

## Provider Breakdown

```sql provider_breakdown
  select
      provider,
      count,
      totalCost
  from opencode.providerBreakdown
  order by count desc
```

<BarChart
    data={provider_breakdown}
    x=provider
    y=count
    title="Sessions by Provider"
/>

<DataTable data={provider_breakdown}>
    <Column id=provider />
    <Column id=count contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
</DataTable>
