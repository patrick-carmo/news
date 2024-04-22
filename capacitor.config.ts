import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'news',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '123060927074-5mks66l4aq435n1cv3g3mmnjfrass3u7.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
};

export default config;
