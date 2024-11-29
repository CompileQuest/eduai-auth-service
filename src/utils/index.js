import util from "util";
/**
 * Extracts and transforms form fields from the user context.
 * @param {Object} userContext - The user context object from the SuperTokens request.
 * @returns {Object|null} - A key-value object of form fields or null if not found.
 */
function extractFormFields(userContext) {
    try {
        const formFields = userContext?._default?.request?.parsedJSONBody?.formFields;
        if (formFields && Array.isArray(formFields)) {
            return formFields.reduce((acc, field) => {
                acc[field.id] = field.value;
                return acc;
            }, {});
        }
        return null; // Return null if formFields are not found
    } catch (error) {
        console.error("Error extracting form fields:", error);
        return null;
    }
}







export {
    extractFormFields
}

