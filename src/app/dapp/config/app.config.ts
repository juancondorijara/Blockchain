import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

//import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
