SELECT
  date(s.time_created/1000, 'unixepoch') as date,
  COUNT(DISTINCT s.id) as sessions,
  COUNT(m.id) as messages,
  ROUND(SUM(s.cost), 6) as cost,
  SUM(s.tokens_input + s.tokens_output + s.tokens_reasoning + s.tokens_cache_read + s.tokens_cache_write) as tokens
FROM session s
LEFT JOIN message m ON m.session_id = s.id
GROUP BY date
ORDER BY date
