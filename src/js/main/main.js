$(document).ready(function () {
  $('.carousel__inner').slick({
    speed: 1200,
    adaptiveHeight: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 2000,
    prevArrow: '<button type="button" class="slick-prev"><img src="img/icons/left.png"></button>',
    nextArrow: '<button type="button" class="slick-next"><img src="img/icons/right.png"></button>',
    responsive: [
      {
        breakpoint: 575,
        settings: {
          arrows: false,
        },
      },
    ],
  });
});

!(function (e) {
  'function' != typeof e.matches &&
    (e.matches =
      e.msMatchesSelector ||
      e.mozMatchesSelector ||
      e.webkitMatchesSelector ||
      function (e) {
        for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t; ) ++n;
        return Boolean(o[n]);
      }),
    'function' != typeof e.closest &&
      (e.closest = function (e) {
        for (var t = this; t && 1 === t.nodeType; ) {
          if (t.matches(e)) return t;
          t = t.parentNode;
        }
        return null;
      });
})(window.Element.prototype);
// скрипт гамбургера
window.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu__list'),
    menuItem = document.querySelectorAll('.menu_item'),
    hamburger = document.querySelector('.hamburger');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger_active');
    menu.classList.toggle('menu__list_active');
  });

  menuItem.forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.toggle('hamburger_active');
      menu.classList.toggle('menu__list_active');
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  /* Записываем в переменные массив элементов-кнопок и подложку.
      Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
  var modalButtons = document.querySelectorAll('.js-open-modal'),
    overlay = document.querySelector('.js-overlay-modal'),
    closeButtons = document.querySelectorAll('.js-modal-close');

  /* Перебираем массив кнопок */
  modalButtons.forEach(function (item) {
    /* Назначаем каждой кнопке обработчик клика */
    item.addEventListener('click', function (e) {
      /* Предотвращаем стандартное действие элемента. Так как кнопку разные
            люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
            Нужно подстраховаться. */
      e.preventDefault();

      /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
            и будем искать модальное окно с таким же атрибутом. */
      var modalId = this.getAttribute('data-modal'),
        modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');

      /* После того как нашли нужное модальное окно, добавим классы
            подложке и окну чтобы показать их. */
      modalElem.classList.add('active');
      overlay.classList.add('active');
    }); // end click
  }); // end foreach

  closeButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var parentModal = this.closest('.modal');

      parentModal.classList.remove('active');
      overlay.classList.remove('active');
    });
  }); // end foreach

  document.body.addEventListener(
    'keyup',
    function (e) {
      var key = e.keyCode;

      if (key == 27) {
        document.querySelector('.modal.active').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
      }
    },
    false,
  );

  overlay.addEventListener('click', function () {
    document.querySelector('.modal.active').classList.remove('active');
    this.classList.remove('active');
  });
}); // end ready
// -------------------------------------------------- test slider
var multiItemSlider = (function () {
  function _isElementVisible(element) {
    var rect = element.getBoundingClientRect(),
      vWidth = window.innerWidth || doc.documentElement.clientWidth,
      vHeight = window.innerHeight || doc.documentElement.clientHeight,
      elemFromPoint = function (x, y) {
        return document.elementFromPoint(x, y);
      };
    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;
    return (
      element.contains(elemFromPoint(rect.left, rect.top)) ||
      element.contains(elemFromPoint(rect.right, rect.top)) ||
      element.contains(elemFromPoint(rect.right, rect.bottom)) ||
      element.contains(elemFromPoint(rect.left, rect.bottom))
    );
  }

  return function (selector, config) {
    var _mainElement = document.querySelector(selector), // основный элемент блока
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
      _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
      _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
      _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
      _positionLeftItem = 0, // позиция левого активного элемента
      _transform = 0, // значение транфсофрмации .slider_wrapper
      _step = (_itemWidth / _wrapperWidth) * 100, // величина шага (для трансформации)
      _items = [], // массив элементов
      _interval = 0,
      _html = _mainElement.innerHTML,
      _states = [
        { active: false, minWidth: 0, count: 1 },
        { active: false, minWidth: 980, count: 2 },
      ],
      _config = {
        isCycling: true, // автоматическая смена слайдов
        direction: 'right', // направление смены слайдов
        interval: 5000, // интервал между автоматической сменой слайдов
        pause: true, // устанавливать ли паузу при поднесении курсора к слайдеру
      };

    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
      _items.push({ item: item, position: index, transform: 0 });
    });

    var _setActive = function () {
      var _index = 0;
      var width = parseFloat(document.body.clientWidth);
      _states.forEach(function (item, index, arr) {
        _states[index].active = false;
        if (width >= _states[index].minWidth) _index = index;
      });
      _states[_index].active = true;
    };

    var _getActive = function () {
      var _index;
      _states.forEach(function (item, index, arr) {
        if (_states[index].active) {
          _index = index;
        }
      });
      return _index;
    };

    var position = {
      getItemMin: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getItemMax: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin: function () {
        return _items[position.getItemMin()].position;
      },
      getMax: function () {
        return _items[position.getItemMax()].position;
      },
    };

    var _transformItem = function (direction) {
      var nextItem;
      if (!_isElementVisible(_mainElement)) {
        return;
      }
      if (direction === 'right') {
        _positionLeftItem++;
        if (_positionLeftItem + _wrapperWidth / _itemWidth - 1 > position.getMax()) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform -= _step;
      }
      if (direction === 'left') {
        _positionLeftItem--;
        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform += _step;
      }
      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    };

    var _cycle = function (direction) {
      if (!_config.isCycling) {
        return;
      }
      _interval = setInterval(function () {
        _transformItem(direction);
      }, _config.interval);
    };

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
      if (e.target.classList.contains('slider__control')) {
        e.preventDefault();
        var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
        _transformItem(direction);
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    // обработка события изменения видимости страницы
    var _handleVisibilityChange = function () {
      if (document.visibilityState === 'hidden') {
        clearInterval(_interval);
      } else {
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    var _refresh = function () {
      clearInterval(_interval);
      _mainElement.innerHTML = _html;
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper');
      _sliderItems = _mainElement.querySelectorAll('.slider__item');
      _sliderControls = _mainElement.querySelectorAll('.slider__control');
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left');
      _sliderControlRight = _mainElement.querySelector('.slider__control_right');
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
      _positionLeftItem = 0;
      _transform = 0;
      _step = (_itemWidth / _wrapperWidth) * 100;
      _items = [];
      _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
      });
    };

    var _setUpListeners = function () {
      _mainElement.addEventListener('click', _controlClick);
      if (_config.pause && _config.isCycling) {
        _mainElement.addEventListener('mouseenter', function () {
          clearInterval(_interval);
        });
        _mainElement.addEventListener('mouseleave', function () {
          clearInterval(_interval);
          _cycle(_config.direction);
        });
      }
      document.addEventListener('visibilitychange', _handleVisibilityChange, false);
      window.addEventListener('resize', function () {
        var _index = 0,
          width = parseFloat(document.body.clientWidth);
        _states.forEach(function (item, index, arr) {
          if (width >= _states[index].minWidth) _index = index;
        });
        if (_index !== _getActive()) {
          _setActive();
          _refresh();
        }
      });
    };

    // инициализация
    _setUpListeners();
    if (document.visibilityState === 'visible') {
      _cycle(_config.direction);
    }
    _setActive();

    return {
      right: function () {
        // метод right
        _transformItem('right');
      },
      left: function () {
        // метод left
        _transformItem('left');
      },
      stop: function () {
        // метод stop
        _config.isCycling = false;
        clearInterval(_interval);
      },
      cycle: function () {
        // метод cycle
        _config.isCycling = true;
        clearInterval(_interval);
        _cycle();
      },
    };
  };
})();

