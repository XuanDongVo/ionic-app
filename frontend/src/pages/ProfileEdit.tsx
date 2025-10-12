import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonNote,
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import { fetchProfile, updateProfile, uploadProfileImage } from '../state/api';

const DEFAULT_EMAIL = 'demo@example.com';

const ProfileEdit: React.FC = () => {
  const [email, setEmail] = useState<string>(DEFAULT_EMAIL);
  const [fullName, setFullName] = useState<string>('');
  const [imagePath, setImagePath] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProfile(email);
        setFullName(data.fullName);
        setImagePath(data.imagePath);
      } catch (e) {
        // ignore for demo
      }
    })();
  }, [email]);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile(email, { fullName, email });
    } finally {
      setSaving(false);
    }
  };

  const onPickImage = () => fileRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const res = await uploadProfileImage(email, f);
    setImagePath(res.imagePath);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <IonAvatar style={{ width: 112, height: 112 }}>
            {imagePath ? (
              // Using backend-served static path
              <img alt="avatar" src={imagePath} />
            ) : (
              <img alt="avatar" src="/favicon.png" />
            )}
          </IonAvatar>
          <IonButton fill="outline" onClick={onPickImage}>
            <IonIcon icon={createOutline} slot="start" />
            Change Image
          </IonButton>
          <input ref={fileRef} onChange={onFileChange} type="file" accept="image/*" hidden />
        </div>

        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">Full Name</IonLabel>
            <IonInput value={fullName} onIonInput={(e) => setFullName(e.detail.value || '')} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Email Address</IonLabel>
            <IonInput value={email} onIonInput={(e) => setEmail(e.detail.value || '')} />
          </IonItem>
          <IonNote style={{ marginLeft: 16, marginTop: 6, display: 'block' }} color="medium">
            Changing email may require re-login on the app.
          </IonNote>
        </IonList>

        <div style={{ padding: 16 }}>
          <IonButton expand="block" disabled={saving} onClick={onSave}>
            Save Changes
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileEdit;


