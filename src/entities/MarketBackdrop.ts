import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants';

export class MarketBackdrop extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    // 1. Sky Gradient - Layered Rectangles
    // Top sky (navy blue)
    const sky1 = scene.add.rectangle(GAME_WIDTH / 2, 200, GAME_WIDTH, 400, 0x0a0c1b, 1);
    // Mid sky (deep purple)
    const sky2 = scene.add.rectangle(GAME_WIDTH / 2, 500, GAME_WIDTH, 200, 0x141226, 1);
    // Horizon glow (warm reddish-violet)
    const sky3 = scene.add.rectangle(GAME_WIDTH / 2, 700, GAME_WIDTH, 200, 0x221731, 1);
    // Ground level backdrop
    const groundBack = scene.add.rectangle(GAME_WIDTH / 2, 900, GAME_WIDTH, 200, 0x171520, 1);

    this.add([sky1, sky2, sky3, groundBack]);

    // 2. Twinkling Stars (static primitives with varying opacities to avoid heavy per-frame update)
    for (let i = 0; i < 30; i++) {
      const starX = Phaser.Math.Between(15, GAME_WIDTH - 15);
      const starY = Phaser.Math.Between(15, 500);
      const starRadius = Phaser.Math.Between(1, 3) / 2;
      const starAlpha = Phaser.Math.FloatBetween(0.3, 0.95);
      const star = scene.add.circle(starX, starY, starRadius, 0xfff7df, starAlpha);
      this.add(star);
      
      // Subtle shared twinkling effect: pulse a few stars
      if (i % 5 === 0) {
        scene.tweens.add({
          targets: star,
          alpha: 0.1,
          duration: Phaser.Math.Between(1500, 3000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }

    // 3. Glowing Moon
    const moonBack = scene.add.circle(120, 150, 48, 0xffd166, 0.12);
    const moon = scene.add.circle(120, 150, 34, 0xfff7df, 1);
    // Translucent Clouds cutting the moon
    const cloud1 = scene.add.ellipse(150, 170, 160, 24, 0x221731, 0.65);
    const cloud2 = scene.add.ellipse(450, 220, 200, 30, 0x221731, 0.45);
    this.add([moonBack, moon, cloud1, cloud2]);

    // 4. Distant City Skyline Silhouettes
    const buildingWidths = [70, 96, 80, 110, 90, 120, 85];
    const buildingHeights = [260, 340, 290, 390, 250, 310, 220];
    const buildingX = [40, 120, 210, 310, 410, 520, 630];
    
    buildingX.forEach((x, idx) => {
      const w = buildingWidths[idx];
      const h = buildingHeights[idx];
      const building = scene.add.rectangle(x, 600 - h / 2, w, h, 0x131120, 1);
      building.setStrokeStyle(1.5, 0x1f1b2e);
      this.add(building);

      // Add a few tiny yellow windows inside the buildings
      const windowRows = Math.floor(h / 50);
      const windowCols = Math.floor(w / 30);
      for (let r = 0; r < windowRows; r++) {
        for (let c = 0; c < windowCols; c++) {
          if (Phaser.Math.Between(0, 10) > 4) { // 50% chance of lit window
            const winX = x - w / 2 + 10 + c * 25;
            const winY = (600 - h) + 20 + r * 45;
            const win = scene.add.rectangle(winX, winY, 5, 8, 0xffd166, Phaser.Math.FloatBetween(0.4, 0.8));
            this.add(win);
          }
        }
      }
    });

    // 5. Midground Market Tents
    const tentColors = [0xbd3a3a, 0x3a7cbd, 0x5a8c5a];
    const tentX = [180, 540];
    tentX.forEach((x, idx) => {
      // Tent posts
      const postL = scene.add.rectangle(x - 68, 630, 4, 120, 0x221d28, 1);
      const postR = scene.add.rectangle(x + 68, 630, 4, 120, 0x221d28, 1);
      // Tent Roof
      const roof = scene.add.triangle(x, 520, x - 80, 570, x + 80, 570, x, 520, tentColors[idx % tentColors.length], 1);
      roof.setStrokeStyle(3, 0x110c14);
      // Under-tent glow
      const glow = scene.add.ellipse(x, 590, 140, 50, 0xffd166, 0.15);
      this.add([postL, postR, roof, glow]);
    });

    // 6. Warm Street Lights
    const lightX = [60, GAME_WIDTH - 60];
    lightX.forEach((x) => {
      // Post
      const post = scene.add.rectangle(x, 560, 8, 220, 0x1d1a24, 1);
      const arm = scene.add.rectangle(x + (x < GAME_WIDTH / 2 ? 14 : -14), 460, 36, 6, 0x1d1a24, 1);
      // Light Head
      const head = scene.add.rectangle(x + (x < GAME_WIDTH / 2 ? 32 : -32), 466, 16, 12, 0x302a3a, 1);
      const bulb = scene.add.circle(x + (x < GAME_WIDTH / 2 ? 32 : -32), 472, 6, 0xffd166, 1);
      
      // Light Cone (cone of light cast on street)
      const coneX = x + (x < GAME_WIDTH / 2 ? 32 : -32);
      const cone = scene.add.triangle(
        coneX, 600,
        0, -128,           // top peak
        -100, 120,         // bottom left
        100, 120,          // bottom right
        0xffe596, 0.11
      );

      this.add([post, arm, head, bulb, cone]);
    });

    // 7. Decorative String Lights (Fairy Lights)
    const stringY = 280;
    const segments = 12;
    for (let s = 0; s < 2; s++) {
      const startX = s === 0 ? 0 : GAME_WIDTH / 2;
      const endX = s === 0 ? GAME_WIDTH / 2 : GAME_WIDTH;
      const midX = (startX + endX) / 2;
      const dipY = stringY + 40;

      // Draw wire
      const curve = new Phaser.Curves.Spline([
        new Phaser.Math.Vector2(startX, stringY),
        new Phaser.Math.Vector2(midX, dipY),
        new Phaser.Math.Vector2(endX, stringY)
      ]);
      const graphics = scene.add.graphics();
      graphics.lineStyle(1.5, 0x22202a, 0.85);
      curve.draw(graphics);
      this.add(graphics);

      // Hang bulbs along the curve
      const points = curve.getPoints(segments);
      points.forEach((pt, pIdx) => {
        if (pIdx > 0 && pIdx < points.length - 1) {
          const bulbGlow = scene.add.circle(pt.x, pt.y + 2, 7, 0xffd166, 0.3);
          const bulb = scene.add.circle(pt.x, pt.y + 2, 4, 0xfff7df, 1);
          this.add([bulbGlow, bulb]);

          if (pIdx % 2 === 0) {
            scene.tweens.add({
              targets: bulbGlow,
              scale: 1.4,
              alpha: 0.5,
              duration: Phaser.Math.Between(800, 1200),
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }
        }
      });
    }

    // 8. Ground / Street layer
    const street = scene.add.rectangle(GAME_WIDTH / 2, 1085, GAME_WIDTH, 390, COLORS.street, 1);
    street.setStrokeStyle(4, 0x211c28);
    // Pavement details
    const pavementLine = scene.add.rectangle(GAME_WIDTH / 2, 892, GAME_WIDTH, 6, 0x3d3040, 0.4);
    
    // Ambient light reflection on road
    const streetGlow = scene.add.rectangle(GAME_WIDTH / 2, 930, GAME_WIDTH, 70, 0xffd166, 0.03);

    this.add([street, pavementLine, streetGlow]);

    scene.add.existing(this);
  }
}
