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
import { Route, Redirect, useLocation, useHistory } from 'react-router-dom';

import Home from './pages/Home';
import Search from './pages/Search';
import ProfileEdit from './pages/ProfileEdit';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import NoteList from './pages/NoteList';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import DevTools from './pages/DevTools';
import React from 'react';

setupIonicReact();

const App: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

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
          <Route path="/profile/edit" component={ProfileEdit} exact />
          <Route path="/profile/change-password" component={ChangePassword} exact />
          <Route path="/settings" component={Settings} exact />
          <Route path="/dev-tools" component={DevTools} exact />

          {/* Note Pages */}
          <Route path="/notes" component={NoteList} exact />
          <Route path="/notes/create" component={CreateNote} exact />
          <Route path="/notes/edit/:id" component={EditNote} exact />

          {/* Redirect */}
          <Redirect exact from="/" to="/login" />
        </IonRouterOutlet>

        {/* Hiện TabBar nếu KHÔNG phải các trang auth */}
        {!hideTabBar && (
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="notes" href="/notes">
              <IonIcon icon={documents} />
              <IonLabel>Notes</IonLabel>
            </IonTabButton>

            <IonTabButton tab="add" onClick={() => history.push('/notes/create')}>
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