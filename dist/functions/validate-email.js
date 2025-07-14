"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateEmail;
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
