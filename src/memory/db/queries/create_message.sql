INSERT INTO messages (conversation_id, user_id, content) 
VALUES ($1, $2, $3)
RETURNING id; 