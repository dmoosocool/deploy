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
exports.packageFolder = void 0;
const archiver_1 = __importDefault(require("archiver"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const __1 = require("../");
/**
 * 将目录打包zip
 *
 * @param {String} packageFolder 需要打包的目录
 * @param {String} publishFolder 待发布的目录
 * @return {Promise<String>} 生成zip包的文件名
 * @default
 * packageFolder path.join(process.cwd(), 'uploads')
 * publishFolder path.resolve(process.cwd())
 * @example
 * const zipname = await packageFolder(path.join(process.cwd(), 'uploads'), path.resolve(process.cwd(), 'dist'))
 * console.log(zipname); // /Users/{user}/{projectDir}/dist/20210103104902113.zip
 */
function packageFolder(packageFolder = path.join(process.cwd(), 'uploads'), publishFolder = path.resolve(process.cwd())) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(packageFolder)) {
            reject('待上传路径不存在');
        }
        if (!fs.statSync(packageFolder).isDirectory()) {
            reject('待上传路径不是一个目录');
        }
        const zipfilename = `${__1.generateUniqueString()}.zip`;
        const output = fs.createWriteStream(path.join(publishFolder, zipfilename));
        const archive = archiver_1.default('zip', { zlib: { level: 9 } });
        // 如果待发布的目录不存在则递归创建目录.
        __1.createDirectoryAsync(publishFolder);
        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            resolve(path.join(publishFolder, zipfilename));
        });
        output.on('end', () => {
            console.log('Data has been drained');
            resolve(path.join(publishFolder, zipfilename));
        });
        archive.on('error', (err) => {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(path.resolve(packageFolder), false, { date: new Date() });
        archive.finalize();
    });
}
exports.packageFolder = packageFolder;
