# base-manager.js

Source: `src/memory/db/base-manager.js`

<a name="BaseManager"></a>

## BaseManager ⇐ <code>Database</code>
**Kind**: global class  
**Extends**: <code>Database</code>  

* [BaseManager](#BaseManager) ⇐ <code>Database</code>
    * [new BaseManager()](#new_BaseManager_new)
    * [.loadAndValidateQuery(queryName)](#BaseManager+loadAndValidateQuery) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_BaseManager_new"></a>

### new BaseManager()
Base class for database managers.
Provides common functionality for all managers.

<a name="BaseManager+loadAndValidateQuery"></a>

### baseManager.loadAndValidateQuery(queryName) ⇒ <code>Promise.&lt;string&gt;</code>
Loads and validates a query.

**Kind**: instance method of [<code>BaseManager</code>](#BaseManager)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The loaded query  
**Throws**:

- <code>Error</code> If the query is not found or not authorized

**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| queryName | <code>string</code> | The name of the query file to load |

