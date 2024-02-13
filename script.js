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
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });

    paper.addEventListener('mousedown', this.handleMouseDown);
    paper.addEventListener('touchstart', this.handleTouchStart);

    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  handleMouseMove = (e) => {
    this.updatePosition(e.clientX, e.clientY);
  }

  handleMouseDown = (e) => {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    this.setZIndex(e.target);
    this.updateTouchPosition(e.clientX, e.clientY);
    this.updatePrevPosition(e.clientX, e.clientY);
  }

  handleMouseUp = () => {
    this.holdingPaper = false;
    this.rotating = false;
  }

  handleTouchStart = (e) => {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    this.setZIndex(e.target);
    const touch = e.touches[0];
    this.updateTouchPosition(touch.clientX, touch.clientY);
    this.updatePrevPosition(touch.clientX, touch.clientY);
  }

  handleTouchMove = (e) => {
    if (e.touches.length > 1) return;
    const touch = e.touches[0];
    this.updatePosition(touch.clientX, touch.clientY);
  }

  handleTouchEnd = () => {
    this.holdingPaper = false;
    this.rotating = false;
  }

  updatePosition = (x, y) => {
    this.mouseX = x;
    this.mouseY = y;
    this.velX = this.mouseX - this.prevX;
    this.velY = this.mouseY - this.prevY;

    if (this.holdingPaper) {
      this.currentX += this.velX;
      this.currentY += this.velY;
      this.prevX = this.mouseX;
      this.prevY = this.mouseY;
      this.updatePaperTransform();
    }
  }

  updateTouchPosition = (x, y) => {
    this.touchX = x;
    this.touchY = y;
    this.prevX = this.touchX;
    this.prevY = this.touchY;
  }

  updatePrevPosition = (x, y) => {
    this.prevX = x;
    this.prevY = y;
  }

  setZIndex = (paper) => {
    paper.style.zIndex = highestZ;
    highestZ += 1;
  }

  updatePaperTransform = () => {
    const paper = document.querySelector('.paper');
    paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
