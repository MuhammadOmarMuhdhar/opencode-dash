SELECT
  aggregate_id as sessionId,
  seq,
  json_extract(data, '$.model.id') as modelId,
  json_extract(data, '$.model.providerID') as provider,
  json_extract(data, '$.timestamp') as timestamp
FROM event
WHERE type = 'session.next.model.switched.1'
ORDER BY seq
