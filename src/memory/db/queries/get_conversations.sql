SELECT c.id, c.created_at, array_agg(cp.user_id) as user_ids
FROM conversations c
JOIN conversation_participants cp ON c.id = cp.conversation_id
WHERE cp.user_id = $1
GROUP BY c.id, c.created_at
ORDER BY c.created_at DESC;