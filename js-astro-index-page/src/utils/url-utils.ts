

/**
 * 处理路径字符串，确保返回正确的URL路径
 * @param path 输入的路径字符串
 * @returns 如果路径以'/'开头则直接返回，否则添加'/src/'前缀后返回
 */
export function url(path: string) {
    if(path.startsWith('http://') || path.startsWith('https://')) return path;
    if(path.startsWith('/')) return path;
    return `/src/${path}`;
}