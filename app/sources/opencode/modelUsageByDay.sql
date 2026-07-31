SELECT
  date(time_created/1000, 'unixepoch') as session_date,
  json_extract(model, '$.id') as modelId,
  COALESCE(json_extract(model, '$.providerID'), 'unknown') as provider,
  COUNT(*) as sessions,
  ROUND(SUM(cost), 6) as cost
FROM session
WHERE model IS NOT NULL AND model != ''
GROUP BY session_date, modelId, provider
ORDER BY session_date, sessions DESC

