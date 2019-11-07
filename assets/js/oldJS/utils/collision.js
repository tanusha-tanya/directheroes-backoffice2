export default class Collision {
  constructor(cardSettings, step, cardWidth, cardHeight, draggedCardHeight, draggedCardWidth) {
    this.cardSettings = cardSettings;
    this.step = step;
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    this.draggedCardHeight = draggedCardHeight;
    this.draggedCardWidth = draggedCardWidth;
  }

  check() {
    if (this.checkTopLeft() || this.checkTopRight() || this.checkBottomLeft() || this.checkBottomRight()) {
      return true;
    } else {
      return false;
    }
  }

  checkTopLeft() {
    if (
      this.cardSettings.x >= this.step.displaySettings.positionX &&
      this.cardSettings.x <= this.step.displaySettings.positionX + this.cardWidth &&
      this.cardSettings.y >= this.step.displaySettings.positionY &&
      this.cardSettings.y <= this.step.displaySettings.positionY + this.cardHeight
      ) {
        return true;
      }
  }

  checkTopRight() {
    if (
      this.cardSettings.x + this.draggedCardWidth >= this.step.displaySettings.positionX &&
      this.cardSettings.x + this.draggedCardWidth <= this.step.displaySettings.positionX + this.cardWidth &&
      this.cardSettings.y >= this.step.displaySettings.positionY &&
      this.cardSettings.y <= this.step.displaySettings.positionY + this.cardHeight
    ) {
      return true;
    }
  }

  checkBottomLeft() {
    if (
      this.cardSettings.x >= this.step.displaySettings.positionX &&
      this.cardSettings.x <= this.step.displaySettings.positionX + this.cardWidth &&
      this.cardSettings.y + this.draggedCardHeight >= this.step.displaySettings.positionY &&
      this.cardSettings.y + this.draggedCardHeight <= this.step.displaySettings.positionY + this.cardHeight
      ) {
        return true;
      }
  }

  checkBottomRight() {
    if (
      this.cardSettings.x + this.draggedCardWidth >= this.step.displaySettings.positionX &&
      this.cardSettings.x + this.draggedCardWidth <= this.step.displaySettings.positionX + this.cardWidth &&
      this.cardSettings.y + this.draggedCardHeight >= this.step.displaySettings.positionY &&
      this.cardSettings.y + this.draggedCardHeight <= this.step.displaySettings.positionY + this.cardHeight
    ) {
      return true;
    }
  }
}