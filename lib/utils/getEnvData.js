"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvData = void 0;
const _1 = require("./");
function getEnvData() {
    const config = _1.loadConfigFromEnv();
    if (!config || !config['ENVIRONMENT'] || config['ENVIRONMENT_VARIABLE'])
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
                    ? _1.replaceHomeDir(config[configEnvDataKey])
                    : config[configEnvDataKey];
        });
    });
    return config;
}
exports.getEnvData = getEnvData;
