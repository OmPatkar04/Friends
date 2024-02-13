let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentX = 0;
  currentY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (e) => {
      if (!this.rotating) {
        if (e.type === 'touchmove') {
          const touch = e.touches[0];
          this.mouseX = touch.clientX;
          this.mouseY = touch.clientY;
        } else {
          this.mouseX = e.pageX;
          this.mouseY = e.pageY;
        }
        this.velX = this.mouseX - this.prevX;
        this.velY = this.mouseY - this.prevY;
      }
      const dirX = this.mouseX - this.touchX;
      const dirY = this.mouseY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentX += this.velX;
          this.currentY += this.velY;
        }
        this.prevX = this.mouseX;
        this.prevY = this.mouseY;
        paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const downHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      if (e.type === 'touchstart') {
        const touch = e.touches[0];
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
        this.prevX = touch.clientX;
        this.prevY = touch.clientY;
      } else {
        this.touchX = e.pageX;
        this.touchY = e.pageY;
        this.prevX = e.pageX;
        this.prevY = e.pageY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    };

    const upHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });

    paper.addEventListener('mousedown', downHandler);
    paper.addEventListener('touchstart', downHandler);

    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchend', upHandler);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
