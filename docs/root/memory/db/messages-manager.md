# messages-manager.js

Source: `src/memory/db/messages-manager.js`

<a name="MessagesManager"></a>

## MessagesManager ⇐ <code>BaseManager</code>
**Kind**: global class  
**Extends**: <code>BaseManager</code>  

* [MessagesManager](#MessagesManager) ⇐ <code>BaseManager</code>
    * [new MessagesManager()](#new_MessagesManager_new)
    * [.getMessages(criteria)](#MessagesManager+getMessages) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>
    * [.createMessage(conversationId, userId, content)](#MessagesManager+createMessage) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
    * [.updateMessageEmbedding(messageId, embedding)](#MessagesManager+updateMessageEmbedding) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

<a name="new_MessagesManager_new"></a>

### new MessagesManager()
Manager for message-related database operations.

<a name="MessagesManager+getMessages"></a>

### messagesManager.getMessages(criteria) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>
Gets messages based on provided criteria.

**Kind**: instance method of [<code>MessagesManager</code>](#MessagesManager)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| criteria | <code>Object</code> |  | The search criteria |
| criteria.conversationId | <code>string</code> |  | The conversation ID |
| [criteria.embedding] | <code>Array.&lt;number&gt;</code> |  | Embedding vector for similarity search |
| [criteria.limit] | <code>number</code> | <code>5</code> | Maximum number of messages to return for similarity search |

<a name="MessagesManager+createMessage"></a>

### messagesManager.createMessage(conversationId, userId, content) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
Creates a new message in a conversation.

**Kind**: instance method of [<code>MessagesManager</code>](#MessagesManager)  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>string</code> | The conversation ID |
| userId | <code>string</code> | The user ID |
| content | <code>string</code> | The message content |

<a name="MessagesManager+updateMessageEmbedding"></a>

### messagesManager.updateMessageEmbedding(messageId, embedding) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>
Updates a message's embedding.

**Kind**: instance method of [<code>MessagesManager</code>](#MessagesManager)  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>string</code> | The message ID |
| embedding | <code>Array.&lt;number&gt;</code> | The embedding vector |

