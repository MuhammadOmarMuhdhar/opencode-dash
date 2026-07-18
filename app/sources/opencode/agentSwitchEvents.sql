SELECT
  aggregate_id as sessionId,
  seq,
  json_extract(data, '$.agent') as agent,
  json_extract(data, '$.timestamp') as timestamp
FROM event
WHERE type = 'session.next.agent.switched.1'
ORDER BY seq
