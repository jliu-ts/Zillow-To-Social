import * as THREE from 'three';

/**
 * Procedural texture generator using HTML5 Canvas
 * Complies with Three.js skill: Zero 404s, SRGBColorSpace, procedural canvas finishes.
 */

export function createHerringboneWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm base oak color
  ctx.fillStyle = '#bfa588';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const plankW = 128;
  const plankH = 32;

  // Draw herringbone pattern
  for (let y = -plankW; y < canvas.height + plankW; y += plankH) {
    for (let x = -plankW; x < canvas.width + plankW; x += plankW) {
      // Wood plank variation
      const shade = Math.floor(Math.sin(x * 12.3 + y * 4.7) * 15);
      const r = Math.min(255, Math.max(0, 195 + shade));
      const g = Math.min(255, Math.max(0, 168 + shade));
      const b = Math.min(255, Math.max(0, 138 + Math.floor(shade * 0.8)));

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, plankW - 2, plankH - 2);

      // Fine wood grain lines inside plank
      ctx.strokeStyle = `rgba(130, 95, 60, 0.15)`;
      ctx.lineWidth = 1;
      for (let gIdx = 4; gIdx < plankH; gIdx += 6) {
        ctx.beginPath();
        ctx.moveTo(x, y + gIdx);
        ctx.bezierCurveTo(
          x + plankW * 0.3,
          y + gIdx + (Math.sin(x) * 2),
          x + plankW * 0.7,
          y + gIdx - (Math.cos(y) * 2),
          x + plankW - 2,
          y + gIdx
        );
        ctx.stroke();
      }

      // Plank micro-bevel border
      ctx.strokeStyle = 'rgba(70, 50, 30, 0.35)';
      ctx.strokeRect(x, y, plankW - 2, plankH - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCalacattaMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Luminous ivory base
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#f9f8f6');
  grad.addColorStop(0.5, '#f4f2ee');
  grad.addColorStop(1, '#ebe8e2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle clouds
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rad = 60 + Math.random() * 140;
    const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    cloudGrad.addColorStop(0, 'rgba(215, 210, 202, 0.25)');
    cloudGrad.addColorStop(1, 'rgba(245, 243, 240, 0)');
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw major dramatic Calacatta Gold & Grey veins
  function drawVein(
    startX: number,
    startY: number,
    color: string,
    width: number,
    steps: number
  ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    let curX = startX;
    let curY = startY;

    for (let s = 0; s < steps; s++) {
      curX += (Math.random() - 0.35) * 80;
      curY += (Math.random() - 0.2) * 60;
      ctx.lineTo(curX, curY);

      // Minor branch
      if (Math.random() > 0.75) {
        ctx.save();
        ctx.lineWidth = width * 0.4;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(curX + (Math.random() - 0.5) * 60, curY + Math.random() * 50);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.stroke();
  }

  // Grey primary veins
  drawVein(100, 50, 'rgba(130, 135, 140, 0.4)', 4, 16);
  drawVein(300, 20, 'rgba(160, 162, 165, 0.35)', 6, 18);
  drawVein(600, 100, 'rgba(140, 142, 145, 0.3)', 3, 14);

  // Warm Gold vein accents
  drawVein(280, 40, 'rgba(195, 160, 105, 0.5)', 2.5, 15);
  drawVein(550, 150, 'rgba(185, 145, 95, 0.4)', 2, 12);
  drawVein(120, 300, 'rgba(205, 170, 115, 0.35)', 1.5, 10);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFlutedWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const slatW = 16;
  for (let x = 0; x < canvas.width; x += slatW) {
    const grad = ctx.createLinearGradient(x, 0, x + slatW, 0);
    grad.addColorStop(0, '#755437');
    grad.addColorStop(0.3, '#c29b74');
    grad.addColorStop(0.8, '#9c7752');
    grad.addColorStop(1, '#4f3620');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, slatW, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTravertineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm pale stone base
  ctx.fillStyle = '#ded7cc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Horizontal porous striations
  for (let y = 0; y < canvas.height; y += 4) {
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(90, 80, 70, ${alpha})` : `rgba(255, 250, 240, ${alpha})`;
    ctx.fillRect(0, y, canvas.width, 2 + Math.random() * 4);
  }

  // Micro pits
  for (let i = 0; i < 400; i++) {
    const px = Math.random() * canvas.width;
    const py = Math.random() * canvas.height;
    const pw = 2 + Math.random() * 6;
    const ph = 1 + Math.random() * 2;
    ctx.fillStyle = 'rgba(100, 90, 80, 0.12)';
    ctx.fillRect(px, py, pw, ph);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createAcousticFabricTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#dcd8d1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro weave
  for (let x = 0; x < canvas.width; x += 4) {
    for (let y = 0; y < canvas.height; y += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillStyle = 'rgba(140, 135, 125, 0.2)';
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWaterRippleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f6e8c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 80; i++) {
    const rx = Math.random() * canvas.width;
    const ry = Math.random() * canvas.height;
    const rad = 20 + Math.random() * 60;
    ctx.strokeStyle = 'rgba(180, 240, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
