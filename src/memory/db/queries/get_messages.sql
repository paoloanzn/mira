SELECT m.*, u.id as user_id
FROM messages m
JOIN users u ON m.user_id = u.id
WHERE m.conversation_id = $1
ORDER BY m.created_at ASC; 