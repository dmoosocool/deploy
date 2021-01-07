import { Config } from 'node-ssh';
export declare function runRemoteShell(serverConfig: Config, shell?: string): Promise<void>;
