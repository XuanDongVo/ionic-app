import React, { useState, useEffect } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonToggle,
    IonToast,
    IonLoading,
    IonCard,
    IonCardContent,
    IonAlert,
} from "@ionic/react";
import { save, chevronBack, trash, colorPalette, pin, archive, create } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";
import { noteApi } from "../services/api";
import { NoteFormData } from "../types";
import "./EditNote.css";

interface RouteParams {
    id: string;
}

const EditNote: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<RouteParams>();
    const noteId = parseInt(id);

    const [formData, setFormData] = useState<NoteFormData>({
        title: "",
        content: "",
        isPinned: false,
        isArchived: false,
        color: "#FFFFFF",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success" as "success" | "danger",
    });
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const colorOptions = [
        { color: "#FFFFFF", name: "Trắng" },
        { color: "#FFE5E5", name: "Hồng nhạt" },
        { color: "#FFF4E5", name: "Cam nhạt" },
        { color: "#FFFBE5", name: "Vàng nhạt" },
        { color: "#E5F9E5", name: "Xanh lá nhạt" },
        { color: "#E5F4FF", name: "Xanh dương nhạt" },
        { color: "#F0E5FF", name: "Tím nhạt" },
        { color: "#FFE5F5", name: "Hồng tím" },
        { color: "#E5E5E5", name: "Xám nhạt" },
        { color: "#FFD6A5", name: "Cam" },
        { color: "#CAFFBF", name: "Xanh lá" },
        { color: "#9BF6FF", name: "Xanh ngọc" },
        { color: "#BDB2FF", name: "Tím" },
        { color: "#FFC6FF", name: "Hồng" },
    ];

    /** ====== Helper ====== */
    const showToast = (message: string, color: "success" | "danger" = "success") =>
        setToast({ show: true, message, color });

    const handleInputChange = (key: keyof NoteFormData, value: any) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    /** ====== Load Note ====== */
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await noteApi.getNoteById(noteId);
                const note = res.data;

                setFormData({
                    title: note.title || "",
                    content: note.content || "",
                    isPinned: note.isPinned || false,
                    isArchived: note.isArchived || false,
                    color: note.color || "#FFFFFF",
                    notebookId: note.notebookId,
                    parentNoteId: note.parentNoteId,
                    tags: note.tags?.map((tag: any) => tag.id) || [],
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Không thể tải note";
                showToast(msg, "danger");
            } finally {
                setLoading(false);
            }
        })();
    }, [noteId]);

    /** ====== Submit ====== */
    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            showToast("Vui lòng nhập tiêu đề", "danger");
            return;
        }

        setSaving(true);
        try {
            await noteApi.updateNote(noteId, formData);
            showToast("Cập nhật note thành công!");
            setTimeout(() => history.push("/notes"), 1000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
            showToast(msg, "danger");
        } finally {
            setSaving(false);
        }
    };

    /** ====== Delete ====== */
    const handleDeleteClick = () => {
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        setSaving(true);
        try {
            await noteApi.deleteNote(noteId);
            showToast("Xóa note thành công!");
            setTimeout(() => history.push("/notes"), 1000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
            showToast(msg, "danger");
        } finally {
            setSaving(false);
            setShowDeleteAlert(false);
        }
    };

    /** ====== Render ====== */
    return (
        <IonPage className="edit-note-page">
            <IonHeader className="ion-no-border" translucent>
                <IonToolbar className="modern-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" icon={chevronBack} text="" />
                    </IonButtons>
                    <IonTitle className="modern-title">
                        <IonIcon icon={create} className="title-icon" />
                        Chỉnh Sửa Note
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={handleDeleteClick}
                            disabled={saving || loading}
                            color="danger"
                            fill="solid"
                            shape="round"
                            className="delete-button"
                        >
                            <IonIcon slot="start" icon={trash} />
                            <span className="button-text">Xóa</span>
                        </IonButton>
                        <IonButton
                            onClick={handleSubmit}
                            disabled={saving || loading}
                            className="save-button"
                            fill="solid"
                            shape="round"
                        >
                            <IonIcon slot="start" icon={save} />
                            <span className="button-text">Lưu</span>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="edit-note-content">
                {loading ? (
                    <IonLoading
                        isOpen={loading}
                        message="Đang tải note..."
                        spinner="crescent"
                        cssClass="modern-loading"
                    />
                ) : (
                    <div className="edit-note-container">
                        <IonCard className="modern-card" style={{ backgroundColor: formData.color }}>
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
                                        <IonIcon icon={colorPalette} className="section-icon" />
                                        <span className="section-title">Chọn màu nền</span>
                                    </div>
                                    <div className="color-palette">
                                        {colorOptions.map((option) => (
                                            <div
                                                key={option.color}
                                                className={`color-swatch ${
                                                    formData.color === option.color ? "selected" : ""
                                                }`}
                                                style={{ backgroundColor: option.color }}
                                                onClick={() => handleInputChange("color", option.color)}
                                                title={option.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="options-section">
                                    <IonItem lines="none" className="modern-item toggle-item">
                                        <IonIcon icon={pin} slot="start" className="option-icon" />
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
                                        <IonIcon icon={archive} slot="start" className="option-icon" />
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
                                        disabled={saving}
                                        className="primary-button"
                                        size="large"
                                    >
                                        <IonIcon slot="start" icon={save} />
                                        Cập Nhật Note
                                    </IonButton>
                                    <IonButton
                                        expand="block"
                                        fill="outline"
                                        onClick={() => history.goBack()}
                                        disabled={saving}
                                        className="secondary-button"
                                        size="large"
                                    >
                                        Hủy
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </div>
                )}

                <IonLoading
                    isOpen={saving}
                    message="Đang lưu..."
                    spinner="crescent"
                    cssClass="modern-loading"
                />
                <IonToast
                    isOpen={toast.show}
                    onDidDismiss={() => setToast({ ...toast, show: false })}
                    message={toast.message}
                    duration={2000}
                    color={toast.color}
                    position="top"
                    cssClass="modern-toast"
                />
                <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    cssClass="modern-alert"
                    header="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa note này không? Hành động này không thể hoàn tác."
                    buttons={[
                        {
                            text: "Hủy",
                            role: "cancel",
                            cssClass: "alert-button-cancel",
                        },
                        {
                            text: "Xóa",
                            cssClass: "alert-button-confirm",
                            handler: confirmDelete,
                        },
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default EditNote;
