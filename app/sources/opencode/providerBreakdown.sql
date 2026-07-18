SELECT
  COALESCE(json_extract(model, '$.providerID'), 'unknown') as provider,
  COUNT(*) as count,
  ROUND(SUM(cost), 6) as totalCost
FROM session
WHERE model IS NOT NULL AND model != ''
GROUP BY provider
ORDER BY count DESC
