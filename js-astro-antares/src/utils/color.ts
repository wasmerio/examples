export const colorDifference = (color1:string, color2:string) => {
  if (color1 === '' || color2 === '') {
    return Infinity;
  }
  const getRGB = (color:string) => color.match(/\d+/g)!.map(Number);
  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  const diff = Math.sqrt(
    Math.pow(rgb2[0] - rgb1[0], 2) +
    Math.pow(rgb2[1] - rgb1[1], 2) +
    Math.pow(rgb2[2] - rgb1[2], 2)
  );
  return diff;
}

let previousColor = '';

// 生成随机的 RGB 值（限制范围，并确保不与之前颜色太接近）
export const getRandomRGB = ()=> {
  const min = 80;
  const max = 180;
  let newColor = '';
  
  // 生成新颜色，确保与之前颜色差异较大
  do {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    const g = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;

    newColor = `rgb(${r}, ${g}, ${b})`;
  } while (colorDifference(previousColor, newColor) < 100); // 调整差异阈值
  
  previousColor = newColor;
  return newColor;
}