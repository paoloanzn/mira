/**
 * Compiles a template string by replacing variables with values from a data object.
 * Variables in the template should be in the format {{variableName}}.
 *
 * @param {string} template - The template string containing variables to replace
 * @param {Object} data - Object containing key-value pairs to replace variables
 * @returns {Object} Result object containing either the compiled template or an error
 * @property {string} template - The compiled template string or empty string if error
 * @property {string|null} error - Error message if compilation failed, null otherwise
 */
export function compileTemplate(template, data) {
  let compiledTemplate = "";

  if (typeof data !== "object") {
    return {
      template: compiledTemplate,
      error: `expected data as type: object, got ${typeof data}.`,
    };
  }

  const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

  compiledTemplate = template.replace(regex, (match, varName) => {
    // If the variable exists in data, return its value; otherwise, keep the placeholder
    return varName in data ? data[varName] : match;
  });

  return { template: compiledTemplate, error: null };
}
