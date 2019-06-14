import Vue from 'vue';

const moveHandler = function (event){
  const el = this;
  const { clientX, clientY } = event.touches ? event.touches[0] : event;
  const { lastMoveX, lastMoveY, moveCallback } = el.$moveData;

  moveCallback({stepX: clientX - lastMoveX, stepY: clientY - lastMoveY, event});

  el.$moveData.lastMoveX = clientX;
  el.$moveData.lastMoveY = clientY;
}

const endMoveHandler = function (event){
  const el = this;
  const { endMoveHandler, moveHandler } = el.$moveData;

  el.removeEventListener('mousemove', moveHandler);
  el.removeEventListener('touchmove', moveHandler);

  document.removeEventListener('mouseup', endMoveHandler);
  document.removeEventListener('touchend', endMoveHandler);
  document.removeEventListener('touchcancel', endMoveHandler);
}


Vue.directive('move', {
  bind(el, bindings) {
    const startMove = (event) => {
      const { $moveData } = el;
      const { clientX, clientY } = event.touches ? event.touches[0] : event;

      if (el !== event.target) return;

      $moveData.startX = clientX;
      $moveData.startY = clientY;

      el.$moveData.lastMoveX = clientX;
      el.$moveData.lastMoveY = clientY;

      el.addEventListener('mousemove', $moveData.moveHandler);
      el.addEventListener('touchmove', $moveData.moveHandler);

      document.addEventListener('mouseup', $moveData.endMoveHandler);
      document.addEventListener('touchend', $moveData.endMoveHandler);
      document.addEventListener('touchcancel', $moveData.endMoveHandler);
    }

    el.$moveData = el.$moveData || {
      startX: null,
      startY: null,
      hasAddEvents: false,
      moveHandler: moveHandler.bind(el),
      endMoveHandler: endMoveHandler.bind(el),
      moveCallback: bindings.value || function() {},
    }

    if (el.$moveData.hasAddEvents) return;

    el.addEventListener('mousedown', startMove);
    el.addEventListener('touchstart', startMove)

    el.$moveData.hasAddEvents = true;
  }
})
