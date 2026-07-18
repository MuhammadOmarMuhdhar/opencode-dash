SELECT
  type as eventType,
  COUNT(*) as count
FROM event
GROUP BY type
ORDER BY count DESC
