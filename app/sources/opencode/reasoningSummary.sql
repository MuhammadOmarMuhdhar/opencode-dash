SELECT
  SUM(json_extract(data, '$.tokens.reasoning')) as total_reasoning,
  COUNT(DISTINCT session_id) as sessions_with_reasoning
FROM message
WHERE json_extract(data, '$.tokens.reasoning') IS NOT NULL
  AND json_extract(data, '$.tokens.reasoning') > 0
