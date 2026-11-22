import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-field',
  template: `
    <label class="flex min-w-[260px] flex-1 items-center gap-[0.6rem] rounded-[10px] border border-border bg-surface-2 px-[0.8rem] py-[0.55rem] text-text-muted focus-within:border-primary focus-within:bg-surface focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input
        type="search"
        class="w-full border-0 bg-transparent text-text outline-none placeholder:text-slate-400"
        [placeholder]="placeholder()"
        [value]="value()"
        [attr.aria-label]="ariaLabel()"
        (input)="onInput($event)"
      />
    </label>
  `,
})
export class SearchField {
  readonly value = input('');
  readonly placeholder = input('Buscar…');
  readonly ariaLabel = input('Buscar');
  readonly valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.valueChange.emit(target?.value ?? '');
  }
}
