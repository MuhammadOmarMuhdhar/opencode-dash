SELECT
  id,
  vcs,
  time_created,
  time_updated,
  COALESCE(name, worktree) as display_name,
  date(time_created / 1000, 'unixepoch') as timeCreated,
  date(time_updated / 1000, 'unixepoch') as timeUpdated
FROM project
