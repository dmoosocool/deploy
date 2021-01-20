"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const node_ssh_1 = require("node-ssh");
const __1 = require("../");
/**
 * 根据环境变量进行文件上传. 默认为env文件中的第一个
 *
 * @param localPath 本地文件路径
 * @param remotePath 需要上传到远程服务器的路径
 */
function uploadFile(localPath, remotePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const envDatas = __1.getDataByEnv(process.env.UPLOAD_ENV || 'default');
        const ssh = new node_ssh_1.NodeSSH();
        yield ssh.connect(envDatas);
        yield ssh.putFile(localPath, remotePath);
        ssh.dispose();
    });
}
exports.uploadFile = uploadFile;
