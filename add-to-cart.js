/* eslint no-underscore-dangle: 0 */
const { default: BaseComponent } = await import('./base-component.js');

export default class AddToCartComponent extends BaseComponent {
  constructor(selector, showLoader = true, showErrorState = true) {
    super(selector, showLoader, showErrorState);
    this.counter = 0;
    this.init = false;
  }

  set counter(number) {
    if (number <= 0) {
      this._counter = 0;
    } else if (number > 0) {
      this._counter = number;
    } else {
      throw new TypeError('ошибка при добавлении в корзину, ожидается целое положительное число');
    }

    if (this.init) {
      this.badge.textContent = this.counter;
      this.render();
    }
  }

  get counter() {
    return this._counter;
  }

  getElement() {
    const root = document.createElement('div');
    root.classList.add('card-btns');
    if (this.counter === 0) {
      const addBtn = document.createElement('button');
      addBtn.classList.add(
        'btn',
        'btn-primary',
      );
      addBtn.textContent = 'Добавить к корзину';
      addBtn.addEventListener('click', () => {
        this.count(++this.counter);
      });
      root.append(addBtn);
    } else {
      const plusBtn = document.createElement('button');
      const minusBtn = document.createElement('button');
      const currentValue = document.createElement('span');

      plusBtn.classList.add(
        'btn',
        'btn-primary',
        'me-2',
      );
      minusBtn.classList.add(
        'btn',
        'btn-primary',
      );
      currentValue.classList.add(
        'me-2',
      );

      plusBtn.textContent = '+';
      minusBtn.textContent = '-';
      currentValue.textContent = this.counter;

      plusBtn.addEventListener('click', () => {
        this.count(++this.counter);
        currentValue.textContent = this.counter;
      });

      minusBtn.addEventListener('click', () => {
        this.count(--this.counter);
        currentValue.textContent = this.counter;
      });

      root.append(plusBtn);
      root.append(currentValue);
      root.append(minusBtn);
    }
    this.rootElement = root;
    return root;
  }

  count(num) {
    this.counter = num;
  }

  async fetch() {
    await super.fetch();
    this.count(Number(this.badge.textContent.trim()));
  }

  async render() {
    if (!this.init) {
      const elemToRemove = document.querySelector('.card-btns');
      if (elemToRemove) elemToRemove.remove();
      this.badge = document.querySelector('.badge');
      await super.render();
      this.init = true;
    } else {
      this.rootElement.remove();
      this.selector.append(this.getElement());
    }
  }
}
