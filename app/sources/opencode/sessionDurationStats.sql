SELECT
  ROUND(AVG(time_updated - time_created), 0) as avg_duration_ms,
  MIN(time_updated - time_created) as min_duration_ms,
  MAX(time_updated - time_created) as max_duration_ms,
  ROUND(AVG((time_updated - time_created) / 60000.0), 2) as avg_duration_min
FROM session
WHERE time_updated > time_created
