import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,
  IonToggle,
  IonButtons,
  IonBackButton,
  IonToast,
  IonLoading,
  IonIcon,
} from '@ionic/react';
import { save, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { createNote } from '../services/api';
import { NoteFormData } from '../types';
import './CreateNote.css';

const CreateNote: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    isPinned: false,
    isArchived: false,
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setToastMessage('Vui lòng nhập tiêu đề');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await createNote(formData);
      console.log('✅ Note created:', response);
      setToastMessage('Tạo note thành công!');
      setToastColor('success');
      setShowToast(true);

      // Redirect to notes list after short delay
      setTimeout(() => {
        history.push('/notes');
      }, 1000);
    } catch (error) {
      console.error('❌ Create note error:', error);
      setToastMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={chevronBack} />
          </IonButtons>
          <IonTitle>Tạo Note Mới</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit} disabled={loading}>
              <IonIcon slot="icon-only" icon={save} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="create-note-container">
          <IonItem>
            <IonLabel position="stacked">Tiêu đề *</IonLabel>
            <IonInput
              value={formData.title}
              placeholder="Nhập tiêu đề note"
              onIonInput={(e) =>
                setFormData({ ...formData, title: e.detail.value || '' })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Nội dung</IonLabel>
            <IonTextarea
              value={formData.content}
              placeholder="Nhập nội dung note..."
              rows={10}
              onIonInput={(e) =>
                setFormData({ ...formData, content: e.detail.value || '' })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel>Ghim note</IonLabel>
            <IonToggle
              checked={formData.isPinned}
              onIonChange={(e) =>
                setFormData({ ...formData, isPinned: e.detail.checked })
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel>Lưu trữ</IonLabel>
            <IonToggle
              checked={formData.isArchived}
              onIonChange={(e) =>
                setFormData({ ...formData, isArchived: e.detail.checked })
              }
            />
          </IonItem>

          <div className="button-container">
            <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
              Tạo Note
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => history.goBack()}
              disabled={loading}
            >
              Hủy
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Đang tạo note..." />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateNote;
