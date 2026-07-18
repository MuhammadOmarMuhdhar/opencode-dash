WITH totals AS (
  SELECT COUNT(*) as total FROM todo
)
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT total FROM totals), 1) as percentage
FROM todo
GROUP BY status
ORDER BY count DESC
