import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText,
  IonToggle,
  IonList,
} from '@ionic/react';
import { keyOutline, trashOutline, copyOutline, checkmarkCircle } from 'ionicons/icons';
import './DevTools.css';

const DevTools: React.FC = () => {
  const [token, setToken] = useState('');
  const [currentToken, setCurrentToken] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('success');
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    // Load current token from localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setCurrentToken(savedToken);
    }
  }, []);

  const handleSaveToken = () => {
    if (!token.trim()) {
      setToastMessage('Vui lòng nhập token');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    localStorage.setItem('token', token.trim());
    setCurrentToken(token.trim());
    setToastMessage('✅ Đã lưu token thành công!');
    setToastColor('success');
    setShowToast(true);
    setToken('');
  };

  const handleClearToken = () => {
    localStorage.removeItem('token');
    setCurrentToken('');
    setToken('');
    setToastMessage('🗑️ Đã xóa token');
    setToastColor('success');
    setShowToast(true);
  };

  const handleCopyToken = () => {
    if (currentToken) {
      navigator.clipboard.writeText(currentToken);
      setToastMessage('📋 Đã copy token');
      setToastColor('success');
      setShowToast(true);
    }
  };

  const handleUseMockToken = () => {
    const mockToken = 'mock-token-for-testing';
    localStorage.setItem('token', mockToken);
    setCurrentToken(mockToken);
    setToastMessage('✅ Đã sử dụng Mock Token');
    setToastColor('success');
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>🛠️ Developer Tools</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="dev-tools-container">
          {/* Warning Banner */}
          <IonCard color="warning" className="warning-card">
            <IonCardHeader>
              <IonCardTitle>⚠️ Chế độ Development</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              Trang này chỉ dùng để test khi backend chưa sẵn sàng.
              Không sử dụng trong production!
            </IonCardContent>
          </IonCard>

          {/* Current Token Status */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Trạng thái Token</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {currentToken ? (
                <div className="token-status">
                  <IonIcon icon={checkmarkCircle} color="success" style={{ fontSize: '24px' }} />
                  <div className="token-info">
                    <IonText color="success">
                      <strong>Đã có token</strong>
                    </IonText>
                    <div className="token-preview">
                      {currentToken.substring(0, 30)}...
                    </div>
                  </div>
                </div>
              ) : (
                <IonText color="danger">
                  <p>Chưa có token. Vui lòng nhập token hoặc dùng mock token.</p>
                </IonText>
              )}

              {currentToken && (
                <div className="token-actions">
                  <IonButton size="small" fill="outline" onClick={handleCopyToken}>
                    <IonIcon icon={copyOutline} slot="start" />
                    Copy
                  </IonButton>
                  <IonButton size="small" fill="outline" color="danger" onClick={handleClearToken}>
                    <IonIcon icon={trashOutline} slot="start" />
                    Xóa
                  </IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Mock Data Toggle */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Cấu hình Mock Data</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h2>Sử dụng Mock Data</h2>
                    <p>Không gọi API backend, dùng dữ liệu giả</p>
                  </IonLabel>
                  <IonToggle
                    checked={useMockData}
                    onIonChange={(e) => setUseMockData(e.detail.checked)}
                    color="success"
                  />
                </IonItem>
              </IonList>
              <IonText color="medium">
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  Hiện tại USE_MOCK_DATA = true trong code.
                  Để thay đổi, cần sửa file api.ts
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Add Token Form */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nhập Token từ Backend</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText color="medium">
                <p>Lấy token từ team Auth và paste vào đây:</p>
              </IonText>

              <IonItem className="token-input">
                <IonLabel position="stacked">JWT Token</IonLabel>
                <IonInput
                  value={token}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  onIonInput={(e) => setToken(e.detail.value || '')}
                  type="text"
                />
              </IonItem>

              <div className="button-group">
                <IonButton expand="block" onClick={handleSaveToken}>
                  <IonIcon icon={keyOutline} slot="start" />
                  Lưu Token
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Quick Actions */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Quick Actions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton expand="block" fill="outline" onClick={handleUseMockToken}>
                Dùng Mock Token (Test)
              </IonButton>

              <IonText color="medium">
                <p style={{ fontSize: '12px', marginTop: '12px' }}>
                  💡 <strong>Hướng dẫn:</strong><br />
                  1. Nếu backend chưa sẵn sàng: Để USE_MOCK_DATA = true<br />
                  2. Nếu đã có backend: Nhập token thật từ API login<br />
                  3. Hoặc dùng Mock Token để test offline
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Instructions */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>📚 Cách lấy Token</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ol style={{ paddingLeft: '20px', marginTop: 0 }}>
                <li>Mở Postman hoặc tương tự</li>
                <li>POST đến: <code>http://localhost:8080/api/auth/login</code></li>
                <li>Body (JSON):
                  <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`{
  "username": "your_username",
  "password": "your_password"
}`}
                  </pre>
                </li>
                <li>Copy token từ response</li>
                <li>Paste vào form trên</li>
              </ol>
            </IonCardContent>
          </IonCard>
        </div>

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

export default DevTools;

