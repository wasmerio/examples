const concatRelativeUrls = (...urls: string[]): string => {
  return urls.join("/").replace(/\/+/g, "/");
};

export default concatRelativeUrls;
