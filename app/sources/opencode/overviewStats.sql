SELECT
  (SELECT COUNT(*) FROM session) as total_sessions,
  (SELECT COUNT(*) FROM message) as total_messages,
  (SELECT COUNT(*) FROM part) as total_parts,
  (SELECT COUNT(DISTINCT COALESCE(name, worktree)) FROM project) as total_projects,
  COALESCE(ROUND(SUM(cost), 6), 0) as total_cost,
  COALESCE(SUM(tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write), 0) as total_tokens,
  COALESCE(ROUND(AVG(cost), 6), 0) as avg_session_cost,
  COALESCE(ROUND(
    (SELECT COUNT(*) FROM message) * 1.0 / (SELECT COUNT(*) FROM session), 2
  ), 0) as avg_messages_per_session,
  (SELECT date(MIN(time_created)/1000, 'unixepoch') FROM session) as date_from,
  (SELECT date(MAX(time_created)/1000, 'unixepoch') FROM session) as date_to
FROM session
