import { HostDashboardComponent } from './dashboard/dashboard.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'app-cloud-demo',
    loadChildren: () =>
      import('app-cloud-demo/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: '',
    component: HostDashboardComponent,
  },
];
