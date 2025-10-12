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
import { changePassword } from '../state/api';
import { useHistory } from 'react-router-dom';

const ChangePassword: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const history = useHistory();

  const onSubmit = async () => {
    if (!current || !next || !confirm) {
      alert('Please fill in all fields');
      return;
    }

    if (next !== confirm) {
      alert('New passwords do not match');
      return;
    }

    if (next.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: current,
        newPassword: next,
        confirmPassword: confirm,
      });
      alert('Password changed successfully!');
      setCurrent('');
      setNext('');
      setConfirm('');
      history.push('/settings');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
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


