import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonNote,
} from '@ionic/react';

const ChangePassword: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (next !== confirm) {
      alert('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      // Placeholder: backend change password not implemented yet
      await new Promise((r) => setTimeout(r, 600));
      alert('Password updated');
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile/edit" text="Back" />
          </IonButtons>
          <IonTitle>Change Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonNote color="medium">Please input your current password first</IonNote>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">Current Password</IonLabel>
            <IonInput type="password" value={current} onIonInput={(e) => setCurrent(e.detail.value || '')} />
          </IonItem>
        </IonList>

        <IonNote color="medium" style={{ display: 'block', marginTop: 16 }}>Now, create your new password</IonNote>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">New Password</IonLabel>
            <IonInput type="password" value={next} onIonInput={(e) => setNext(e.detail.value || '')} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Retype New Password</IonLabel>
            <IonInput type="password" value={confirm} onIonInput={(e) => setConfirm(e.detail.value || '')} />
          </IonItem>
        </IonList>

        <div style={{ padding: 16 }}>
          <IonButton expand="block" onClick={onSubmit} disabled={saving}>
            Submit New Password
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;


