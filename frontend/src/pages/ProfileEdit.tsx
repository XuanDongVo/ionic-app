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
  IonActionSheet,
  isPlatform,
} from '@ionic/react';
import { createOutline, camera, images, close } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getCurrentUserProfile, updateCurrentUserProfile, uploadCurrentUserImage, baseUrl } from '../state/api';
import { useHistory } from 'react-router-dom';

const ProfileEdit: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getCurrentUserProfile();
        setUsername(data.username);
        setEmail(data.email);
        setProfileImage(data.profileImage);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        const token = localStorage.getItem('token');
        if (!token) {
          history.push('/login');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [history]);

  const onSave = async () => {
    setSaving(true);
    try {
      const updatedData = await updateCurrentUserProfile({ username, email });
      setUsername(updatedData.username);
      setEmail(updatedData.email);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Hàm mở action sheet để chọn Camera hoặc Gallery (Mobile)
  // hoặc mở file picker (Web)
  const onPickImage = () => {
    if (isPlatform('capacitor') || isPlatform('cordova')) {
      // Trên mobile: hiện action sheet
      setShowActionSheet(true);
    } else {
      // Trên web: dùng file input
      fileRef.current?.click();
    }
  };

  // Chụp ảnh từ Camera
  const takePicture = async () => {
    try {
      setUploading(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        await uploadImageFromDataUrl(image.dataUrl);
      }
    } catch (error: any) {
      console.error('Failed to take picture:', error);
      if (error.message !== 'User cancelled photos app') {
        alert('Failed to take picture');
      }
    } finally {
      setUploading(false);
    }
  };

  // Chọn ảnh từ Gallery
  const pickFromGallery = async () => {
    try {
      setUploading(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (image.dataUrl) {
        await uploadImageFromDataUrl(image.dataUrl);
      }
    } catch (error: any) {
      console.error('Failed to pick image:', error);
      if (error.message !== 'User cancelled photos app') {
        alert('Failed to pick image');
      }
    } finally {
      setUploading(false);
    }
  };

  // Upload ảnh từ Data URL (base64)
  const uploadImageFromDataUrl = async (dataUrl: string) => {
    try {
      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Convert Blob to File
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(' File size must be less than 10MB');
        return;
      }
      
      console.log('Uploading image from mobile, Size:', (file.size / 1024).toFixed(2) + 'KB');
      
      const res = await uploadCurrentUserImage(file);
      console.log('Upload success:', res);
      
      setProfileImage(res.profileImage);
      alert('Profile image updated successfully!');
      
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      
      if (error.response?.data?.message) {
        alert('' + error.response.data.message);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    try {
      // Validate file type
      if (!f.type.startsWith('image/')) {
        alert('Please select an image file (jpg, png, gif, etc.)');
        e.target.value = ''; // Reset input
        return;
      }
      
      // Validate file size (10MB)
      if (f.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = ''; // Reset input
        return;
      }
      
      console.log('Uploading image:', f.name, 'Size:', (f.size / 1024).toFixed(2) + 'KB');
      setUploading(true);
      
      const res = await uploadCurrentUserImage(f);
      console.log('Upload success:', res);
      
      setProfileImage(res.profileImage);
      alert('Profile image updated successfully!');
      
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      
      // Show specific error message from backend
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.message) {
        alert(error.message);
      } else {
        alert('Failed to upload image. Please try again.');
      }
      
      // Reset input
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Cài đặt" />
          </IonButtons>
          <IonTitle>Chỉnh sửa hồ sơ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <p>Loading profile...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <IonAvatar style={{ width: 112, height: 112 }}>
                {profileImage ? (
                  <img alt="avatar" src={profileImage.startsWith('http') ? profileImage : `${baseUrl}${profileImage}`} />
                ) : (
                  <img alt="avatar" src="/favicon.png" />
                )}
              </IonAvatar>
              <IonButton fill="outline" onClick={onPickImage} disabled={uploading}>
                <IonIcon icon={createOutline} slot="start" />
                {uploading ? 'Uploading...' : 'Change Image'}
              </IonButton>
              <input 
                ref={fileRef} 
                onChange={onFileChange} 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                hidden 
              />
            </div>

            <IonList inset>
              <IonItem>
                <IonLabel position="stacked">Họ và tên</IonLabel>
                <IonInput value={username} onIonInput={(e) => setUsername(e.detail.value || '')} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Địa chỉ email</IonLabel>
                <IonInput value={email} onIonInput={(e) => setEmail(e.detail.value || '')} />
              </IonItem>
              <IonNote style={{ marginLeft: 16, marginTop: 6, display: 'block' }} color="medium">
                Thay đổi email có thể yêu cầu đăng nhập lại trên ứng dụng.
              </IonNote>
            </IonList>

            <div style={{ padding: 16 }}>
              <IonButton expand="block" disabled={saving} onClick={onSave}>
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </IonButton>
            </div>
          </>
        )}
      </IonContent>

      {/* Action Sheet để chọn Camera hoặc Gallery */}
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header="Select Image Source"
        buttons={[
          {
            text: 'Take Photo',
            icon: camera,
            handler: () => {
              takePicture();
            }
          },
          {
            text: 'Choose from Gallery',
            icon: images,
            handler: () => {
              pickFromGallery();
            }
          },
          {
            text: 'Cancel',
            icon: close,
            role: 'cancel',
          }
        ]}
      />
    </IonPage>
  );
};

export default ProfileEdit;


