export function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "ios";
  }
}
