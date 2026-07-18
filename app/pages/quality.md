---
title: Session Quality
---

# Session Quality

## Finish Reasons

```sql finish_reasons
  select
      finishReason,
      count,
      percentage
  from opencode.finishReasons
  order by count desc
```

<BarChart
    data={finish_reasons}
    x=finishReason
    y=count
    title="Finish Reasons"
/>

<DataTable data={finish_reasons}>
    <Column id=finishReason />
    <Column id=count contentType=number fmt=num0 />
    <Column id=percentage contentType=number fmt=num1 suffix="%" />
</DataTable>

---

## Todo Stats

```sql todo_stats
  select
      status,
      count,
      percentage
  from opencode.todoStats
  order by count desc
```

<BarChart
    data={todo_stats}
    x=status
    y=count
    title="Todo Status"
/>

---

## Todo Completion Rate

```sql todo_completion
  select
      completed,
      total
  from opencode.todoCompletionRate
```

<BigValue data={todo_completion} value=completed title="Completed Todos" />
<BigValue data={todo_completion} value=total title="Total Todos" />

---

## Compaction Frequency

```sql compaction
  select
      compaction_parts,
      sessions_with_compaction
  from opencode.compactionFrequency
```

<BigValue data={compaction} value=compaction_parts title="Compaction Parts" />
<BigValue data={compaction} value=sessions_with_compaction title="Sessions Affected" />
