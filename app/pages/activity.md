---
title: Activity & Usage
---

# Activity & Usage

## Overview

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

```sql duration_stats
  select
      avg_duration_ms,
      min_duration_ms,
      max_duration_ms,
      avg_duration_min
  from opencode.sessionDurationStats
```

```sql msg_stats
  select
      avg,
      min,
      max
  from opencode.messagesPerSessionStats
```

<BigValue data={duration_stats} value=avg_duration_min title="Avg Session Length" fmt=num2 suffix=" min" />
<BigValue data={msg_stats} value=avg title="Avg Messages/Session" fmt=num2 />

---

## Sessions Over Time

<LineChart
    data={sessions_over_time}
    x=date
    y=sessions
    title="Sessions per Day"
/>

## Messages Over Time

<LineChart
    data={sessions_over_time}
    x=date
    y=messages
    title="Messages per Day"
/>

---

## Daily Active Projects

```sql daily_projects
  select
      date,
      activeProjects
  from opencode.dailyActiveProjects
  order by date
```

<AreaChart
    data={daily_projects}
    x=date
    y=activeProjects
    title="Unique Projects Active per Day"
/>

---

## Longest Sessions

```sql longest_sessions
  select
      sessionId,
      title,
      durationMs,
      durationMin,
      cost,
      tokens
  from opencode.longestSessions
  order by durationMs desc
```

<DataTable data={longest_sessions}>
    <Column id=title />
    <Column id=durationMin contentType=number fmt=num2 suffix=" min" />
    <Column id=cost contentType=number fmt=usd />
    <Column id=tokens contentType=number fmt=num0 />
</DataTable>
