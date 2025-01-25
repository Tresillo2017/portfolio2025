import { Component } from '@angular/core';
@Component({ selector: 'app-matrix-server', template: '', standalone: true })
export class MatrixServerComponent {
  constructor() {
    const config = { 'm.server': 'matrix.tomasps.com:443' };
    document.body.textContent = JSON.stringify(config);
  }
}
