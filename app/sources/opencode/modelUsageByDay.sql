SELECT
  date(time_created/1000, 'unixepoch') as date,
  json_extract(model, '$.id') as modelId,
  COALESCE(json_extract(model, '$.providerID'), 'unknown') as provider,
  COUNT(*) as sessions,
  ROUND(SUM(cost), 6) as cost
FROM session
WHERE model IS NOT NULL AND model != ''
GROUP BY date, modelId, provider
ORDER BY date, sessions DESC
