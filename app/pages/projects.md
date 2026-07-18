---
title: Projects
---

# Project Activity

## Top Projects by Sessions

```sql top_by_sessions
  select
      projectId,
      worktree,
      sessionCount,
      totalCost,
      totalTokens
  from opencode.topProjectsBySessions
  order by sessionCount desc
```

<BarChart
    data={top_by_sessions}
    x=worktree
    y=sessionCount
    title="Sessions by Project"
    fmt=num0
/>

<DataTable data={top_by_sessions}>
    <Column id=worktree />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
    <Column id=totalTokens contentType=number fmt=num0 />
</DataTable>

---

## Top Projects by Cost

```sql top_by_cost
  select
      projectId,
      worktree,
      sessionCount,
      totalCost,
      totalTokens
  from opencode.topProjectsByCost
  order by totalCost desc
```

<BarChart
    data={top_by_cost}
    x=worktree
    y=totalCost
    title="Cost by Project"
    fmt=usd
/>

<DataTable data={top_by_cost}>
    <Column id=worktree />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=totalCost contentType=number fmt=usd />
    <Column id=totalTokens contentType=number fmt=num0 />
</DataTable>

---

## All Projects

```sql project_list
  select
      projectId,
      worktree,
      vcs,
      timeCreated,
      timeUpdated,
      sessionCount
  from opencode.projectList
  order by sessionCount desc
```

<DataTable data={project_list}>
    <Column id=worktree />
    <Column id=vcs />
    <Column id=sessionCount contentType=number fmt=num0 />
    <Column id=timeCreated />
    <Column id=timeUpdated />
</DataTable>
