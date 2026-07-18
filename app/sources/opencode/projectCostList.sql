WITH RECURSIVE
  parts(projectId, worktree, part, remaining, idx) AS (
    SELECT p.id, COALESCE(p.name, p.worktree), '', COALESCE(p.name, p.worktree) || '/', 0
    FROM project p
    UNION ALL
    SELECT projectId, worktree,
      SUBSTR(remaining, 1, INSTR(remaining, '/') - 1),
      SUBSTR(remaining, INSTR(remaining, '/') + 1),
      idx + 1
    FROM parts WHERE INSTR(remaining, '/') > 0
  ),
  last_parts AS (
    SELECT projectId, part, idx,
      MAX(idx) OVER (PARTITION BY projectId) as max_idx
    FROM parts
    WHERE idx > 0 AND part != ''
  ),
  short_paths AS (
    SELECT projectId, GROUP_CONCAT(part, '/') as short_path
    FROM last_parts
    WHERE idx >= max_idx - 1
    GROUP BY projectId
  )
SELECT
  sp.short_path as project,
  p.vcs,
  date(p.time_created/1000, 'unixepoch') as timeCreated,
  date(p.time_updated/1000, 'unixepoch') as timeUpdated,
  COUNT(s.id) as sessionCount,
  ROUND(SUM(COALESCE(s.cost, 0)), 6) as totalCost,
  SUM(COALESCE(s.tokens_input, 0) + COALESCE(s.tokens_output, 0) + COALESCE(s.tokens_reasoning, 0) + COALESCE(s.tokens_cache_read, 0) + COALESCE(s.tokens_cache_write, 0)) as totalTokens
FROM project p
LEFT JOIN session s ON s.project_id = p.id
JOIN short_paths sp ON sp.projectId = p.id
GROUP BY p.id
ORDER BY sessionCount DESC
