export function removeTrailingSlash(path: string) {
  return path.endsWith('/') ? path.substring(0, path.length - 1) : path;
}
