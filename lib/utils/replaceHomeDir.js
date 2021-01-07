"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceHomeDir = void 0;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * 替换用户主目录
 *
 * @param {String} pendingPath 待处理的路径
 * @example replaceHomeDir('~/.ssh/id_rsa') => /Users/<username>/.ssh/id_rsa
 * @example replaceHomeDir('asd/asd/~/ss') => asd/asd/~/ss
 * @example replaceHomeDir('~/asd/asd/~/ss') => ~/asd/asd/~/ss
 *
 * @return {String} 处理完成的路径
 */
function replaceHomeDir(pendingPath) {
    // 如果待处理的路径包含两次 '~' 则直接返回.
    if (pendingPath.split('~').length > 2) {
        return pendingPath;
    }
    // 如果待处理路径是 '~' 开始的则将 '~' 替换成 os.homedir() 的值.
    if (pendingPath.startsWith('~')) {
        const homeDir = os.homedir();
        return path.resolve(pendingPath.replace(/~/g, homeDir));
    }
    // 否则默认情况直接返回待处理路径.
    return pendingPath;
}
exports.replaceHomeDir = replaceHomeDir;
