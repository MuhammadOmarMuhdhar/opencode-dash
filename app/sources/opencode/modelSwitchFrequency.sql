SELECT
  COALESCE(json_extract(data, '$.model.id'), 'unknown') as modelId,
  COALESCE(json_extract(data, '$.model.providerID'), 'unknown') as provider,
  COUNT(*) as switches
FROM event
WHERE type = 'session.next.model.switched.1'
GROUP BY modelId, provider
ORDER BY switches DESC
