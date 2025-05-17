# conversations-manager.js

Source: `src/memory/db/conversations-manager.js`

<a name="ConversationsManager"></a>

## ConversationsManager ⇐ <code>BaseManager</code>
**Kind**: global class  
**Extends**: <code>BaseManager</code>  

* [ConversationsManager](#ConversationsManager) ⇐ <code>BaseManager</code>
    * [new ConversationsManager()](#new_ConversationsManager_new)
    * [.createConversation(userIds)](#ConversationsManager+createConversation) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

<a name="new_ConversationsManager_new"></a>

### new ConversationsManager()
Manager for conversation-related database operations.

<a name="ConversationsManager+createConversation"></a>

### conversationsManager.createConversation(userIds) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
Creates a new conversation and adds users to it.

**Kind**: instance method of [<code>ConversationsManager</code>](#ConversationsManager)  

| Param | Type | Description |
| --- | --- | --- |
| userIds | <code>Array.&lt;string&gt;</code> | Array of user IDs to add to the conversation |

