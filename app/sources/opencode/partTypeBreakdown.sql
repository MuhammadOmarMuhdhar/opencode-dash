SELECT
  COALESCE(json_extract(data, '$.type'), 'unknown') as partType,
  COUNT(*) as count
FROM part
WHERE json_extract(data, '$.type') IS NOT NULL
GROUP BY partType
ORDER BY count DESC
