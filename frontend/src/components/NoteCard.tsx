import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRippleEffect,
  IonCheckbox,
  IonIcon,
  IonButton
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { NoteCardProps } from '../types';

const NoteCard: React.FC<NoteCardProps> = ({ note, onToggleStatus, onDelete }) => (
  <div className="note-wrapper">
    <IonCard
      className="note-card ion-activatable"
      style={{
        backgroundColor: note.color,
        minHeight: '100px',
        maxHeight: '300px',
        overflow: 'hidden',
        opacity: note.completed ? 0.6 : 1, // mờ nếu đã hoàn thành
      }}
    >
      <IonCardHeader>
        <div className="note-header">
          <IonCheckbox
            checked={note.completed}
            onIonChange={() => onToggleStatus?.(note.id)}
            className="note-checkbox"
          />
          <IonCardTitle className="note-title">{note.title}</IonCardTitle>
          <IonButton
            fill="clear"
            size="small"
            className="delete-btn"
            onClick={() => onDelete?.(note.id)}
          >
            <IonIcon icon={closeOutline} />
          </IonButton>
        </div>
      </IonCardHeader>

      <IonCardContent className="note-content">
        {note.content}
      </IonCardContent>
      <IonRippleEffect />
    </IonCard>
  </div>
);

export default NoteCard;
