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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIncrementalPackage = void 0;
const adm_zip_1 = __importDefault(require("adm-zip"));
const crypto_1 = __importDefault(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const __1 = require("../");
/**
 * 根据文件路劲返回文件md5
 *
 * @param file 需要加密文件的内容
 */
function encryptFile(file) {
    const md5 = crypto_1.default.createHash('md5');
    md5.update(file);
    return md5.digest('hex');
}
/**
 * 对zip包中的文件进行加密返回一组 { 压缩包文件的路径: 文件md5值 }
 *
 * @param zipFile zip文件路径
 */
function encryptZipFile(zipFile) {
    const entries = new adm_zip_1.default(zipFile).getEntries();
    const filesHash = {};
    entries.forEach((entry) => {
        // 过滤掉目录和MacOS自动生成的目录
        if (entry.isDirectory ||
            entry.entryName.indexOf('__MACOSX') > -1 ||
            entry.entryName.indexOf('.DS_Store') > -1)
            return true;
        const md5 = encryptFile(entry.getData().toString('utf8'));
        filesHash[entry.entryName] = {
            hash: md5,
            content: entry.getData().toString('utf8'),
        };
    });
    return filesHash;
}
/**
 * 对比两个资源包生成差异文件数组
 *
 * @param newerZipFileHash 较新的zip包文件hash
 * @param olderZipFileHash 较旧的zip包文件hash
 */
function diffZipFileHash(newerZipFileHash, olderZipFileHash) {
    const diffFile = {};
    Object.keys(newerZipFileHash).forEach((entryName) => {
        if (entryName.indexOf('.DS_Store') === -1 &&
            (olderZipFileHash[entryName] === undefined ||
                newerZipFileHash[entryName].hash !== olderZipFileHash[entryName].hash)) {
            diffFile[entryName] = newerZipFileHash[entryName];
        }
    });
    return diffFile;
}
/**
 * 根据一组文件数组生成zip包
 *
 * @param {Record<string, any>} filesObject
 * @param {string} zipname
 */
function filesArrayToZip(filesObject, zipname) {
    const zip = new adm_zip_1.default();
    Object.keys(filesObject).forEach((entry) => {
        const fileData = Buffer.from(filesObject[entry].content, 'utf8');
        zip.addFile(entry, Buffer.alloc(fileData.length, fileData));
    });
    zip.writeZip(path.resolve(zipname));
}
/**
 * 根据两个zip包, 生成增量包
 *
 * @param {string} newzip 较新的zip资源包路径
 * @param {string} oldzip 较旧的zip资源包路径
 * @param {string} incrementalPath 生成的增量包所在的路径
 */
function generateIncrementalPackage(newzip, oldzip, incrementalPath) {
    // 如果包含有 '~' 则会替换至用户目录
    incrementalPath = __1.replaceHomeDir(incrementalPath);
    newzip = __1.replaceHomeDir(newzip);
    oldzip = __1.replaceHomeDir(oldzip);
    const newer = encryptZipFile(newzip);
    const older = encryptZipFile(oldzip);
    const diffArray = diffZipFileHash(newer, older);
    // 如果生成的增量包路径不存在 则递归创建
    if (!fs.existsSync(incrementalPath)) {
        __1.createDirectoryAsync(incrementalPath);
    }
    let incrementalZipPath = '';
    // 如果存在差异数据才生成增量包. 不存在则返回空字符串
    if (Object.keys(diffArray).length > 0) {
        filesArrayToZip(diffArray, incrementalZipPath);
        incrementalZipPath = path.resolve(path.join(incrementalPath, `${__1.generateUniqueString()}.zip`));
    }
    return incrementalZipPath;
}
exports.generateIncrementalPackage = generateIncrementalPackage;
