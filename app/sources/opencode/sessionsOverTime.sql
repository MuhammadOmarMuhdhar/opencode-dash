SELECT
  date(s.time_created/1000, 'unixepoch') as session_date,
  COUNT(DISTINCT s.id) as sessions,
  (SELECT COUNT(*) FROM message m WHERE m.session_id = s.id) as messages,
  ROUND(SUM(s.cost), 6) as cost,
  SUM(s.tokens_input + s.tokens_output + s.tokens_reasoning + s.tokens_cache_read + s.tokens_cache_write) as tokens
FROM session s
WHERE s.time_created > 0
GROUP BY session_date
ORDER BY session_date
