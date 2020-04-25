class SmileRating extends HTMLElement {
  // Declare the class properties at the top of the class
  _value = null;

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = parseInt(v);

    if (this._value < -2 || this._value > 2) {
      console.warn('Value should be between -2 and 2')
    }

    if (this._value < -2) this._value = -2;
    if (this._value > 2) this._value =2

    this._updateClasses()

    // Notify that we have changed
    this.dispatchEvent(new CustomEvent('change'))
  }

  // _ denotes private, (not to be accessed outside this class)
  _shadow = null;

  get _buttons() {
    return Array.from(this._shadow.querySelectorAll('li'))
  }

  // This happens as soon as the element is put on the page
  connectedCallback() {
    // Attach the shadow dom to encapsulate the element (styles will not leak from custom element)
    this._shadow = this.attachShadow({
      mode: 'closed' // Sets whether or not you can access inside the shadow dom with JS
    })
    this._shadow.innerHTML = `
      <style>
        :host {
          user-select: none;
        }
        li {
          display: inline-block;
          opacity: 0.4;
          cursor: pointer;
          font-size: 50px;
          transition: 0.2s;
        }
        li:hover {
          opacity: 0.75;
        }
        li.active {
          opacity: 1;
        }
        li.active, li:hover {
          transform: scale(1.1);
        }
      </style>
      <ul>
        <li data-value="-2">😤</li>
        <li data-value="-1">🙁</li>
        <li data-value="0">😐</li>
        <li data-value="1">😊</li>
        <li data-value="2" class="active">😀</li>
      </ul>
    `;

    // Add event listeners to emoji buttons
    this._buttons.forEach(li => {
      li.addEventListener('click', () => {
        this.value = parseInt(li.dataset.value);
        
        this._updateClasses()
      })
    })
  }

  _updateClasses() {
    this._buttons.forEach((li) => {
      const v = parseInt(li.getAttribute('data-value'));
    
      if (this.value === v) li.classList.add('active');
      else li.classList.remove('active')
    })
  }
}

window.customElements.define('smile-rating', SmileRating)