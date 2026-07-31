WITH model_tiers AS (
  SELECT 'deepseek-v4-pro' as modelId, 4 as goMultiplier
  UNION ALL SELECT 'deepseek-v4-flash', 1
  UNION ALL SELECT 'deepseek-v4-flash-free', 1
  UNION ALL SELECT 'mimo-v2.5-pro', 4
  UNION ALL SELECT 'mimo-v2.5', 1
  UNION ALL SELECT 'grok-4.5', 4
  UNION ALL SELECT 'kimi-k3', 4
  UNION ALL SELECT 'kimi-k2.6', 1
  UNION ALL SELECT 'kimi-k2.7-code', 1
  UNION ALL SELECT 'glm-5.1', 1
  UNION ALL SELECT 'glm-5.2', 1
  UNION ALL SELECT 'minimax-m3', 1
  UNION ALL SELECT 'minimax-m2.7', 1
  UNION ALL SELECT 'minimax-m2.5', 1
  UNION ALL SELECT 'qwen3.7-max', 1
  UNION ALL SELECT 'qwen3.7-plus', 1
  UNION ALL SELECT 'qwen3.6-plus', 1
  UNION ALL SELECT 'hy3', 1
)
SELECT
    date(time_created/1000, 'unixepoch') as session_date,
    json_extract(model, '$.id') as modelId,
    cost * COALESCE(m.goMultiplier, 1) as effective_cost
FROM session
LEFT JOIN model_tiers m ON json_extract(model, '$.id') = m.modelId
WHERE json_extract(model, '$.id') IS NOT NULL
  AND (json_extract(model, '$.providerID') = 'opencode-go' 
        OR json_extract(model, '$.providerID') = 'opencode')
  and cost > 0
