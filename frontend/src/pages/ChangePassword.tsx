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
      alert('Vui lòng điền đầy đủ các trường');
      return;
    }

    if (next !== confirm) {
      alert('Mật khẩu mới không khớp');
      return;
    }

    if (next.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 kí tự');
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: current,
        newPassword: next,
        confirmPassword: confirm,
      });
      alert('Mật khẩu đã được đổi thành công!');
      setCurrent('');
      setNext('');
      setConfirm('');
      history.push('/settings');
    } catch (error: any) {
      console.error('Đổi mật khẩu thất bại:', error);
      alert(error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile/edit" text="Trở về" />
          </IonButtons>
          <IonTitle>Đổi mật khẩu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonNote color="medium">Vui lòng nhập mật khẩu hiện tại trước</IonNote>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">Mật khẩu hiện tại</IonLabel>
            <IonInput type="password" value={current} onIonInput={(e) => setCurrent(e.detail.value || '')} />
          </IonItem>
        </IonList>

        <IonNote color="medium" style={{ display: 'block', marginTop: 16 }}>Bây giờ, tạo mật khẩu mới của bạn</IonNote>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">Mật khẩu mới</IonLabel>
            <IonInput type="password" value={next} onIonInput={(e) => setNext(e.detail.value || '')} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Nhập lại mật khẩu mới</IonLabel>
            <IonInput type="password" value={confirm} onIonInput={(e) => setConfirm(e.detail.value || '')} />
          </IonItem>
        </IonList>

        <div style={{ padding: 16 }}>
          <IonButton expand="block" onClick={onSubmit} disabled={saving}>
            Xác nhận mật khẩu mới
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;


