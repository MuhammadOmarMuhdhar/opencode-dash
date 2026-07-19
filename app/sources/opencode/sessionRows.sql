SELECT
  id,
  project_id,
  model,
  json_extract(model, '$.id') as modelId,
  COALESCE(json_extract(model, '$.providerID'), 'unknown') as provider,
  cost,
  tokens_input,
  tokens_output,
  tokens_reasoning,
  tokens_cache_read,
  tokens_cache_write,
  date(time_created / 1000, 'unixepoch') as session_date
FROM session
WHERE time_created > 0
