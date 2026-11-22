import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  host: { '[class]': 'containerClass()' },
  template: `
    @if (label()) {
      <label [attr.for]="forId() || null" class="text-[0.85rem] font-semibold text-text">
        {{ label() }} @if (required()) { <span class="text-danger">*</span> }
      </label>
    } @else if (labelText()) {
      <span class="text-[0.85rem] font-semibold text-text">{{ labelText() }}</span>
    }
    <ng-content />
    @if (error()) {
      <p class="m-0 text-[0.78rem] font-medium text-danger">{{ error() }}</p>
    }
    @if (hint()) {
      <p class="m-0 text-[0.78rem] leading-[1.45] text-text-muted">{{ hint() }}</p>
    }
  `,
})
export class FormField {
  readonly label = input('');
  readonly labelText = input('');
  readonly forId = input('');
  readonly required = input(false);
  readonly error = input('');
  readonly hint = input('');
  readonly containerClass = input('flex min-w-0 flex-col gap-[0.42rem]');
}
