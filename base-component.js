/* eslint no-underscore-dangle: 0 */

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

class ComponentError extends Error {
  constructor() {
    super('элемент на странице не найден');
  }
}

export default class BaseComponent {
  constructor(selector, showLoader = true, showErrorState = true) {
    this.selector = document.querySelector(selector);
    this.showLoader = showLoader;
    this.showErrorState = showErrorState;

    if (!this.selector) {
      throw new ComponentError();
    }
  }

  set isLoading(param) {
    this._isLoading = param;
    if (this.isLoading) {
      this.spinner.style.display = '';
    } else {
      this.spinner.style.display = 'none';
    }
  }

  get isLoading() {
    const newLocal = this._isLoading;
    return newLocal;
  }

  getElement() {
    if (this.rootElement) return this.rootElement;
    const root = document.createElement('button');
    root.classList.add(
      'd-flex',
      'align-items-center',
      'btn',
      'btn-primary',
      'mb-3',
    );
    root.textContent = 'Base Component';

    this.rootElement = root;
    return root;
  }

  createSpinner() {
    const spinnerElement = document.createElement('span');
    spinnerElement.classList.add(
      'spinner-border',
      'spinner-border-sm',
      'text-primary',
      'ml-2',
    );
    spinnerElement.style.display = 'none';
    this.spinner = spinnerElement;
    return spinnerElement;
  }

  createErrorElement() {
    const errorElement = document.createElement('div');
    const errorMessage = document.createElement('span');
    const repeatBtn = document.createElement('button');

    errorMessage.classList.add(
      'me-2',
    );
    repeatBtn.classList.add(
      'btn',
      'btn-secondary',
    );
    errorMessage.textContent = 'Произошла ошибка';
    repeatBtn.textContent = 'Повторить загрузку';

    repeatBtn.addEventListener('click', () => {
      this.errorElement.remove();
      this.fetch();
    });

    errorElement.append(errorMessage);
    errorElement.append(repeatBtn);
    this.errorElement = errorElement;

    return errorElement;
  }

  async fetch() {
    try {
      if (this.showLoader) this.isLoading = true;
      const data = await wait(3000);
      this.isError = false;
      this.isOk = true;
      this.data = data;
    } catch (err) {
      this.isError = true;
      this.isOk = false;
      if (this.showErrorState) this.selector.append(this.createErrorElement());
      throw err;
    } finally {
      if (this.showLoader) this.isLoading = false;
    }
    return {};
  }

  async render() {
    if (this.showLoader) this.selector.append(this.createSpinner());
    await this.fetch();
    if (this.isOk) this.selector.append(this.getElement());
  }
}
