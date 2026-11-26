// Stylized low-resolution land silhouettes, not a geographic boundary dataset.
const continents = [
  [
    [-168, 66],
    [-142, 70],
    [-124, 59],
    [-102, 72],
    [-58, 53],
    [-82, 23],
    [-99, 17],
    [-117, 32],
    [-131, 54],
  ],
  [
    [-82, 12],
    [-65, 10],
    [-49, -3],
    [-35, -9],
    [-48, -26],
    [-67, -55],
    [-77, -29],
  ],
  [
    [-52, 83],
    [-21, 77],
    [-43, 60],
    [-61, 64],
  ],
  [
    [-12, 36],
    [2, 51],
    [16, 60],
    [24, 71],
    [55, 67],
    [67, 55],
    [39, 40],
    [28, 35],
  ],
  [
    [-17, 35],
    [14, 37],
    [33, 29],
    [44, 12],
    [50, 9],
    [39, -16],
    [20, -35],
    [9, -22],
    [-5, 4],
    [-17, 15],
  ],
  [
    [39, 40],
    [55, 67],
    [100, 77],
    [144, 65],
    [180, 66],
    [164, 49],
    [142, 42],
    [122, 25],
    [105, 4],
    [93, 18],
    [78, 8],
    [63, 26],
  ],
  [
    [114, -21],
    [130, -12],
    [146, -15],
    [154, -27],
    [141, -39],
    [117, -34],
  ],
  [
    [43, -12],
    [51, -15],
    [47, -26],
    [43, -22],
  ],
  [
    [131, 32],
    [142, 45],
    [146, 43],
    [140, 32],
  ],
  [
    [96, 4],
    [114, 1],
    [122, -10],
    [105, -7],
  ],
  [
    [166, -34],
    [179, -41],
    [171, -48],
    [165, -45],
  ],
]

function contains(lon: number, lat: number, polygon: number[][]): boolean {
  let inside = false
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [x, y] = polygon[index]!
    const [px, py] = polygon[previous]!
    if ((y! > lat) !== (py! > lat) && lon < (px! - x!) * (lat - y!) / (py! - y!) + x!)
      inside = !inside
  }
  return inside
}

export const globePoints = (() => {
  const points: { x: number, y: number, z: number, land: boolean }[] = []
  for (let lat = -80; lat <= 80; lat += 5) {
    const radians = lat * Math.PI / 180
    const step = 5 / Math.max(0.25, Math.cos(radians))
    for (let lon = -180; lon < 180; lon += step) {
      const angle = lon * Math.PI / 180
      points.push({
        x: Math.cos(radians) * Math.sin(angle),
        y: -Math.sin(radians),
        z: Math.cos(radians) * Math.cos(angle),
        land: continents.some(polygon => contains(lon, lat, polygon)),
      })
    }
  }
  return points
})()
