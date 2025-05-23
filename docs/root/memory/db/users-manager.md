# users-manager.js

Source: `src/memory/db/users-manager.js`

<a name="UsersManager"></a>

## UsersManager ⇐ <code>BaseManager</code>

**Kind**: global class  
**Extends**: <code>BaseManager</code>

- [UsersManager](#UsersManager) ⇐ <code>BaseManager</code>
  - [new UsersManager()](#new_UsersManager_new)
  - [.getUser(criteria)](#UsersManager+getUser) ⇒ <code>Promise.&lt;{data: (Object\|null), error: (Error\|null)}&gt;</code>
  - [.createUser(isAgent, hostname)](#UsersManager+createUser) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

<a name="new_UsersManager_new"></a>

### new UsersManager()

Manager for user-related database operations.

<a name="UsersManager+getUser"></a>

### usersManager.getUser(criteria) ⇒ <code>Promise.&lt;{data: (Object\|null), error: (Error\|null)}&gt;</code>

Gets a user based on provided criteria.

**Kind**: instance method of [<code>UsersManager</code>](#UsersManager)  
**Throws**:

- <code>Error</code> If no valid criteria provided

| Param               | Type                 | Description                  |
| ------------------- | -------------------- | ---------------------------- |
| criteria            | <code>Object</code>  | The search criteria          |
| [criteria.id]       | <code>string</code>  | User ID                      |
| [criteria.hostname] | <code>string</code>  | User hostname                |
| [criteria.isAgent]  | <code>boolean</code> | Whether to get an agent user |

<a name="UsersManager+createUser"></a>

### usersManager.createUser(isAgent, hostname) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new user.

**Kind**: instance method of [<code>UsersManager</code>](#UsersManager)

| Param    | Type                 | Description                       |
| -------- | -------------------- | --------------------------------- |
| isAgent  | <code>boolean</code> | Whether the user is an agent      |
| hostname | <code>string</code>  | The hostname to identify the user |
