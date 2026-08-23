import Phaser from "phaser";
import type { AiLandGameCallbacks } from "./types";

export class ForestScene extends Phaser.Scene {
  private readonly callbacks: AiLandGameCallbacks;
  private readonly initiallyOpenBridge: boolean;
  private player!: Phaser.Physics.Arcade.Sprite;
  private robot!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private actionHint!: Phaser.GameObjects.Text;
  private ground: Phaser.GameObjects.Rectangle[] = [];
  private bridge?: Phaser.GameObjects.Rectangle;
  private barrier?: Phaser.GameObjects.Rectangle;
  private moveLeft = false;
  private moveRight = false;
  private bridgeOpen = false;
  private bridgeReported = false;

  constructor(
    callbacks: AiLandGameCallbacks,
    initiallyOpenBridge = false,
  ) {
    super("AI Forest");
    this.callbacks = callbacks;
    this.initiallyOpenBridge = initiallyOpenBridge;
  }

  create() {
    this.createTextures();
    this.createWorld();
    this.createCharacters();
    this.createControls();
    this.createInterface();
    if (this.initiallyOpenBridge) this.unlockBridge();
  }

  update() {
    if (!this.player?.body) return;

    const left = this.cursors.left.isDown || this.keyA.isDown || this.moveLeft;
    const right = this.cursors.right.isDown || this.keyD.isDown || this.moveRight;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (left && !right) {
      this.player.setVelocityX(-210);
      this.player.setFlipX(true);
    } else if (right && !left) {
      this.player.setVelocityX(210);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
      body.blocked.down
    ) {
      this.player.setVelocityY(-430);
    }

    const nearRobot =
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.robot.x,
        this.robot.y,
      ) < 105;

    this.actionHint.setVisible(nearRobot && !this.bridgeOpen);
    if (nearRobot && Phaser.Input.Keyboard.JustDown(this.keyE)) {
      this.callbacks.onRobotInteraction();
    }

