import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'src/environment/environment';
import { AppModule } from './app/app.module';

export function getBaseUrl() {
  return environment.apiUrl;
}
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
