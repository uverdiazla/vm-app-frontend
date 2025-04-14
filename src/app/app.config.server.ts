import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';

const serverConfig = mergeApplicationConfig(appConfig, {
  providers: [
    provideServerRendering()
  ]
});

export const config = serverConfig;
