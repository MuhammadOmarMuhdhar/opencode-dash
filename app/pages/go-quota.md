---
title: Go Quota Usage
---



<ShareSection title="Go Quota Usage" sectionId="activity-section">

<br>

```sql go_current_month_total
SELECT
  strftime(CAST(strftime('%Y-%m', MAX(session_date)) || '-01' AS DATE), '%B %Y') as month_label,
  ROUND(SUM(effective_cost), 2) as total_effective_cost,
  ROUND(SUM(effective_cost) / 60.0 * 100, 1) as quota_percent
FROM opencode.dailyGoUsage
WHERE strftime('%Y-%m', session_date) = (
  SELECT strftime('%Y-%m', MAX(session_date)) FROM opencode.dailyGoUsage
)
```

```sql go_current_month
SELECT
  strftime('%Y-%m', session_date) as month,
  strftime(CAST(strftime('%Y-%m', session_date) || '-01' AS DATE), '%B %Y') as month_label,
  modelId,
  ROUND(SUM(effective_cost), 2) as effective_cost
FROM opencode.dailyGoUsage
WHERE strftime('%Y-%m', session_date) = (
  SELECT strftime('%Y-%m', MAX(session_date)) FROM opencode.dailyGoUsage
)
GROUP BY month, month_label, modelId
ORDER BY effective_cost DESC
```

<BarChart
  data={go_current_month}
  x=month_label
  y=effective_cost
  series=modelId
  stacked=true
  swapXY=true
  title="Go Spend This Month"
  subtitle="Effective cost broken down by model"
  fmt=usd2
  sort=false
  echartsOptions={{ xAxis: { minInterval: 1, axisLabel: { formatter: (value) => Math.round(value) } }, legend: { left: 'left', top: 45 }, grid: { top: 80 } }}
/>


You have used **<Value data={go_current_month_total} column=total_effective_cost fmt=usd2 />** of  your $60 monthly Go quota (<Value data={go_current_month_total} column=quota_percent />%)

<br>
<!-- ```sql all_model_tiers
SELECT * FROM opencode.modelTiers ORDER BY goMultiplier DESC, modelId
```

<DataTable data={all_model_tiers} title="Model Tiers" subtitle="Every available model's usage tier and multiplier">
    <Column id=modelId title="Model" />
    <Column id=usageTier title="Usage Tier" />
    <Column id=goMultiplier title="× Multiplier" />
</DataTable> -->

```sql pricing_breakdown
WITH latest_month AS (
  SELECT strftime('%Y-%m', MAX(session_date)) as month FROM opencode.dailyGoUsage
)
SELECT
  d.modelId,
  ANY_VALUE(COALESCE(t.usageTier, '$60')) as usageTier,
  COUNT(*) as sessions,
  ROUND(SUM(d.effective_cost / COALESCE(NULLIF(t.goMultiplier, 0), 1)), 2) as raw_cost,
  ANY_VALUE(COALESCE(t.goMultiplier, 1)) as goMultiplier,
  ROUND(SUM(d.effective_cost), 2) as effective_cost,
  ROUND(SUM(d.effective_cost) / 60.0 * 100, 1) as quota_pct
FROM opencode.dailyGoUsage d
LEFT JOIN opencode.modelTiers t ON d.modelId = t.modelId
CROSS JOIN latest_month lm
WHERE strftime('%Y-%m', d.session_date) = lm.month
GROUP BY d.modelId
ORDER BY effective_cost DESC
```

<DataTable data={pricing_breakdown} title="Pricing Breakdown" subtitle="Each model is assigned a usage tier, $15 or $60, that determines how much value your $10/month subscription converts into for that model">
    <Column id=modelId title="Model" />
    <Column id=usageTier title="Tier" />
    <Column id=raw_cost contentType=number fmt=usd2 title="Raw Cost" />
    <Column id=goMultiplier title="×" />
    <Column id=effective_cost contentType=number fmt=usd2 title="Effective Cost" />
    <Column id=quota_pct contentType=number fmt=num1 title="% of Quota" />
</DataTable>

See [OpenCode Go docs](https://opencode.ai/docs/go/#why-some-models-have-lower-usage) for the per-model tier breakdown.


---

```sql go_all_months
SELECT
  strftime('%Y-%m', session_date) as month,
  strftime(CAST(strftime('%Y-%m', session_date) || '-01' AS DATE), '%B %Y') as month_label,
  modelId,
  ROUND(SUM(effective_cost), 2) as effective_cost
FROM opencode.dailyGoUsage
GROUP BY month, month_label, modelId
ORDER BY month DESC, effective_cost DESC
```

<BarChart
  data={go_all_months}
  x=month_label
  y=effective_cost
  series=modelId
  stacked=true
  swapXY=true
  title="All Months"
  subtitle="Effective cost by model per month"
  fmt=usd2
  sort=false
  echartsOptions={{ xAxis: { minInterval: 1, axisLabel: { formatter: (value) => Math.round(value) } }, legend: { left: 'left', top: 45 }, grid: { top: 80 } }}
/>

</ShareSection>