var slider = multiItemSlider('.slider', {
  isCycling: true,
});

//------------- mailer

// $(document).ready(function () {
//   $('.form-element').submit(function () {
//     var formID = $(this).attr('id');
//     var formNm = $('#' + formID);
//     var message = $(formNm).find('.form-message');
//     var formTitle = $(formNm).find('.form-title');
//     $.ajax({
//       type: 'POST',
//       url: '../php/send-message-to-telegram.php',
//       data: formNm.serialize(),
//       success: function (data) {
//         // Вывод сообщения об успешной отправке
//         message.html(data);
//         formTitle.css('display', 'none');
//         setTimeout(function () {
//           formTitle.css('display', 'block');
//           message.html('');
//           $('input').not(':input[type=submit], :input[type=hidden]').val('');
//         }, 3000);
//       },
//       error: function (jqXHR, text, error) {
//         // Вывод сообщения об ошибке отправки
//         message.html(error);
//         formTitle.css('display', 'none');
//         setTimeout(function () {
//           formTitle.css('display', 'block');
//           message.html('');
//           $('input').not(':input[type=submit], :input[type=hidden]').val('');
//         }, 3000);
//       },
//     });
//     return false;
//   });
// });
// ---------------- МОЙ КОД
$(document).ready(function () {
  $('.modal__form').submit(function () {
    var formID = $(this).attr('id');
    var formNm = $('#' + formID);
    var message = $(formNm).find('.form-message');
    var formTitle = $(formNm).find('.form-title');
    $.ajax({
      type: 'POST',
      url: '../php/send-message-to-telegram.php',
      data: formNm.serialize(),
      success: function (data) {
        // Вывод сообщения об успешной отправке
        message.html(data);
        formTitle.css('display', 'none');
        setTimeout(function () {
          formTitle.css('display', 'block');
          message.html('');
          $('input').not(':input[type=submit], :input[type=hidden]').val('');
        }, 3000);
      },
      error: function (jqXHR, text, error) {
        // Вывод сообщения об ошибке отправки
        message.html(error);
        formTitle.css('display', 'none');
        setTimeout(function () {
          formTitle.css('display', 'block');
          message.html('');
          $('input').not(':input[type=submit], :input[type=hidden]').val('');
        }, 3000);
      },
    });
    return false;
  });
});
var linkNav = document.querySelectorAll('[href^="#"]'), //выбираем все ссылки к якорю на странице
  V = 0.9; // скорость, может иметь дробное значение через точку (чем меньше значение - тем больше скорость)
