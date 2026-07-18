SELECT
  COALESCE(json_extract(data, '$.mode'), 'unknown') as mode,
  COUNT(*) as count
FROM message
WHERE json_extract(data, '$.mode') IS NOT NULL
GROUP BY mode
ORDER BY count DESC
