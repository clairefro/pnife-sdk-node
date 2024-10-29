"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePnife = validatePnife;
const validateTool_1 = require("./validateTool");
function validatePnife(obj) {
    const errors = [];
    if (!obj || typeof obj !== "object") {
        errors.push("Pnife is not an object.");
    }
    // Validate 'name' property is a string
    if (typeof (obj === null || obj === void 0 ? void 0 : obj.name) !== "string") {
        errors.push("Property 'name' must be a string.");
    }
    // Validate 'tools' property is an array of correctly formatted Tools
    if (!Array.isArray(obj === null || obj === void 0 ? void 0 : obj.tools)) {
        errors.push("Property 'tools' must be an array.");
    }
    else {
        obj.tools.forEach((tool) => {
            try {
                (0, validateTool_1.validateTool)(tool);
            }
            catch (e) {
                errors.push(e.message);
            }
        });
    }
    if (errors.length) {
        throw new Error(`Validation error: pnife is not correctly formatted. ${errors.join("\n")}`);
    }
    return;
}
