"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataByEnv = void 0;
const __1 = require("..");
/**
 * 获取env文件数据
 */
function getDataByEnv(env) {
    const config = __1.loadConfigFromEnv();
    if (!config || !config['ENVIRONMENT'] || !config['ENVIRONMENT_VARIABLE'])
        return {};
    const configEnv = config['ENVIRONMENT'].split(',');
    const configEnvData = config['ENVIRONMENT_VARIABLE'].split(',');
    const result = {};
    env = env || configEnv[0];
    configEnv.map((env) => {
        result[env] = {};
        configEnvData.map((envData) => {
            const configEnvDataKey = [env.toUpperCase(), envData.toUpperCase()].join('_');
            result[env].support = config['ENVIRONMENT'];
            result[env].currentEnv = env;
            result[env][envData] =
                envData === 'private_key'
                    ? __1.replaceHomeDir(config[configEnvDataKey])
                    : config[configEnvDataKey];
        });
    });
    if (Object.prototype.hasOwnProperty.call(result, env)) {
        return result[env];
    }
    else {
        return {};
    }
}
exports.getDataByEnv = getDataByEnv;
