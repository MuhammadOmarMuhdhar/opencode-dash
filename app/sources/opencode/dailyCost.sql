SELECT
  date(time_created/1000, 'unixepoch') as date,
  ROUND(SUM(cost), 6) as cost,
  SUM(tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write) as tokens
FROM session
GROUP BY date
ORDER BY date
