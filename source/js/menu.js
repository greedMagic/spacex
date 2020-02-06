`use strict`;

(function () {
  const RETURN = 13;
  const ESC = 27;
  const SPACE = 32;
  let menuButton = document.querySelector(`.header__menu-button`);
  let mainMenu = document.querySelector(`.header__menu`);

  if (menuButton && mainMenu) {

    let menuState = false;

    let toggleMenu = function () {
      if (!menuState) {
        menuState = true;
        menuButton.classList.add(`header__menu-button--close`);
        mainMenu.classList.remove(`header__menu--closed`);
      } else {
        menuState = false;
        menuButton.classList.remove(`header__menu-button--close`);
        mainMenu.classList.add(`header__menu--closed`);
      }
    };

    menuButton.addEventListener(`click`, function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleMenu();
    });

    menuButton.addEventListener(`keydown`, function (event) {
      if (event.keyCode === RETURN || event.keyCode === SPACE) {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleMenu();
      }
    });

    document.addEventListener(`keydown`, function (event) {
      if (event.keyCode === ESC && menuButton.classList.contains(`header__menu-button--close`)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleMenu();
      }
    });
  }
}());
