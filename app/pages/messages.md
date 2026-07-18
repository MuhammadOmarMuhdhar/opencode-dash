---
title: Messages & Conversations
---

# Messages & Conversation Patterns

## Message Distribution

```sql message_distribution
  select
      role,
      count
  from opencode.messageDistribution
  order by count desc
```

<BarChart
    data={message_distribution}
    x=role
    y=count
    title="Messages by Role"
/>

---

## Part Type Breakdown

```sql part_types
  select
      partType,
      count
  from opencode.partTypeBreakdown
  order by count desc
```

<BarChart
    data={part_types}
    x=partType
    y=count
    title="Parts by Type"
    fmt=num0
/>

---

## Reasoning Summary

```sql reasoning
  select
      total_reasoning,
      sessions_with_reasoning
  from opencode.reasoningSummary
```

<BigValue data={reasoning} value=total_reasoning title="Total Reasoning Tokens" />
<BigValue data={reasoning} value=sessions_with_reasoning title="Sessions with Reasoning" />

---

## Tool Calls per Session

```sql tool_calls
  select
      sessionId,
      title,
      toolCalls
  from opencode.toolCallsPerSession
  order by toolCalls desc
```

<DataTable data={tool_calls}>
    <Column id=title />
    <Column id=toolCalls contentType=number fmt=num0 />
</DataTable>

---

## Patches per Session

```sql patches
  select
      sessionId,
      title,
      patches
  from opencode.patchesPerSession
  order by patches desc
```

<DataTable data={patches}>
    <Column id=title />
    <Column id=patches contentType=number fmt=num0 />
</DataTable>
