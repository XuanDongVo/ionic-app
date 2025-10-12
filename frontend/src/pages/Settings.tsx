import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonIcon,
  IonNote,
  IonRouterLink,
} from '@ionic/react';
import { createOutline, lockClosedOutline, notificationsOutline, textOutline, logOutOutline, mailOutline } from 'ionicons/icons';
import './Settings.css';
import { fetchProfile } from '../state/api';

const DEFAULT_EMAIL = 'demo@example.com';

const Settings: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [imagePath, setImagePath] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProfile(email);
        setFullName(data.fullName);
        setEmail(data.email);
        setImagePath(data.imagePath);
      } catch (_) {
        // ignore for demo
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Back" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="settings-header">
          <div className="settings-profile-row">
            <IonAvatar style={{ width: 56, height: 56 }}>
              {imagePath ? <img alt="avatar" src={imagePath} /> : <img alt="avatar" src="/favicon.png" />}
            </IonAvatar>
            <div>
              <div className="settings-name">{fullName || 'Michael Antonio'}</div>
              <div className="settings-email">
                <IonIcon icon={mailOutline} />
                <span>{email}</span>
              </div>
            </div>
          </div>

          <div className="settings-edit-block">
            <IonRouterLink routerLink="/profile/edit" style={{ textDecoration: 'none' }}>
              <IonButton className="edit-outline-btn" expand="block" fill="outline">
                <IonIcon icon={createOutline} slot="start" />
                Edit Profile
              </IonButton>
            </IonRouterLink>
          </div>
        </div>

        <div className="section-label">APP SETTINGS</div>

        <IonList inset className="settings-list">
          <IonItem button detail={true} routerLink="/profile/change-password">
            <IonIcon icon={lockClosedOutline} slot="start" />
            <IonLabel>Change Password</IonLabel>
          </IonItem>

          <IonItem button={false} detail={false}>
            <IonIcon icon={textOutline} slot="start" />
            <IonLabel>Text Size</IonLabel>
            <IonNote slot="end">Medium</IonNote>
          </IonItem>

          <IonItem button={false} detail={false}>
            <IonIcon icon={notificationsOutline} slot="start" />
            <IonLabel>Notifications</IonLabel>
            <IonNote slot="end">All active</IonNote>
          </IonItem>
        </IonList>

        <IonList inset className="logout-list">
          <IonItem button detail={false} lines="none" color="danger" onClick={() => alert('Logged out (demo)')}>
            <IonIcon icon={logOutOutline} slot="start" />
            <IonLabel>Log Out</IonLabel>
          </IonItem>
        </IonList>

        <div className="settings-footer-version">Makarya Notes v1.1</div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;


