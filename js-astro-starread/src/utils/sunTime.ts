export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

function getJulianDay(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  if (month <= 2) {
    year--;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5 + hour / 24;
}

function getSunDeclination(julianDay: number): number {
  const n = julianDay - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
  const epsilon = 23.439 - 0.0000004 * n;
  
  return Math.asin(Math.sin(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180)) * 180 / Math.PI;
}

function getEquationOfTime(julianDay: number): number {
  const n = julianDay - 2451545.0;
  const g = (357.528 + 0.9856003 * n) % 360;
  const L = (280.460 + 0.9856474 * n) % 360;
  
  const eqTime = 9.87 * Math.sin(2 * L * Math.PI / 180) - 7.53 * Math.cos(g * Math.PI / 180) - 1.5 * Math.sin(g * Math.PI / 180);
  
  return eqTime;
}

export function calculateSunTimes(date: Date, latitude: number, longitude: number): SunTimes {
  const julianDay = getJulianDay(date);
  const declination = getSunDeclination(julianDay);
  const eqTime = getEquationOfTime(julianDay);
  
  const latRad = latitude * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  
  const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);
  
  let hourAngle: number;
  if (cosHourAngle > 1) {
    hourAngle = 0;
  } else if (cosHourAngle < -1) {
    hourAngle = 180;
  } else {
    hourAngle = Math.acos(cosHourAngle) * 180 / Math.PI;
  }
  
  const solarNoon = (720 - 4 * longitude - eqTime) / 1440;
  
  const sunriseFraction = solarNoon - hourAngle / 360;
  const sunsetFraction = solarNoon + hourAngle / 360;
  
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseFraction * 24));
  sunrise.setMinutes(Math.floor((sunriseFraction * 24 - sunrise.getHours()) * 60));
  sunrise.setSeconds(Math.floor(((sunriseFraction * 24 - sunrise.getHours()) * 60 - sunrise.getMinutes()) * 60));
  
  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetFraction * 24));
  sunset.setMinutes(Math.floor((sunsetFraction * 24 - sunset.getHours()) * 60));
  sunset.setSeconds(Math.floor(((sunsetFraction * 24 - sunset.getHours()) * 60 - sunset.getMinutes()) * 60));
  
  return { sunrise, sunset };
}

export function isDayTime(date: Date, latitude: number, longitude: number): boolean {
  const sunTimes = calculateSunTimes(date, latitude, longitude);
  const time = date.getTime();
  return time >= sunTimes.sunrise.getTime() && time <= sunTimes.sunset.getTime();
}

export function getUserLatLng(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('无法获取地理位置，使用默认值');
          resolve({ latitude: 39.9042, longitude: 116.4074 });
        },
        { timeout: 5000 }
      );
    } else {
      console.warn('浏览器不支持地理位置，使用默认值');
      resolve({ latitude: 39.9042, longitude: 116.4074 });
    }
  });
}

export async function shouldUseDarkMode(): Promise<boolean> {
  const { latitude, longitude } = await getUserLatLng();
  return !isDayTime(new Date(), latitude, longitude);
}