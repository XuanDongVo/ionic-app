import React, { useEffect, useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLoading,
    IonToast,
    IonAlert,
    useIonViewWillEnter,
} from "@ionic/react";
import { add, refreshCircle, listOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import { Note } from "../types";
import { noteApi } from "../services/api";
import noteService from "../state/noteService/noteService";
import "./NoteList.css";

const NoteList: React.FC = () => {
    const history = useHistory();

    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        color: "success" as "success" | "danger",
    });
    const [segment, setSegment] = useState<"pinned" | "archived" | "completed">(
        "pinned"
    );
    const [deleteAlert, setDeleteAlert] = useState({
        show: false,
        noteId: 0,
    });

    useIonViewWillEnter(() => {
        (async () => {
            await loadNotes();
        })();
    });

    useEffect(() => {
        (async () => {
            await loadNotes();
        })();
    }, [segment]);


    /** ========== Helper Functions ========== */
    const showToast = (message: string, color: "success" | "danger" = "success") =>
        setToast({ show: true, message, color });

    const fetchNotesBySegment = async () => {
        switch (segment) {
            case "pinned":
                return noteApi.getPinnedNotes();
            case "archived":
                return noteApi.getArchivedNotes();
            case "completed":
                return noteApi.getCompletedNotes();
            default:
                return { data: [] };
        }
    };

    /** ========== Load Notes ========== */
    const loadNotes = async () => {
        try {
            setLoading(true);
            console.log("🔄 Loading notes for segment:", segment);
            const res = await fetchNotesBySegment();
            console.log("✅ Notes loaded:", res.data);
            setNotes(res.data || []);
        } catch (err) {
            console.error("❌ Error loading notes:", err);
            const msg =
                err instanceof Error ? err.message : "Không thể tải danh sách notes";
            showToast(msg, "danger");
        } finally {
            setLoading(false);
        }
    };

    /** ========== Handlers ========== */
    const handleRefresh = async (e: CustomEvent) => {
        await loadNotes();
        e.detail.complete();
    };

    const handleDelete = (id: number) => {
        setDeleteAlert({ show: true, noteId: id });
    };

    const confirmDelete = async () => {
        try {
            await noteApi.deleteNote(deleteAlert.noteId);
            showToast("Xóa note thành công!");
            await loadNotes();
        } catch (err) {
            showToast(
                err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa",
                "danger"
            );
        } finally {
            setDeleteAlert({ show: false, noteId: 0 });
        }
    };

    const handleTogglePin = async (id: number) => {
        try {
            await noteApi.togglePinNote(id);
            showToast("Đã cập nhật trạng thái ghim");
            await loadNotes();
        } catch (err) {
            showToast("Có lỗi xảy ra khi cập nhật ghim", "danger");
        }
    };

    const handleToggleArchive = async (id: number) => {
        try {
            await noteApi.toggleArchiveNote(id);
            showToast("Đã cập nhật trạng thái lưu trữ");
            await loadNotes();
        } catch (err) {
            showToast("Có lỗi xảy ra khi cập nhật lưu trữ", "danger");
        }
    };

    const handleToggleStatus = async (id: number) => {
        const note = notes.find((n) => n.id === id);
        if (!note) return;

        const newStatus = !note.isCompleted;
        try {
            await noteService.updateNoteStatus(id, newStatus);
            showToast(
                newStatus
                    ? "Note đã được chuyển sang mục hoàn thành!"
                    : "Note đã được chuyển lại danh sách chính!"
            );
            setNotes((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            showToast("Có lỗi xảy ra khi cập nhật trạng thái", "danger");
        }
    };

    const handleEdit = (id: number) => history.push(`/notes/edit/${id}`);

    /** ========== Render ========== */
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Danh Sách Notes</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment
                        value={segment}
                        onIonChange={(e) => setSegment(e.detail.value as any)}
                    >
                        <IonSegmentButton value="pinned">
                            <IonLabel>Đã ghim</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="archived">
                            <IonLabel>Lưu trữ</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="completed">
                            <IonLabel>Hoàn thành</IonLabel>
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
                                <p className="empty-state-hint">
                                    Nhấn nút + để tạo note mới
                                </p>
                            </div>
                        ) : (
                            <IonGrid>
                                <IonRow>
                                    {notes.map((note) => (
                                        <IonCol size="12" sizeMd="6" sizeLg="4" key={note.id}>
                                            <NoteCard
                                                note={note}
                                                onDelete={handleDelete}
                                                onEdit={handleEdit}
                                                onTogglePin={handleTogglePin}
                                                onToggleArchive={handleToggleArchive}
                                                onToggleStatus={handleToggleStatus}
                                            />
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </IonGrid>
                        )}
                    </div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push("/notes/create")}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <IonToast
                    isOpen={toast.show}
                    onDidDismiss={() => setToast({ ...toast, show: false })}
                    message={toast.message}
                    duration={2000}
                    color={toast.color}
                />

                <IonAlert
                    isOpen={deleteAlert.show}
                    onDidDismiss={() => setDeleteAlert({ show: false, noteId: 0 })}
                    header="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa note này không?"
                    buttons={[
                        {
                            text: "Hủy",
                            role: "cancel",
                        },
                        {
                            text: "Xóa",
                            handler: confirmDelete,
                        },
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default NoteList;
