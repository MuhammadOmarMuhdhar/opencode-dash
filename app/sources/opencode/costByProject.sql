SELECT
  p.id as projectId,
  COALESCE(p.name, p.worktree) as worktree,
  COUNT(s.id) as sessionCount,
  ROUND(SUM(s.cost), 6) as totalCost,
  SUM(s.tokens_input + s.tokens_output + s.tokens_reasoning + s.tokens_cache_read + s.tokens_cache_write) as totalTokens
FROM project p
JOIN session s ON s.project_id = p.id
GROUP BY p.id
ORDER BY sessionCount DESC
LIMIT 15
