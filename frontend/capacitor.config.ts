import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'dist',
  server: {
    androidScheme: 'http', 
    hostname: '10.0.2.2',  
    allowNavigation: ['10.0.2.2', 'localhost'],
  },
};

export default config;
