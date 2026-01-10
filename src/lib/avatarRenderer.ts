export function drawProfessionalAvatar(canvas, options = {}) {
  const { isSpeaking = false, mouthOpenness = 0, isBlinking = false } = options;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;

  // Colors for eyes and mouth
  const colors = {
    eye: "black",
    eyeWhite: "#FFFFFF",
    eyeGlasses: "rgba(0, 0, 0, 0.1)",
    mouth: "#8B4513",
    tongue: "#FF6B9D",
    teeth: "#FFFFFF",
  };

  // ========== EYES ==========
  const eyeY = 145;
  const leftEyeX = centerX - 20;
  const rightEyeX = centerX + 30;

  if (isBlinking) {
    // Eyes closed (blinking)
    ctx.strokeStyle = colors.eye;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Left eye
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 12, eyeY);
    ctx.quadraticCurveTo(leftEyeX, eyeY + 2, leftEyeX + 12, eyeY);
    ctx.stroke();

    // Right eye
    ctx.beginPath();
    ctx.moveTo(rightEyeX - 12, eyeY);
    ctx.quadraticCurveTo(rightEyeX, eyeY + 2, rightEyeX + 12, eyeY);
    ctx.stroke();
  } else {
    // Left eye (background)
    ctx.fillStyle = colors.eyeWhite;
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, 12, 5, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw black border for the upper eyelid
    ctx.lineWidth = 2; // Border thickness (adjustable)
    ctx.strokeStyle = "black";
    ctx.lineCap = "round"; // Round ends for smoothness
    ctx.beginPath();
    // Parameters 6 and 7: Math.PI to 0 draws the upper half arc
    ctx.ellipse(leftEyeX, eyeY, 12, 5, -0.1, Math.PI, 0);
    ctx.stroke();

    // Left pupil
    ctx.fillStyle = colors.eye;
    ctx.beginPath();
    ctx.ellipse(leftEyeX + 2.5, eyeY, 4.5, 5, 0, 0, Math.PI * 2);

    ctx.fill();

    // Right eye (background)
    ctx.fillStyle = colors.eyeWhite;
    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, 12, 5, -0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // 2. Draw black border for the right upper eyelid
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, 12, 5, -0.1, Math.PI, 0);
    ctx.stroke();

    // Right pupil
    ctx.fillStyle = colors.eye;
    ctx.beginPath();

    ctx.ellipse(rightEyeX + 2.5, eyeY, 4.5, 5, 0, 0, Math.PI * 2);

    ctx.fill();
  }

  // ========== MOUTH ==========
  const mouthY = 190;
  const openAmount = mouthOpenness * 20;

  // --- POSITION & COLOR CONFIGURATION ---
  // ADJUST X POSITION HERE:
  const mouthX = centerX + 6; // Example: shift right: centerX + 2

  const mouthInsideColor = "#683636";
  const tongueColor = "#e68a8a";
  const teethColor = "#ffffff";

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (isSpeaking && mouthOpenness > 0.1) {
    // --- SPEAKING STATE (LIP SYNC) ---

    const openH = Math.min(Math.max(openAmount, 4), 12);
    const w = 25; // Mouth width

    const topY = mouthY - openH * 0.3;
    const bottomY = mouthY + openH * 0.7;

    // --- STEP 1: CREATE SHAPE (PATH 1) ---
    ctx.beginPath();
    // Use mouthX instead of centerX
    ctx.moveTo(mouthX - w / 2, mouthY);
    ctx.quadraticCurveTo(mouthX, topY, mouthX + w / 2, mouthY);
    ctx.quadraticCurveTo(mouthX, bottomY + openH / 2, mouthX - w / 2, mouthY);
    ctx.closePath();

    ctx.fillStyle = mouthInsideColor;
    ctx.fill();

    // --- STEP 2: DRAW INSIDE DETAILS (CLIP) ---
    ctx.save();
    ctx.clip();

    // Teeth
    ctx.fillStyle = teethColor;
    ctx.beginPath();
    ctx.ellipse(mouthX, topY + 1, w / 2, openH * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tongue
    if (openH > 5) {
      ctx.fillStyle = tongueColor;
      ctx.beginPath();
      ctx.ellipse(mouthX, bottomY + 2, w / 2.2, openH * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // --- STEP 3: REDRAW BLACK BORDER (PATH 2) ---
    ctx.beginPath();
    ctx.moveTo(mouthX - w / 2, mouthY);
    ctx.quadraticCurveTo(mouthX, topY, mouthX + w / 2, mouthY);
    ctx.quadraticCurveTo(mouthX, bottomY + openH / 2, mouthX - w / 2, mouthY);
    ctx.closePath();

    ctx.stroke();
  } else {
    // --- NON-SPEAKING STATE ---
    // Gentle smile
    ctx.beginPath();
    ctx.moveTo(mouthX - 14, mouthY);
    ctx.quadraticCurveTo(mouthX - 2, mouthY + 5, mouthX + 14, mouthY - 1.5);
    ctx.stroke();

    // Dimple
    ctx.beginPath();
    ctx.moveTo(mouthX + 14, mouthY - 1.5);
    ctx.lineTo(mouthX + 16, mouthY - 2.5);
    ctx.stroke();
  }
}