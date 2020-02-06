import $ from 'jquery';
import "./menu";

$(document).ready(() => {

  let card = $(`.feature__box`);

  function map(x, inMin, inMax, outMin, outMax) {
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  card.on(`mousemove`, function (e) {

    let x = (e.clientX - $(this).offset().left - 7.5 + $(window).scrollLeft());
    let y = (e.clientY - $(this).offset().top + 15 + $(window).scrollTop());

    let box = `radial-gradient(at ` + (x / 2) + `% ` + (y / 2) + `%, rgba(255, 255, 255, 0.20) 0%, transparent 75%, transparent 100%)`;

    $(this).css({
      'background': box,
    });
  });

  card.on(`mouseleave`, function (e) {
    let transition = `background 0.5s ease`;

    $(this).css({
      'background': `transparent`,
      'transition': `transition`,
    });
  });
})(jQuery);

