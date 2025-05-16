# conversation-manager.js

Source: `src/agent/lib/memory/conversation-manager.js`

## Classes

<dl>
<dt><a href="#ConversationManager">ConversationManager</a></dt>
<dd><p>Manages conversation-related operations and maintains a mapping of users to conversations.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getConversationManager">getConversationManager()</a> ⇒ <code><a href="#ConversationManager">ConversationManager</a></code></dt>
<dd><p>Gets the singleton instance of ConversationManager.</p>
</dd>
</dl>

<a name="ConversationManager"></a>

## ConversationManager

Manages conversation-related operations and maintains a mapping of users to conversations.

**Kind**: global class

- [ConversationManager](#ConversationManager)
  - [.getOrCreateConversation(userId, agentUserId)](#ConversationManager+getOrCreateConversation) ⇒ <code>Promise.&lt;{conversationId: (string\|null), error: (Error\|null)}&gt;</code>
  - [.getMessages(conversationId)](#ConversationManager+getMessages) ⇒ <code>Promise.&lt;{messages: (Array\|null), error: (Error\|null)}&gt;</code>
  - [.addMessage(conversationId, userId, content)](#ConversationManager+addMessage) ⇒ <code>Promise.&lt;{messageId: (string\|null), error: (Error\|null)}&gt;</code>
  - [.formatConversation(messages, agentUserId)](#ConversationManager+formatConversation) ⇒ <code>string</code>

<a name="ConversationManager+getOrCreateConversation"></a>

### conversationManager.getOrCreateConversation(userId, agentUserId) ⇒ <code>Promise.&lt;{conversationId: (string\|null), error: (Error\|null)}&gt;</code>

Gets or creates a conversation for a user with the agent.

**Kind**: instance method of [<code>ConversationManager</code>](#ConversationManager)

| Param       | Type                | Description         |
| ----------- | ------------------- | ------------------- |
| userId      | <code>string</code> | The user's ID       |
| agentUserId | <code>string</code> | The agent's user ID |

<a name="ConversationManager+getMessages"></a>

### conversationManager.getMessages(conversationId) ⇒ <code>Promise.&lt;{messages: (Array\|null), error: (Error\|null)}&gt;</code>

Gets messages from a conversation.

**Kind**: instance method of [<code>ConversationManager</code>](#ConversationManager)

| Param          | Type                | Description         |
| -------------- | ------------------- | ------------------- |
| conversationId | <code>string</code> | The conversation ID |

<a name="ConversationManager+addMessage"></a>

### conversationManager.addMessage(conversationId, userId, content) ⇒ <code>Promise.&lt;{messageId: (string\|null), error: (Error\|null)}&gt;</code>

Adds a message to a conversation.

**Kind**: instance method of [<code>ConversationManager</code>](#ConversationManager)

| Param          | Type                | Description         |
| -------------- | ------------------- | ------------------- |
| conversationId | <code>string</code> | The conversation ID |
| userId         | <code>string</code> | The user ID         |
| content        | <code>string</code> | The message content |

<a name="ConversationManager+formatConversation"></a>

### conversationManager.formatConversation(messages, agentUserId) ⇒ <code>string</code>

Formats messages into a conversation string.

**Kind**: instance method of [<code>ConversationManager</code>](#ConversationManager)  
**Returns**: <code>string</code> - Formatted conversation string

| Param       | Type                | Description              |
| ----------- | ------------------- | ------------------------ |
| messages    | <code>Array</code>  | Array of message objects |
| agentUserId | <code>string</code> | The agent's user ID      |

<a name="getConversationManager"></a>

## getConversationManager() ⇒ [<code>ConversationManager</code>](#ConversationManager)

Gets the singleton instance of ConversationManager.

**Kind**: global function  
**Returns**: [<code>ConversationManager</code>](#ConversationManager) - The ConversationManager instance
