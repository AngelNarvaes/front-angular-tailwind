import { Component } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  template: `
    <div class="flex flex-col-reverse justify-end gap-3 border-t border-border pt-5 sm:flex-row">
      <ng-content />
    </div>
  `,
})
export class FormActions {}
