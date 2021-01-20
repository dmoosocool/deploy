"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataByEnv = void 0;
const __1 = require("..");
/**
 * 获取env文件数据
 */
function getDataByEnv(env) {
    const config = __1.loadConfigFromEnv();
    let sjkhConfig = {};
    if (!config ||
        !config['ENVIRONMENT'] ||
        !config['ENVIRONMENT_VARIABLE'] ||
        config['ENVIRONMENT'].indexOf(',') === -1 ||
        config['ENVIRONMENT_VARIABLE'].indexOf(',') === -1) {
        return sjkhConfig;
    }
    const supportedEnv = config['ENVIRONMENT'].split(',');
    const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',');
    const currentEnv = env || supportedEnv[0];
    sjkhConfig = {
        _env: currentEnv,
        _supportedEnv: supportedEnv,
    };
    if (!currentEnv || supportedEnv.indexOf(currentEnv) === -1) {
        return sjkhConfig;
    }
    configEnvData.map((envData) => {
        const configEnvDataKey = [currentEnv.toUpperCase(), envData.toUpperCase()].join('_');
        sjkhConfig[envData] =
            envData === 'private_key'
                ? __1.replaceHomeDir(config[configEnvDataKey])
                : config[configEnvDataKey];
    });
    return sjkhConfig;
}
exports.getDataByEnv = getDataByEnv;
