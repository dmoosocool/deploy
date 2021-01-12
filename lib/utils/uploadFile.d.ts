/**
 * 根据环境变量进行文件上传. 默认为env文件中的第一个
 *
 * @param localPath 本地文件路径
 * @param remotePath 需要上传到远程服务器的路径
 */
export declare function uploadFile(localPath: string, remotePath: string): Promise<void>;
