# user-manager.js

Source: `src/agent/lib/memory/user-manager.js`

## Classes

<dl>
<dt><a href="#UserManager">UserManager</a></dt>
<dd><p>Manages user-related operations and maintains a mapping of hostnames to user IDs.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getUserManager">getUserManager()</a> ⇒ <code><a href="#UserManager">UserManager</a></code></dt>
<dd><p>Gets the singleton instance of UserManager.</p>
</dd>
</dl>

<a name="UserManager"></a>

## UserManager

Manages user-related operations and maintains a mapping of hostnames to user IDs.

**Kind**: global class

- [UserManager](#UserManager)
  - [.getOrCreateUser(hostname)](#UserManager+getOrCreateUser) ⇒ <code>Promise.&lt;{userId: (string\|null), error: (Error\|null)}&gt;</code>
  - [.getOrCreateAgentUser()](#UserManager+getOrCreateAgentUser) ⇒ <code>Promise.&lt;{userId: (string\|null), error: (Error\|null)}&gt;</code>
  - [.getUser(userId)](#UserManager+getUser) ⇒ <code>Promise.&lt;{user: (Object\|null), error: (Error\|null)}&gt;</code>

<a name="UserManager+getOrCreateUser"></a>

### userManager.getOrCreateUser(hostname) ⇒ <code>Promise.&lt;{userId: (string\|null), error: (Error\|null)}&gt;</code>

Gets or creates a user ID for a hostname.

**Kind**: instance method of [<code>UserManager</code>](#UserManager)

| Param    | Type                | Description                           |
| -------- | ------------------- | ------------------------------------- |
| hostname | <code>string</code> | The hostname to get/create a user for |

<a name="UserManager+getOrCreateAgentUser"></a>

### userManager.getOrCreateAgentUser() ⇒ <code>Promise.&lt;{userId: (string\|null), error: (Error\|null)}&gt;</code>

Gets or creates the agent's user ID.

**Kind**: instance method of [<code>UserManager</code>](#UserManager)  
<a name="UserManager+getUser"></a>

### userManager.getUser(userId) ⇒ <code>Promise.&lt;{user: (Object\|null), error: (Error\|null)}&gt;</code>

Gets a user by ID.

**Kind**: instance method of [<code>UserManager</code>](#UserManager)

| Param  | Type                | Description        |
| ------ | ------------------- | ------------------ |
| userId | <code>string</code> | The user ID to get |

<a name="getUserManager"></a>

## getUserManager() ⇒ [<code>UserManager</code>](#UserManager)

Gets the singleton instance of UserManager.

**Kind**: global function  
**Returns**: [<code>UserManager</code>](#UserManager) - The UserManager instance
