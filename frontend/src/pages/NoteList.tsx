import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonLoading,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { add, refreshCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { getAllNotes, getPinnedNotes, getArchivedNotes, deleteNote, togglePinNote, toggleArchiveNote } from '../services/api';
import { Note } from '../types';
import './NoteList.css';

const NoteList: React.FC = () => {
  const history = useHistory();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'pinned' | 'archived'>('all');

  useEffect(() => {
    loadNotes();
  }, [selectedSegment]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      let response;

      switch (selectedSegment) {
        case 'pinned':
          response = await getPinnedNotes();
          break;
        case 'archived':
          response = await getArchivedNotes();
          break;
        default:
          response = await getAllNotes();
      }

      console.log('📋 Notes loaded:', response);
      setNotes(response.data || []);
    } catch (error) {
      console.error('❌ Load notes error:', error);
      setToastMessage(error instanceof Error ? error.message : 'Không thể tải danh sách notes');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadNotes();
    event.detail.complete();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa note này?')) {
      return;
    }

    try {
      await deleteNote(id);
      setToastMessage('Xóa note thành công!');
      setToastColor('success');
      setShowToast(true);
      loadNotes();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      await togglePinNote(id);
      setToastMessage('Đã cập nhật trạng thái ghim');
      setToastColor('success');
      setShowToast(true);
      loadNotes();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleToggleArchive = async (id: number) => {
    try {
      await toggleArchiveNote(id);
      setToastMessage('Đã cập nhật trạng thái lưu trữ');
      setToastColor('success');
      setShowToast(true);
      loadNotes();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleEditNote = (id: number) => {
    history.push(`/notes/edit/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Danh Sách Notes</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={selectedSegment} onIonChange={(e) => setSelectedSegment(e.detail.value as any)}>
            <IonSegmentButton value="all">
              <IonLabel>Tất cả</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pinned">
              <IonLabel>Đã ghim</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="archived">
              <IonLabel>Lưu trữ</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refreshCircle}
            refreshingSpinner="circles"
          />
        </IonRefresher>

        {loading ? (
          <IonLoading isOpen={loading} message="Đang tải notes..." />
        ) : (
          <div className="note-list-container ion-padding">
            {notes.length === 0 ? (
              <div className="empty-state">
                <p>Chưa có note nào</p>
                <p className="empty-state-hint">Nhấn nút + để tạo note mới</p>
              </div>
            ) : (
              <IonGrid>
                <IonRow>
                  {notes.map((note) => (
                    <IonCol size="12" sizeMd="6" sizeLg="4" key={note.id}>
                      <NoteCard
                        note={note}
                        onDelete={handleDelete}
                        onEdit={handleEditNote}
                        onTogglePin={handleTogglePin}
                        onToggleArchive={handleToggleArchive}
                      />
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            )}
          </div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/notes/create')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

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

export default NoteList;
