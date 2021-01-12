import { DotenvParseOutput } from '../';
/**
 * 获取env文件数据
 */
export declare function getEnvData(): Record<string, DotenvParseOutput>;
export declare function getDataByEnv(env: string): DotenvParseOutput;
