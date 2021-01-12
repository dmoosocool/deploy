"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataByEnv = exports.getEnvData = void 0;
const __1 = require("../");
/**
 * 获取env文件数据
 */
function getEnvData() {
    const config = __1.loadConfigFromEnv();
    if (!config || !config['ENVIRONMENT'] || !config['ENVIRONMENT_VARIABLE'])
        return {};
    const configEnv = config['ENVIRONMENT'].split(',');
    const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',');
    const result = {};
    configEnv.map((env) => {
        result[env] = {};
        configEnvData.map((envData) => {
            const configEnvDataKey = [env.toUpperCase(), envData.toUpperCase()].join('_');
            result[env][envData] =
                envData === 'private_key'
                    ? __1.replaceHomeDir(config[configEnvDataKey])
                    : config[configEnvDataKey];
        });
    });
    result['default'] = result[configEnv[0]];
    return result;
}
exports.getEnvData = getEnvData;
// 根据env获取对应环境的数据
function getDataByEnv(env) {
    const datas = getEnvData();
    if (Object.prototype.hasOwnProperty.call(datas, env)) {
        return datas[env];
    }
    return {};
}
exports.getDataByEnv = getDataByEnv;
