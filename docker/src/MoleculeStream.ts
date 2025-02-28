class MoleculeStream extends TransformStream {
  #buffer = '';

  constructor() {
    super({
      transform: (chunk, controller) => {
        this.#buffer += chunk;
        let begin = 0;
        let index = 0;
        while ((index = this.#buffer.indexOf('$$$$\r\n', index)) !== -1) {
          controller.enqueue(this.#buffer.slice(begin, index));
          index += 6;
          begin = index;
        }
        this.#buffer = this.#buffer.slice(begin);
      },
      flush: (controller) => {
        if (this.#buffer) {
          controller.enqueue(this.#buffer);
        }
      },
    });
  }
}
