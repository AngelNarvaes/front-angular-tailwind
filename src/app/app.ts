import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NotificacionComponent } from './shared/notificacion/notificacion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificacionComponent],
  templateUrl: './app.html',
})
export class App {}


