export class CustomMPCElement extends HTMLElement {
  constructor() {
    super();
    this.onInputStart = this.onInputStart.bind(this);
    this.onInputStop = this.onInputStop.bind(this);
  }

  connectedCallback() {
    window.addEventListener('keydown', this.onInputStart);
    window.addEventListener('keyup', this.onInputStop);
  }

  disconnectedCallback() {
    window.addEventListener('keydown', this.onInputStart);
    window.addEventListener('keyup', this.onInputStop);
  }

  onInputStart(event) {
    const node = [...this.children].find(child =>  child.key === event.key);
    if (node) node.onInputStart();
  }

  onInputStop(event) {
    const node = [...this.children].find(child =>  child.key === event.key);
    if (node) node.onInputStop();
  }
}
