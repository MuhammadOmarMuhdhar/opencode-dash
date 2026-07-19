SELECT
  COALESCE(p.name, p.worktree) as project,
  p.vcs,
  date(p.time_created / 1000, 'unixepoch') as timeCreated,
  date(p.time_updated / 1000, 'unixepoch') as timeUpdated,
  COUNT(s.id) as sessionCount,
  ROUND(SUM(COALESCE(s.cost, 0)), 6) as totalCost,
  SUM(COALESCE(s.tokens_input, 0) + COALESCE(s.tokens_output, 0) + COALESCE(s.tokens_reasoning, 0) + COALESCE(s.tokens_cache_read, 0) + COALESCE(s.tokens_cache_write, 0)) as totalTokens
FROM project p
LEFT JOIN session s ON s.project_id = p.id
GROUP BY p.id
ORDER BY sessionCount DESC
