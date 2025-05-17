# setup.js

Source: `src/agent/setup.js`

## Functions

<dl>
<dt><a href="#loadEnv">loadEnv()</a></dt>
<dd><p>Loads environment variables from a .env file and sets up development-specific variables.</p>
<p>This function configures the environment variables using dotenv by loading them from a file located
two directories up from the current file. If the NODE_ENV variable is set to &#39;development&#39;, it iterates
over all environment variables and for each key starting with &#39;DEV_&#39;, it creates a new variable without
the &#39;DEV_&#39; prefix.</p>
</dd>
<dt><a href="#setup">setup()</a></dt>
<dd><p>Main setup function that runs all initialization steps</p>
</dd>
</dl>

<a name="loadEnv"></a>

## loadEnv()
Loads environment variables from a .env file and sets up development-specific variables.

This function configures the environment variables using dotenv by loading them from a file located
two directories up from the current file. If the NODE_ENV variable is set to 'development', it iterates
over all environment variables and for each key starting with 'DEV_', it creates a new variable without
the 'DEV_' prefix.

**Kind**: global function  
<a name="setup"></a>

## setup()
Main setup function that runs all initialization steps

**Kind**: global function  
