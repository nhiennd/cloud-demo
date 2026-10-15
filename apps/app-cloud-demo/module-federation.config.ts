import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'app-cloud-demo',
  exposes: {
    './Routes': 'apps/app-cloud-demo/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
