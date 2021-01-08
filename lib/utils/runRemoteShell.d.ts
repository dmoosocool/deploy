import { Config } from 'node-ssh';
/**
 * 执行远程主机的shell文件
 *
 * @param serverConfig 服务器配置
 * @param shell 需要执行的shell文件路径
 */
export declare function runRemoteShell(serverConfig: Config, shell?: string): Promise<void>;
