# database.js

Source: `src/memory/db/database.js`

## Classes

<dl>
<dt><a href="#Database">Database</a></dt>
<dd></dd>
<dt><a href="#Database">Database</a></dt>
<dd></dd>
</dl>

<a name="Database"></a>

## Database
**Kind**: global class  

* [Database](#Database)
    * [new Database()](#new_Database_new)
    * [new Database()](#new_Database_new)
    * [.query(sql, [params])](#Database+query) ⇒ <code>Promise.&lt;({data: Array, error: null}\|{data: null, error: Error})&gt;</code>
    * [.close()](#Database+close) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.loadQuery(fileName)](#Database+loadQuery) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
    * [.transaction(callback)](#Database+transaction) ⇒ <code>Promise.&lt;({data: any, error: null}\|{data: null, error: Error})&gt;</code>

<a name="new_Database_new"></a>

### new Database()
Class representing a database connection manager.

<a name="new_Database_new"></a>

### new Database()
Creates an instance of Database.

<a name="Database+query"></a>

### database.query(sql, [params]) ⇒ <code>Promise.&lt;({data: Array, error: null}\|{data: null, error: Error})&gt;</code>
Executes a SQL query using a pooled client.

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>Promise.&lt;({data: Array, error: null}\|{data: null, error: Error})&gt;</code> - Result object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>string</code> |  | The SQL query to execute. |
| [params] | <code>Array</code> | <code>[]</code> | An array of parameters for the SQL query. |

<a name="Database+close"></a>

### database.close() ⇒ <code>Promise.&lt;void&gt;</code>
Closes the database connection pool.

**Kind**: instance method of [<code>Database</code>](#Database)  
<a name="Database+loadQuery"></a>

### database.loadQuery(fileName) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Loads a SQL query from a file.

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - The content of the SQL file.  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | The filename of the SQL query to load. |

<a name="Database+transaction"></a>

### database.transaction(callback) ⇒ <code>Promise.&lt;({data: any, error: null}\|{data: null, error: Error})&gt;</code>
Executes a transaction with multiple queries.

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>Promise.&lt;({data: any, error: null}\|{data: null, error: Error})&gt;</code> - Result object.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function that receives a client and executes queries. |

<a name="Database"></a>

## Database
**Kind**: global class  

* [Database](#Database)
    * [new Database()](#new_Database_new)
    * [new Database()](#new_Database_new)
    * [.query(sql, [params])](#Database+query) ⇒ <code>Promise.&lt;({data: Array, error: null}\|{data: null, error: Error})&gt;</code>
    * [.close()](#Database+close) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.loadQuery(fileName)](#Database+loadQuery) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
    * [.transaction(callback)](#Database+transaction) ⇒ <code>Promise.&lt;({data: any, error: null}\|{data: null, error: Error})&gt;</code>

<a name="new_Database_new"></a>

### new Database()
Class representing a database connection manager.

<a name="new_Database_new"></a>

### new Database()
Creates an instance of Database.

<a name="Database+query"></a>

### database.query(sql, [params]) ⇒ <code>Promise.&lt;({data: Array, error: null}\|{data: null, error: Error})&gt;</code>
Executes a SQL query using a pooled client.

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>Promise.&lt;({data: Array, error: null}\|{data: null, error: Error})&gt;</code> - Result object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>string</code> |  | The SQL query to execute. |
| [params] | <code>Array</code> | <code>[]</code> | An array of parameters for the SQL query. |

<a name="Database+close"></a>

### database.close() ⇒ <code>Promise.&lt;void&gt;</code>
Closes the database connection pool.

**Kind**: instance method of [<code>Database</code>](#Database)  
<a name="Database+loadQuery"></a>

### database.loadQuery(fileName) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Loads a SQL query from a file.

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - The content of the SQL file.  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | The filename of the SQL query to load. |

<a name="Database+transaction"></a>

### database.transaction(callback) ⇒ <code>Promise.&lt;({data: any, error: null}\|{data: null, error: Error})&gt;</code>
Executes a transaction with multiple queries.

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>Promise.&lt;({data: any, error: null}\|{data: null, error: Error})&gt;</code> - Result object.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function that receives a client and executes queries. |

