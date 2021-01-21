"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueString = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
function generateUniqueString() {
    return dayjs_1.default().format('YYYYMMDDHHmmssSSS');
}
exports.generateUniqueString = generateUniqueString;