    if (this.bridgeOpen && this.player.x > 835 && !this.bridgeReported) {
      this.bridgeReported = true;
      this.callbacks.onBridgeReached();
    }
  }

  setExternalMove(direction: "left" | "right", active: boolean) {
    if (direction === "left") this.moveLeft = active;
    else this.moveRight = active;
  }

  requestInteraction() {
    if (this.bridgeOpen) return;
    const nearRobot =
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.robot.x,
        this.robot.y,
      ) < 120;
    if (nearRobot) this.callbacks.onRobotInteraction();
  }

  setGamePaused(paused: boolean) {
    if (paused) this.physics.world.pause();
    else this.physics.world.resume();
  }

  unlockBridge() {
    if (this.bridgeOpen) return;
    this.bridgeOpen = true;
    this.actionHint.setVisible(false);
    this.barrier?.destroy();

    // Верх моста совпадает с верхом земли (444 px), чтобы Arcade Physics
    // не воспринимал его как вертикальную стену.
    this.bridge = this.add.rectangle(700, 456, 130, 24, 0xd5b06f);
    this.bridge.setStrokeStyle(4, 0x8a6333);
    this.physics.add.existing(this.bridge, true);
    this.physics.add.collider(this.player, this.bridge);

    this.tweens.add({
      targets: this.bridge,
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: "Power2",
    });

    this.add
      .text(700, 395, "МОСТ ОТКРЫТ", {
        fontFamily: "Inter, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#dff7ea",
        backgroundColor: "#123d2d",
        padding: { x: 12, y: 7 },
      })
      .setOrigin(0.5);
  }

  private createTextures() {
    const player = this.add.graphics();
    player.fillStyle(0xffcc80);
    player.fillCircle(17, 13, 11);
    player.fillStyle(0x0fb880);
    player.fillRoundedRect(5, 22, 24, 25, 6);
    player.fillStyle(0x15352b);
    player.fillCircle(13, 11, 2);
    player.fillCircle(21, 11, 2);
    player.generateTexture("ai-land-player", 34, 48);
    player.destroy();

    const robot = this.add.graphics();
    robot.fillStyle(0xd8e7e1);
    robot.fillRoundedRect(4, 6, 38, 34, 7);
    robot.fillStyle(0x133f31);
    robot.fillCircle(15, 21, 4);
    robot.fillCircle(31, 21, 4);
    robot.lineStyle(3, 0x0fb880);
    robot.lineBetween(23, 6, 23, 0);
    robot.fillStyle(0x0fb880);
    robot.fillCircle(23, 2, 3);
    robot.fillStyle(0xaec8be);
    robot.fillRoundedRect(10, 42, 26, 15, 5);
    robot.generateTexture("ai-land-robot", 46, 58);
    robot.destroy();
  }

  private createWorld() {
    this.cameras.main.setBackgroundColor("#bfe8d1");
    this.physics.world.setBounds(0, 0, 960, 540);

    this.add.circle(835, 90, 58, 0xffe7a8, 0.9);
    this.add.rectangle(480, 390, 960, 250, 0x9bd0aa);
    this.add.rectangle(480, 450, 960, 180, 0x407c59);

    for (let index = 0; index < 14; index++) {
      const x = 30 + index * 72;
      const height = 90 + (index % 3) * 24;
      this.add.rectangle(x, 365 - height / 2, 15, height, 0x315c43);
      this.add.triangle(
        x,
        315 - height,
        -38,
        54,
        0,
        -28,
        38,
        54,
        index % 2 ? 0x1f6b47 : 0x267a52,
      );
    }

    this.add.rectangle(700, 492, 120, 96, 0x286e8d);
    for (let line = 0; line < 4; line++) {
      this.add.rectangle(700, 460 + line * 18, 92, 3, 0x6cb4ca, 0.65);
    }

    const leftGround = this.add.rectangle(320, 492, 640, 96, 0x6c8f4e);
    const rightGround = this.add.rectangle(860, 492, 200, 96, 0x6c8f4e);
    this.ground = [leftGround, rightGround];
    for (const platform of this.ground) {
      platform.setStrokeStyle(4, 0x416b3e);
      this.physics.add.existing(platform, true);
    }

    this.barrier = this.add.rectangle(625, 393, 14, 100, 0xbd5b4b);
    this.barrier.setStrokeStyle(3, 0x793b33);
    this.physics.add.existing(this.barrier, true);
  }

  private createCharacters() {
    this.player = this.physics.add.sprite(110, 390, "ai-land-player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);
    this.player.setDepth(10);
    for (const platform of this.ground) {
      this.physics.add.collider(this.player, platform);
    }
    if (this.barrier) this.physics.add.collider(this.player, this.barrier);

    this.robot = this.add.sprite(555, 414, "ai-land-robot");
    this.robot.setDepth(9);
    this.tweens.add({
      targets: this.robot,
      y: this.robot.y - 5,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    this.add
      .text(555, 360, "РОБИ", {
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#133f31",
      })
      .setOrigin(0.5);
  }

  private createControls() {
    if (!this.input.keyboard) {
      throw new Error("Клавиатурный ввод Phaser недоступен");
    }
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  private createInterface() {
    this.add
      .text(28, 24, "AI FOREST · МИССИЯ 01", {
        fontFamily: "Inter, sans-serif",
        fontSize: "17px",
        fontStyle: "bold",
        color: "#123d2d",
      })
      .setScrollFactor(0);

    this.add
      .text(28, 52, "Найди робота и помоги ему понять команду", {
        fontFamily: "Inter, sans-serif",
        fontSize: "15px",
        color: "#245844",
      })
      .setScrollFactor(0);

    this.actionHint = this.add
      .text(555, 315, "E · ГОВОРИТЬ", {
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#ffffff",
        backgroundColor: "#123d2d",
        padding: { x: 13, y: 8 },
      })
      .setOrigin(0.5)
      .setVisible(false);
  }
}
