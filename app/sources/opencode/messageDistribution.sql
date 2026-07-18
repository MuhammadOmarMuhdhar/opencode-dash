SELECT
  COALESCE(json_extract(data, '$.role'), 'unknown') as role,
  COUNT(*) as count
FROM message
WHERE json_extract(data, '$.role') IS NOT NULL
GROUP BY role
ORDER BY count DESC
