(function(){
  var Loremforms;

  Loremforms = (function() {

    function Loremforms() {}

    Loremforms.prototype.WORDS = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
      'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
      'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
      'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
      'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 
      'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
      'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
      'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
      'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
      'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
      'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
      'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
      'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis', 
      'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
      'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
      'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
      'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
      'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
      'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
      'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
      'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
      'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
      'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
      'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
      'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
      'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
      'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
      'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
      'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
      'elementum', 'tempor', 'risus', 'cras'
    ];

    Loremforms.prototype.run = function() {
      var _this = this;

      chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {

          var active_el = document.activeElement;

          // check if this is form
          if (active_el.tagName === 'FORM') {

            _this.form = active_el;
            
            _this.findInputs(_this.form);
          } else if (active_el.tagName === 'BODY') {
            var forms = document.querySelectorAll('form');

            if (forms.length === 1) {
              _this.form = forms[0];

              _this.findInputs(_this.form);
            } else {
              _this.showAlert('Form tag not found. Try clicking on input then click this icon.');
            }
          } else {
            // try to find parent form element
            var stop = false;
            var current = active_el;

            while(!stop) {
              current = current.parentNode;

              if (current.tagName === 'FORM') {
                stop = true;

                _this.form = current;
                _this.findInputs(_this.form);

              } else if (current.tagName === 'BODY') {
                stop = true;
                this.showAlert('Form tag not found. Try clicking on input then click this icon.');
              }
            }
          }

          _this.removeMarkers(); // clear markers
          sendResponse({}); // clean request
        }
      );
    };

    Loremforms.prototype.showAlert = function(msg) {
      return alert(msg);
    };

    Loremforms.prototype.findInputs = function(parent, params) {
      var nodes = parent.childNodes,
        _i,
        _l;

      for(_i = 0, _l = nodes.length; _i < _l; _i++) {
        var curr = nodes[_i];

        if (curr instanceof HTMLElement === false)
          continue;


        if (typeof curr.getAttribute === 'function' && curr.getAttribute('data-loremforms') === true)
          continue;

        switch (curr.tagName) {
          case "INPUT":
            this.fillInput(curr);
            
            break;
          case "TEXTAREA":
            this.fillTextarea(curr);
            break;
          case "SELECT":
            // sry for dump name 
            this.fillSelect(curr); 
            break;
          default:
            if (curr.childNodes.length > 0)
              this.findInputs(curr);
        }
      }
    };

    Loremforms.prototype.fillInput = function(el) {
      switch (el.type.toUpperCase()) {
        case "TEXT":
          el.value = this.generateText(2, 4);

          this.mark(el);

          break;
        case "NUMBER":
          el.value = this.generateNumber();

          this.mark(el);

          break;
        case "RADIO":
          var buttons = this.form.querySelectorAll('input[type=radio][name=' + el.name + ']'),
            _l = buttons.length,
            _i;

          if(_l > 1) {
            var rand = this.generateNumber(_l) - 1;

            for(_i = 0; _i < _l; _i++) {
              buttons[_i].checked = false;

              this.mark(buttons[_i]);
            }

            buttons[rand].checked = 'checked';
          } else {
            this.mark(buttons[0]);

            if (this.generateNumber(10) % 2 === 0) {
              buttons[0].checked = false;
            } else {
              buttons[0].checked = 'checked';
            }
          }
          
          break;
        case "CHECKBOX":
          if (this.generateNumber(10) % 2 === 0) {
            el.checked = true;
          } else {
            el.checked = false;
          }

          this.mark(el);
          
          break;
        case "EMAIL":
          el.value = this.generateText(1).toLowerCase() + '@example.com';

          this.mark(el);

          break;
        case "URL":
          el.value = 'http://' + this.generateText(1).toLowerCase() + '.example.com';

          this.mark(el);

          break;
        default:
          break;
      }
    };

    Loremforms.prototype.fillTextarea = function(el) {
      el.innerText = this.generateText(10, 50);
    };

    Loremforms.prototype.fillSelect = function(el) {
      el.selectedIndex = this.randomNumber(0, el.length - 1);
    };

    Loremforms.prototype.mark = function(el){
      el.setAttribute('data-loremforms', true);
    };

    Loremforms.prototype.removeMarkers = function() {
      if (typeof this.form !== 'object')
        return;

      var marked = this.form.querySelectorAll('[data-loremforms=true]'),
        _l,
        _i;

      for(_i = 0, _l = marked.length; _i < _l; _i++) {
        marked[_i].removeAttribute('data-loremforms');
      }
    };

    Loremforms.prototype.generateText = function(min, max) {
      min || (min = 10);

      var len = this.WORDS.length,
        words = min,
        sentence = [],
        dot = true;

      if (typeof max === 'number' && max > min) {
        words = this.randomNumber(min, max);
      }

      for(_i = 0; _i < words; _i++) {
        var index = this.randomNumber(1, len) - 1,
          word;

        if (dot) {
          word = this.WORDS[index].charAt(0).toUpperCase() + this.WORDS[index].slice(1);
          dot = false;
        } else {
          word = this.WORDS[index];
        }

        if (this.generateNumber(10) % 4 === 0) {
          word = word + '. ';
          dot = true;
        }
        
        sentence.push(word)
      }

      return sentence.join(' ');
    };

    Loremforms.prototype.generateNumber = function(max) {
      max || (max = 1000);

      return this.randomNumber(1, max);
    };

    Loremforms.prototype.randomNumber = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return Loremforms;
  })();


  var lorem = new Loremforms();
  lorem.run();
})();
