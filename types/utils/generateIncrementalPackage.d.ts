/**
 * 根据两个zip包, 生成增量包
 *
 * @param {string} newzip 较新的zip资源包路径
 * @param {string} oldzip 较旧的zip资源包路径
 * @param {string} incrementalPath 生成的增量包所在的路径
 */
export declare function generateIncrementalPackage(newzip: string, oldzip: string, incrementalPath: string): string;
