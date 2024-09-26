"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePnifeName = generatePnifeName;
const short = require("short-uuid");
const constants_1 = require("../constants");
function generatePnifeName() {
    return `${constants_1.DEFAULT_PNIFE_NAME}_${short.generate()}`;
}
