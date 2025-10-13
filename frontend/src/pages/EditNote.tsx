import React, { useState, useEffect } from 'react';
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
import { save, chevronBack, trash } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote } from '../services/api';
import { NoteFormData } from '../types';
import './EditNote.css';

interface RouteParams {
  id: string;
}

const EditNote: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const noteId = parseInt(id);

  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    isPinned: false,
    isArchived: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const response = await getNoteById(noteId);
      const note = response.data;

      setFormData({
        title: note.title || '',
        content: note.content || '',
        isPinned: note.isPinned || false,
        isArchived: note.isArchived || false,
        notebookId: note.notebookId,
        parentNoteId: note.parentNoteId,
        tags: note.tags?.map((tag: any) => tag.id) || [],
      });
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Không thể tải note');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setToastMessage('Vui lòng nhập tiêu đề');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setSaving(true);
    try {
      await updateNote(noteId, formData);
      setToastMessage('Cập nhật note thành công!');
      setToastColor('success');
      setShowToast(true);

      setTimeout(() => {
        history.push('/home');
      }, 1000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa note này?')) {
      return;
    }

    setSaving(true);
    try {
      await deleteNote(noteId);
      setToastMessage('Xóa note thành công!');
      setToastColor('success');
      setShowToast(true);

      setTimeout(() => {
        history.push('/home');
      }, 1000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={chevronBack} />
          </IonButtons>
          <IonTitle>Chỉnh Sửa Note</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleDelete} disabled={saving || loading} color="danger">
              <IonIcon slot="icon-only" icon={trash} />
            </IonButton>
            <IonButton onClick={handleSubmit} disabled={saving || loading}>
              <IonIcon slot="icon-only" icon={save} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <IonLoading isOpen={loading} message="Đang tải note..." />
        ) : (
          <div className="edit-note-container">
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
              <IonButton expand="block" onClick={handleSubmit} disabled={saving}>
                Cập Nhật Note
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => history.goBack()}
                disabled={saving}
              >
                Hủy
              </IonButton>
            </div>
          </div>
        )}

        <IonLoading isOpen={saving} message="Đang lưu..." />

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

export default EditNote;

