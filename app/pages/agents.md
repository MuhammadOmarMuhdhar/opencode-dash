---
title: Agents
---

# Agent Analytics

## Agent Distribution

```sql agent_distribution
  select
      agent,
      sessionCount,
      totalCost
  from opencode.agentDistribution
  order by sessionCount desc
```

<BarChart
    data={agent_distribution}
    x=agent
    y=sessionCount
    title="Sessions by Agent"
/>

<DataTable data={agent_distribution}>
    <Column id=agent />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
</DataTable>

---

## Cost by Agent

<BarChart
    data={agent_distribution}
    x=agent
    y=totalCost
    title="Total Cost by Agent"
    fmt=usd
/>

---

## Mode Distribution (Message-Level)

```sql mode_distribution
  select
      mode,
      count
  from opencode.modeDistribution
  order by count desc
```

<BarChart
    data={mode_distribution}
    x=mode
    y=count
    title="Messages by Mode"
/>

---

## Agent Switches

```sql agent_switches
  select
      agent,
      switches
  from opencode.agentSwitches
  order by switches desc
```

<DataTable data={agent_switches}>
    <Column id=agent />
    <Column id=switches contentType=number fmt=num0 />
</DataTable>
