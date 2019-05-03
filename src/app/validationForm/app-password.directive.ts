import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appPassword]'
})
export class AppPasswordDirective {
  private _shown = false;

  constructor(private el: ElementRef) {
    this.setup();
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');

      span.setAttribute('class', 'fas fa-eye-slash absolute_pass');
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.setAttribute('class', 'fas fa-eye absolute_pass');
    }
  }



  setup() {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('i');
    span.setAttribute('class', 'fas fa-eye absolute_pass');
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }


}
