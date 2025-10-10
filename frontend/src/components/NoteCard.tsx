import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRippleEffect
} from '@ionic/react';

import { NoteCardProps } from '../types';

const NoteCard: React.FC<NoteCardProps> = ({ note }) => (
  <div className="note-wrapper">
    <IonCard
      className="note-card ion-activatable"
      style={{
        backgroundColor: note.color,
        minHeight: '100px',
        maxHeight: '300px',
        overflow: 'hidden',
      }}
    >
      <IonCardHeader>
        <IonCardTitle className="note-title">{note.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="note-content">
        {note.content}
      </IonCardContent>
      <IonRippleEffect />
    </IonCard>
  </div>
);

export default NoteCard;