for (var i = 0; i < linkNav.length; i++) {
  linkNav[i].addEventListener(
    'click',
    function (e) {
      //по клику на ссылку
      e.preventDefault(); //отменяем стандартное поведение
      var w = window.pageYOffset, // производим прокрутка прокрутка
        hash = this.href.replace(/[^#]*(.*)/, '$1'); // к id элемента, к которому нужно перейти
      (t = document.querySelector(hash).getBoundingClientRect().top), // отступ от окна браузера до id
        (start = null);
      requestAnimationFrame(step); // подробнее про функцию анимации [developer.mozilla.org]
      function step(time) {
        if (start === null) start = time;
        var progress = time - start,
          r = t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t);
        window.scrollTo(0, r);
        if (r != w + t) {
          requestAnimationFrame(step);
        } else {
          location.hash = hash; // URL с хэшем
        }
      }
    },
    false,
  );
}
$('.parent').click(function () {
  $(this).children('.child').slideToggle(300);
});

$('.single-item').slick();

// модальные: https://medium.com/@dan.postnov/%D0%BC%D0%BE%D0%B4%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D0%BE%D0%BA%D0%BD%D0%B0-%D0%BD%D0%B0-javascript-30-%D1%81%D1%82%D1%80%D0%BE%D0%BA-%D0%BA%D0%BE%D0%B4%D0%B0-dbbb599649f3
// слайдер https://itchief.ru/examples/lab.php?topic=javascript&file=chiefslider-with-refresh
// мейлер https://smartlanding.biz/otpravka-dannyx-formy-v-telegram.html
