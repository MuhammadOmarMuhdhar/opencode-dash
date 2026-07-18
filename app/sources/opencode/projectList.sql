SELECT
  p.id as projectId,
  COALESCE(p.name, p.worktree) as worktree,
  p.vcs,
  date(p.time_created/1000, 'unixepoch') as timeCreated,
  date(p.time_updated/1000, 'unixepoch') as timeUpdated,
  COUNT(s.id) as sessionCount
FROM project p
LEFT JOIN session s ON s.project_id = p.id
GROUP BY p.id
ORDER BY sessionCount DESC
