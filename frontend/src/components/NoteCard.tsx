import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRippleEffect,
  IonCheckbox,
  IonIcon,
  IonButton,
  IonChip,
  IonLabel,
} from '@ionic/react';
import { closeOutline, pencilOutline, pinOutline, archiveOutline } from 'ionicons/icons';
import { Note } from '../types';
import './NoteCard.css';

interface NoteCardProps {
  note: Note;
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onTogglePin?: (id: number) => void;
  onToggleArchive?: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onToggleStatus,
  onDelete,
  onEdit,
  onTogglePin,
  onToggleArchive
}) => (
  <div className="note-wrapper">
    <IonCard
      className={`note-card ion-activatable ${note.isCompleted ? 'completed' : ''}`}
      style={{
        backgroundColor: note.color || '#ffffff',
        minHeight: '150px',
        opacity: note.isCompleted ? 0.6 : 1,
        borderLeft: note.isPinned ? '4px solid var(--ion-color-warning)' : 'none',
      }}
    >
      <IonCardHeader>
        <div className="note-header">
          {onToggleStatus && (
            <IonCheckbox
              checked={note.isCompleted}
              onIonChange={() => onToggleStatus(note.id)}
              className="note-checkbox"
            />
          )}
          <IonCardTitle
            className="note-title"
            onClick={() => onEdit?.(note.id)}
            style={{
              cursor: 'pointer',
              flex: 1,
              textDecoration: note.isCompleted ? 'line-through' : 'none'
            }}
          >
            {note.title}
          </IonCardTitle>
          <div className="note-actions">
            {onTogglePin && (
              <IonButton
                fill="clear"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                color={note.isPinned ? 'warning' : 'medium'}
              >
                <IonIcon icon={pinOutline} slot="icon-only" />
              </IonButton>
            )}
            {onToggleArchive && (
              <IonButton
                fill="clear"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleArchive(note.id);
                }}
                color={note.isArchived ? 'tertiary' : 'medium'}
              >
                <IonIcon icon={archiveOutline} slot="icon-only" />
              </IonButton>
            )}
            {onEdit && (
              <IonButton
                fill="clear"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note.id);
                }}
              >
                <IonIcon icon={pencilOutline} slot="icon-only" />
              </IonButton>
            )}
            {onDelete && (
              <IonButton
                fill="clear"
                size="small"
                color="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
              >
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            )}
          </div>
        </div>
      </IonCardHeader>

      <IonCardContent className="note-content">
        <p>{note.content}</p>
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.map((tag) => (
              <IonChip key={tag.id} color="primary" outline>
                <IonLabel>{tag.name}</IonLabel>
              </IonChip>
            ))}
          </div>
        )}
        {note.createdAt && (
          <p className="note-date">
            {new Date(note.createdAt).toLocaleDateString('vi-VN')}
          </p>
        )}
      </IonCardContent>
      <IonRippleEffect />
    </IonCard>
  </div>
);

export default NoteCard;
