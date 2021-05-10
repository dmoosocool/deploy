/**
 * 替换用户主目录
 *
 * @param {String} pendingPath 待处理的路径
 * @example replaceHomeDir('~/.ssh/id_rsa') => /Users/<username>/.ssh/id_rsa
 * @example replaceHomeDir('asd/asd/~/ss') => asd/asd/~/ss
 * @example replaceHomeDir('~/asd/asd/~/ss') => ~/asd/asd/~/ss
 *
 * @return {String} 处理完成的路径
 */
export declare function replaceHomeDir(pendingPath: string): string;
