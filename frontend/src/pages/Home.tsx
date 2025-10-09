import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import NoteCard from '../components/NoteCard';
import './Home.css';
import { Note } from '../types';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const demoNotes: Note[] = [
      {
        id: 1,
        title: 'New Product Idea Design',
        content:
          'Create a mobile app UI Kit that provide a basic notes functionality but with some improvement. There will be a choice to select what kind of notes that user needed.',
        color: '#F5F5DC',
      },
      {
        id: 2,
        title: 'New Product Idea Design',
        content: 'Create a mobile app UI Kit that provide a basic notes functionality but with some improvement.',
        color: '#FFF8DC',
      },
      {
        id: 3,
        title: 'Shopping List',
        content: 'Milk, eggs, bread, butter, cheese',
        color: '#FAFAD2',
      },
      {
        id: 4,
        title: 'Meeting Notes',
        content: 'Discuss project timeline and resource allocation. Follow up with team about deliverables.',
        color: '#E6E6FA',
      },
      {
        id: 5,
        title: 'Book Recommendations',
        content: 'Atomic Habits, Deep Work, The Psychology of Money',
        color: '#F0FFF0',
      },
      {
        id: 6,
        title: 'Weekly Goals',
        content: 'Finish project proposal, Exercise 3 times, Call mom, Read 50 pages',
        color: '#F0F8FF',
      },
    ];
    setNotes(demoNotes);
  }, []);

  const generateItems = () => {
    const newNotes: Note[] = [];
    const startId = notes.length + 1;
    for (let i = 0; i < 6; i++) {
      newNotes.push({
        id: startId + i,
        title: `Note Title ${startId + i}`,
        content: 'This is a sample note content. It can be quite long, so it should be truncated in the card view.',
        color: ['#F5F5DC', '#FFF8DC', '#FAFAD2', '#E6E6FA', '#F0FFF0', '#F0F8FF'][Math.floor(Math.random() * 6)],
      });
    }
    setNotes([...notes, ...newNotes]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home - {notes.length} Notes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <img src="/assets/empty-state-illustration.svg" alt="Start journey illustration" />
            </div>
            <h1 className="empty-title">Start Your Journey</h1>
            <p className="empty-text">
              Every big step starts with a small step.
              <br />
              Note your first idea and start your journey!
            </p>
            <div className="arrow-down">
              <img src="/assets/arrow-down.svg" alt="Arrow down" />
            </div>
          </div>
        ) : (
          <>
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IonInfiniteScroll
                onIonInfinite={(event) => {
                  generateItems();
                  setTimeout(() => event.target.complete(), 2000);
                }}
              >
                <IonInfiniteScrollContent loadingText="Loading..."></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
