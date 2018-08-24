"use strict";
function subtle() {
    return window.crypto.subtle || window.crypto.webkitSubtle;
}
exports.subtle = subtle;
//# sourceMappingURL=compat.js.map