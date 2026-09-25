import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocumentsForEntity,
  uploadDocumentThunk,
  deleteDocumentThunk,
} from "../../features/documents/documentSlice";

const fileIcon = (fileType) => {
  if (fileType?.startsWith("image/")) return "🖼️";
  if (fileType === "application/pdf") return "📄";
  return "📎";
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

// Drop this component into any detail view (Procurement, SiteProgress, etc.)
// Props: projectId, entityType (e.g. "Procurement"), entityId
const AttachmentsPanel = ({ projectId, entityType, entityId }) => {
  const dispatch = useDispatch();
  const { items, uploading, status } = useSelector((state) => state.documents);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (entityType && entityId) {
      dispatch(fetchDocumentsForEntity({ entityType, entityId }));
    }
  }, [dispatch, entityType, entityId]);

  const handleFileSelected = (file) => {
    if (!file) return;
    dispatch(uploadDocumentThunk({ file, projectId, entityType, entityId }));
  };

  const handleInputChange = (event) => {
    handleFileSelected(event.target.files[0]);
    event.target.value = null;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFileSelected(event.dataTransfer.files[0]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this attachment?")) {
      dispatch(deleteDocumentThunk(id));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Attachments</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mb-4 flex items-center justify-center rounded-xl border-2 border-dashed p-6 text-center text-xs text-gray-500 transition ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-200"
        }`}
      >
        Drag & drop a file here, or use the Upload button above
      </div>

      {status === "loading" && (
        <p className="text-sm text-gray-500">Loading attachments...</p>
      )}

      {status !== "loading" && items.length === 0 && (
        <p className="text-sm text-gray-500">No attachments yet.</p>
      )}

      <div className="space-y-2">
        {items.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
          >
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-2 text-blue-600 hover:underline"
            >
              <span>{fileIcon(doc.fileType)}</span>
              <span className="truncate">{doc.fileName}</span>
              <span className="flex-shrink-0 text-xs text-gray-400">
                {formatSize(doc.fileSize)}
              </span>
            </a>
            <button
              type="button"
              onClick={() => handleDelete(doc._id)}
              className="ml-2 flex-shrink-0 text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsPanel;
