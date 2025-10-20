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
  useIonViewWillEnter,
} from '@ionic/react';
import { createOutline, lockClosedOutline, notificationsOutline, textOutline, logOutOutline, mailOutline, constructOutline } from 'ionicons/icons';
import './Settings.css';
import { getCurrentUserProfile, baseUrl } from '../state/api';
import { useHistory } from 'react-router-dom';

const Settings: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  // Function để load profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const data = await getCurrentUserProfile();
      
      setUsername(data.username);
      setEmail(data.email);
      setProfileImage(data.profileImage);
    } catch (error: any) {
      // Nếu không có token hoặc token hết hạn, redirect về login
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        history.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load profile khi component mount
  useEffect(() => {
    loadProfile();
  }, [history]);

  // Reload profile mỗi khi vào trang Settings (từ ProfileEdit về)
  useIonViewWillEnter(() => {
    console.log('Settings page entered, reloading profile...');
    loadProfile();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Trở về" />
          </IonButtons>
          <IonTitle>Cài đặt</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="settings-header">
          <div className="settings-profile-row">
            <IonAvatar style={{ width: 56, height: 56 }}>
              {profileImage ? (
                <img alt="avatar" src={profileImage.startsWith('http') ? profileImage : `${baseUrl}${profileImage}`} />
              ) : (
                <img alt="avatar" src="/favicon.png" />
              )}
            </IonAvatar>
            <div>
               <div className="settings-name">{loading ? 'Đang tải...' : (username || 'Người dùng')}</div>
              <div className="settings-email">
                <IonIcon icon={mailOutline} />
                <span>{loading ? 'Đang tải...' : email}</span>
              </div>
            </div>
          </div>

          <div className="settings-edit-block">
            <IonRouterLink routerLink="/profile/edit" style={{ textDecoration: 'none' }}>
              <IonButton className="edit-outline-btn" expand="block" fill="outline">
                <IonIcon icon={createOutline} slot="start" />
                 Chỉnh sửa hồ sơ
              </IonButton>
            </IonRouterLink>
          </div>
        </div>

        <div className="section-label">CÀI ĐẶT ỨNG DỤNG</div>

        <IonList inset className="settings-list">
          <IonItem button detail={true} routerLink="/profile/change-password">
            <IonIcon icon={lockClosedOutline} slot="start" />
            <IonLabel>Đổi mật khẩu</IonLabel>
          </IonItem>

          <IonItem button={false} detail={false}>
            <IonIcon icon={textOutline} slot="start" />
            <IonLabel>Cỡ chữ</IonLabel>
            <IonNote slot="end">Trung bình</IonNote>
          </IonItem>

          <IonItem button={false} detail={false}>
            <IonIcon icon={notificationsOutline} slot="start" />
            <IonLabel>Thông báo</IonLabel>
            <IonNote slot="end">Tất cả hoạt động</IonNote>
          </IonItem>
        </IonList>

        <IonList inset className="logout-list">
          <IonItem 
            button 
            detail={false} 
            lines="none" 
            color="danger" 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            <IonLabel>Đăng xuất</IonLabel>
          </IonItem>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Settings;
