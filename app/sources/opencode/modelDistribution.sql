SELECT
  json_extract(model, '$.id') as modelId,
  COALESCE(json_extract(model, '$.providerID'), 'unknown') as provider,
  COUNT(*) as sessionCount,
  ROUND(SUM(cost), 6) as totalCost,
  SUM(tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write) as totalTokens,
  ROUND(AVG(cost), 6) as avgCostPerSession
FROM session
WHERE model IS NOT NULL AND model != ''
GROUP BY modelId, provider
ORDER BY sessionCount DESC
