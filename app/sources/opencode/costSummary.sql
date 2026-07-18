SELECT
  ROUND(SUM(cost), 6) as total_cost,
  SUM(tokens_input + tokens_output + tokens_reasoning + tokens_cache_read + tokens_cache_write) as total_tokens,
  SUM(tokens_input) as total_input,
  SUM(tokens_output) as total_output,
  SUM(tokens_reasoning) as total_reasoning,
  SUM(tokens_cache_read) as total_cache_read,
  SUM(tokens_cache_write) as total_cache_write
FROM session
