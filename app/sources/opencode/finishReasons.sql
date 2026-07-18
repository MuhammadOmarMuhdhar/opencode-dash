WITH totals AS (
  SELECT COUNT(*) as total
  FROM message
  WHERE json_extract(data, '$.finish') IS NOT NULL
)
SELECT
  COALESCE(json_extract(data, '$.finish'), 'unknown') as finishReason,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT total FROM totals), 1) as percentage
FROM message
WHERE json_extract(data, '$.finish') IS NOT NULL
GROUP BY finishReason
ORDER BY count DESC
