
/**
 * Inspects and returns a string representation of an object for debugging.
 * @param {Object} obj - The object to inspect.
 * @param {number|null} depth - The depth level for inspection; use null for full depth.
 * @param {boolean} [showHidden=false] - Whether to include non-enumerable properties.
 * @returns {string} - The string representation of the object.
 */
function inspectObject(obj, depth = null, showHidden = false) {
    try {
        return util.inspect(obj, {
            depth,
            showHidden,
            colors: true, // Adds color coding for better readability in console
        });
    } catch (error) {
        console.error("Error inspecting object:", error);
        return "Error inspecting object.";
    }
}
export {
    inspectObject
}
