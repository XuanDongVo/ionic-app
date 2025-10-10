import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, documents, searchOutline, settingsOutline, addCircle } from 'ionicons/icons';
import { Route, Redirect, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import React from 'react';

setupIonicReact();

const App: React.FC = () => {
  const location = useLocation();

  // Ẩn tabbar khi ở các trang xác thực
  const hideTabBar = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-email',
    '/reset-password',
  ].includes(location.pathname);

  return (
    <IonApp>
      <IonTabs>
        <IonRouterOutlet>
          {/* Auth Pages */}
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/forgot-password" component={ForgotPassword} exact />
          <Route path="/verify-email" component={VerifyEmail} exact />
          <Route path="/reset-password" component={ResetPassword} exact />

          {/* App Pages */}
          <Route path="/home" component={Home} exact />
          <Route path="/search" component={Search} exact />

          {/* Redirect */}
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>

        {/* Hiện TabBar nếu KHÔNG phải các trang auth */}
        {!hideTabBar && (
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="finished" href="/finished">
              <IonIcon icon={documents} />
              <IonLabel>Finished</IonLabel>
            </IonTabButton>

            <IonTabButton tab="add" onClick={() => alert('Add new note')}>
              <IonIcon icon={addCircle} style={{ fontSize: '48px', marginTop: '-16px' }} />
            </IonTabButton>

            <IonTabButton tab="search" href="/search">
              <IonIcon icon={searchOutline} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>

            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        )}
      </IonTabs>
    </IonApp>
  );
};

// Bọc trong IonReactRouter để useLocation hoạt động
const WrappedApp: React.FC = () => (
  <IonReactRouter>
    <App />
  </IonReactRouter>
);

export default WrappedApp;