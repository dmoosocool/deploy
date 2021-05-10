/**
 * 将目录打包zip
 *
 * @param {String} packageFolder 需要打包的目录
 * @param {String} publishFolder 待发布的目录
 * @return {Promise<String>} 生成zip包的文件名
 * @default
 * packageFolder path.join(process.cwd(), 'uploads')
 * publishFolder path.resolve(process.cwd())
 * @example
 * const zipname = await packageFolder(path.join(process.cwd(), 'uploads'), path.resolve(process.cwd(), 'dist'))
 * console.log(zipname); // /Users/{user}/{projectDir}/dist/20210103104902113.zip
 */
export declare function packageFolder(packageFolder?: string, publishFolder?: string): Promise<string>;
