SELECT
  id as sessionId,
  title,
  (time_updated - time_created) as durationMs,
  ROUND((time_updated - time_created) / 60000.0, 2) as durationMin,
  ROUND(cost, 6) as cost,
  (tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write) as tokens
FROM session
WHERE time_updated > time_created
ORDER BY durationMs DESC
LIMIT 10
