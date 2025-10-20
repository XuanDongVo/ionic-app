import React, {useState} from "react";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToast,
    IonToggle,
    IonToolbar,
} from "@ionic/react";
import {archive, chevronBack, colorPalette, create, pin, save} from "ionicons/icons";
import {useHistory} from "react-router-dom";
import {noteApi} from "../services/api";
import {NoteFormData} from "../types";
import "./CreateNote.css";

const CreateNote: React.FC = () => {
    const history = useHistory();

    const [formData, setFormData] = useState<NoteFormData>({
        title: "",
        content: "",
        isPinned: false,
        isArchived: false,
        color: "#FFFFFF",
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success" as "success" | "danger",
    });

    const colorOptions = [
        {color: "#FFFFFF", name: "Trắng"},
        {color: "#FFE5E5", name: "Hồng nhạt"},
        {color: "#FFF4E5", name: "Cam nhạt"},
        {color: "#FFFBE5", name: "Vàng nhạt"},
        {color: "#E5F9E5", name: "Xanh lá nhạt"},
        {color: "#E5F4FF", name: "Xanh dương nhạt"},
        {color: "#F0E5FF", name: "Tím nhạt"},
        {color: "#FFE5F5", name: "Hồng tím"},
        {color: "#E5E5E5", name: "Xám nhạt"},
        {color: "#FFD6A5", name: "Cam"},
        {color: "#CAFFBF", name: "Xanh lá"},
        {color: "#9BF6FF", name: "Xanh ngọc"},
        {color: "#BDB2FF", name: "Tím"},
        {color: "#FFC6FF", name: "Hồng"},
    ];

    const showToast = (message: string, color: "success" | "danger" = "success") =>
        setToast({show: true, message, color});

    const handleInputChange = (key: keyof NoteFormData, value: any) =>
        setFormData((prev) => ({...prev, [key]: value}));

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            showToast("Vui lòng nhập tiêu đề", "danger");
            return;
        }

        setLoading(true);
        try {
            await noteApi.createNote(formData);
            showToast("Tạo note thành công!");
            localStorage.setItem("note-updated", Date.now().toString());
            setTimeout(() => {
                history.push({
                    pathname: "/notes",
                    state: {reload: true, timestamp: Date.now()},
                });
            }, 1000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
            showToast(msg, "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage className="create-note-page">
            <IonHeader className="ion-no-border" translucent>
                <IonToolbar className="modern-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" icon={chevronBack} text=""/>
                    </IonButtons>
                    <IonTitle className="modern-title">
                        <IonIcon icon={create} className="title-icon"/>
                        Tạo Note Mới
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="create-note-content">
                <div className="create-note-container">
                    <IonCard className="modern-card" style={{backgroundColor: formData.color}}>
                        <IonCardContent className="card-content">
                            {/* Title Input */}
                            <div className="input-group">
                                <IonItem lines="none" className="modern-item title-item">
                                    <IonLabel position="stacked" className="modern-label">
                                        Tiêu đề <span className="required">*</span>
                                    </IonLabel>
                                    <IonInput
                                        value={formData.title}
                                        placeholder="Nhập tiêu đề note của bạn..."
                                        className="modern-input"
                                        onIonInput={(e) =>
                                            handleInputChange("title", e.detail.value || "")
                                        }
                                    />
                                </IonItem>
                            </div>

                            {/* Content Textarea */}
                            <div className="input-group">
                                <IonItem lines="none" className="modern-item content-item">
                                    <IonLabel position="stacked" className="modern-label">
                                        Nội dung
                                    </IonLabel>
                                    <IonTextarea
                                        value={formData.content}
                                        placeholder="Viết nội dung note tại đây..."
                                        rows={8}
                                        autoGrow={true}
                                        className="modern-textarea"
                                        onIonInput={(e) =>
                                            handleInputChange("content", e.detail.value || "")
                                        }
                                    />
                                </IonItem>
                            </div>

                            {/* Color Picker */}
                            <div className="color-picker-section">
                                <div className="section-header">
                                    <IonIcon icon={colorPalette} className="section-icon"/>
                                    <span className="section-title">Chọn màu nền</span>
                                </div>
                                <div className="color-palette">
                                    {colorOptions.map((option) => (
                                        <div
                                            key={option.color}
                                            className={`color-swatch ${
                                                formData.color === option.color ? "selected" : ""
                                            }`}
                                            style={{backgroundColor: option.color}}
                                            onClick={() => handleInputChange("color", option.color)}
                                            title={option.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="options-section">
                                <IonItem lines="none" className="modern-item toggle-item">
                                    <IonIcon icon={pin} slot="start" className="option-icon"/>
                                    <IonLabel className="option-label">Ghim note</IonLabel>
                                    <IonToggle
                                        checked={formData.isPinned}
                                        onIonChange={(e) =>
                                            handleInputChange("isPinned", e.detail.checked)
                                        }
                                        className="modern-toggle"
                                    />
                                </IonItem>

                                <IonItem lines="none" className="modern-item toggle-item">
                                    <IonIcon icon={archive} slot="start" className="option-icon"/>
                                    <IonLabel className="option-label">Lưu trữ</IonLabel>
                                    <IonToggle
                                        checked={formData.isArchived}
                                        onIonChange={(e) =>
                                            handleInputChange("isArchived", e.detail.checked)
                                        }
                                        className="modern-toggle"
                                    />
                                </IonItem>
                            </div>

                            {/* Action Buttons */}
                            <div className="button-container">
                                <IonButton
                                    expand="block"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="primary-button"
                                    size="large"
                                >
                                    <IonIcon slot="start" icon={save}/>
                                    Tạo Note
                                </IonButton>
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    onClick={() => history.goBack()}
                                    disabled={loading}
                                    className="secondary-button"
                                    size="large"
                                >
                                    Hủy
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>

                <IonLoading
                    isOpen={loading}
                    message="Đang tạo note..."
                    spinner="crescent"
                    cssClass="modern-loading"
                />
                <IonToast
                    isOpen={toast.show}
                    onDidDismiss={() => setToast({...toast, show: false})}
                    message={toast.message}
                    duration={2000}
                    color={toast.color}
                    position="top"
                    cssClass="modern-toast"
                />
            </IonContent>
        </IonPage>
    );
};

export default CreateNote;
