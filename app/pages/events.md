---
title: Events
---

# Event Stream Analytics

## Event Type Distribution

```sql event_types
  select
      eventType,
      count
  from opencode.eventTypeDistribution
  order by count desc
```

<BarChart
    data={event_types}
    x=eventType
    y=count
    title="Events by Type"
    fmt=num0
/>

<DataTable data={event_types}>
    <Column id=eventType />
    <Column id=count contentType=number fmt=num0 />
</DataTable>

---

## Daily Event Counts

```sql event_counts
  select
      date,
      eventCount
  from opencode.eventCountsByDay
  order by date
```

<AreaChart
    data={event_counts}
    x=date
    y=eventCount
    title="Events per Day"
    fmt=num0
/>

---

## Model Switch Events

```sql model_switches
  select
      sessionId,
      seq,
      modelId,
      provider,
      timestamp
  from opencode.modelSwitchEvents
  order by seq
```

<DataTable data={model_switches}>
    <Column id=sessionId />
    <Column id=seq contentType=number fmt=num0 />
    <Column id=modelId />
    <Column id=provider />
    <Column id=timestamp contentType=number fmt=num0 />
</DataTable>

---

## Agent Switch Events

```sql agent_switches
  select
      sessionId,
      seq,
      agent,
      timestamp
  from opencode.agentSwitchEvents
  order by seq
```

<DataTable data={agent_switches}>
    <Column id=sessionId />
    <Column id=seq contentType=number fmt=num0 />
    <Column id=agent />
    <Column id=timestamp contentType=number fmt=num0 />
</DataTable>
