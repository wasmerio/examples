---
title: Hero 背景效果矩阵
description: 展示 ermaozi 支持的 Plume Hero Canvas 与 WebGL 背景。
permalink: /effects/
home: true
config:
  - type: hero
    effect: prism
    effectConfig:
      height: 3.5
      baseWidth: 5.5
      animationType: hover
      glow: 1
      offset: { x: 0, y: 0 }
      noise: 0
      transparent: true
      scale: 3.6
      hueShift: 0
      colorFrequency: 1
      hoverStrength: 2
      inertia: 0.05
      bloom: 1
      suspendWhenOffscreen: true
      timeScale: 0.5
    hero:
      name: Prism
      text: OGL 棱镜背景
  - type: hero
    effect: pixel-blast
    effectConfig:
      variant: diamond
      pixelSize: 4
      color: '#5086a1'
      className: effect-config-pixel
      style: { opacity: 0.96 }
      antialias: true
      patternScale: 2
      patternDensity: 1
      liquid: false
      liquidStrength: 0.1
      liquidRadius: 1
      pixelSizeJitter: 0
      enableRipples: true
      rippleIntensityScale: 1
      rippleThickness: 0.1
      rippleSpeed: 0.3
      liquidWobbleSpeed: 4.5
      autoPauseOffscreen: true
      speed: 0.5
      transparent: true
      edgeFade: 0.5
      noiseAmount: 0
    hero:
      name: Pixel Blast
      text: Three.js 像素背景
  - type: hero
    effect: hyper-speed
    effectConfig:
      distortion: turbulentDistortion
      length: 400
      roadWidth: 10
      islandWidth: 2
      lanesPerRoad: 3
      fov: 90
      fovSpeedUp: 150
      speedUp: 2
      carLightsFade: 0.4
      totalSideLightSticks: 20
      lightPairsPerRoadWay: 40
      shoulderLinesWidthPercentage: 0.05
      brokenLinesWidthPercentage: 0.1
      brokenLinesLengthPercentage: 0.5
      lightStickWidth: [0.12, 0.5]
      lightStickHeight: [1.3, 1.7]
      movingAwaySpeed: [60, 80]
      movingCloserSpeed: [-120, -160]
      carLightsLength: [12, 80]
      carLightsRadius: [0.05, 0.14]
      carWidthPercentage: [0.3, 0.5]
      carShiftX: [-0.8, 0.8]
      carFloorSeparation: [0, 5]
      colors:
        roadColor: 0x080808
        islandColor: 0x0a0a0a
        background: 0x000000
        shoulderLines: 0x131318
        brokenLines: 0x131318
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac]
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555]
        sticks: 0x03b3c3
    hero:
      name: Hyper Speed
      text: Three.js 高速公路背景
  - type: hero
    effect: liquid-ether
    effectConfig:
      mouseForce: 20
      cursorSize: 100
      isViscous: false
      viscous: 30
      iterationsViscous: 32
      iterationsPoisson: 32
      dt: 0.014
      BFECC: true
      resolution: 0.5
      isBounce: false
      colors: ['#5227FF', '#FF9FFC', '#B19EEF']
      className: effect-config-liquid
      style: { opacity: 0.97 }
      autoDemo: true
      autoSpeed: 0.5
      autoIntensity: 2.2
      takeoverDuration: 0.25
      autoResumeDelay: 1000
      autoRampDuration: 0.6
    hero:
      name: Liquid Ether
      text: Three.js 流体背景
  - type: hero
    effect: dot-grid
    effectConfig:
      dotSize: 5
      gap: 15
      baseColor: '#ebebf5'
      activeColor: '#8cccd5'
      proximity: 120
      speedTrigger: 100
      shockRadius: 250
      shockStrength: 5
      maxSpeed: 5000
      resistance: 750
      returnDuration: 1.5
      className: effect-config-dot
      style: { opacity: 0.98 }
    hero:
      name: Dot Grid
      text: Canvas 点阵背景
  - type: hero
    effect: iridescence
    effectConfig:
      color:
        light: [1, 1, 1]
        dark: [0.35, 0.55, 0.8]
      speed: 1
      amplitude: 0.1
      mouseReact: true
    hero:
      name: Iridescence
      text: OGL 虹彩背景
  - type: hero
    effect: orb
    effectConfig:
      hue: 0
      hoverIntensity: 0.2
      rotateOnHover: true
      forceHoverState: false
      className: effect-config-orb
    hero:
      name: Orb
      text: OGL 球体背景
  - type: hero
    effect: beams
    effectConfig:
      beamWidth: 2
      beamHeight: 15
      beamNumber: 12
      lightColor:
        light: '#334155'
        dark: '#ffffff'
      speed: 2
      noiseIntensity: 1.75
      scale: 0.2
      rotation: 0
    hero:
      name: Beams
      text: Three.js 光束背景
  - type: hero
    effect: lightning
    effectConfig:
      hue: 255
      xOffset: 0
      speed: 1
      intensity: 1
      size: 1
    hero:
      name: Lightning
      text: WebGL 闪电背景
  - type: hero
    effect: dark-veil
    effectConfig:
      hueShift: 0
      noiseIntensity: 0
      scanlineIntensity: 0
      speed: 0.5
      scanlineFrequency: 0
      warpAmount: 0
      resolutionScale: 1
    hero:
      name: Dark Veil
      text: OGL 暗色帷幕背景
createTime: 2026/08/06 01:27:28
---
