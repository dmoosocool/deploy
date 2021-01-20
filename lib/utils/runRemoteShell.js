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
exports.runRemoteShell = void 0;
const node_ssh_1 = require("node-ssh");
/**
 * 执行远程主机的shell文件
 *
 * @param serverConfig 服务器配置
 * @param shell 需要执行的shell文件路径
 */
function runRemoteShell(serverConfig, shell = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const ssh = new node_ssh_1.NodeSSH();
        // 尝试连接远程主机
        try {
            yield ssh.connect(serverConfig);
        }
        catch (err) {
            console.log('server config failed.');
            throw new Error(err);
        }
        // 检查是否为shell文件
        if (!shell.endsWith('.sh')) {
            throw new Error("The remote script executed must end with '.sh'");
        }
        // 执行远程主机上的shell文件.
        const result = yield ssh.execCommand(`sh ${shell}`);
        console.log(result.stdout);
        ssh.dispose();
    });
}
exports.runRemoteShell = runRemoteShell;
