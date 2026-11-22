import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  template: `
    <div class="mb-[0.9rem] flex flex-wrap items-center gap-4 rounded-[14px] border border-border bg-surface p-4 shadow-card-sm">
      <ng-content />
    </div>
  `,
})
export class Toolbar {}

