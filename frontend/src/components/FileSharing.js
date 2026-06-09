import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiDownload, FiX } from 'react-icons/fi';
import { fileAPI } from '../utils/api';
import './FileSharing.css';

function FileSharing({ socket, roomId, userName }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    setError('');

    for (let file of selectedFiles) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileData = {
            fileName: file.name,
            fileSize: file.size,
            data: e.target.result.split(',')[1]
          };

          const response = await fileAPI.upload(fileData);

          const sharedFile = {
            id: response.data.fileId,
            name: file.name,
            size: file.size,
            uploadedBy: userName,
            timestamp: new Date(),
            downloadUrl: response.data.downloadUrl
          };

          setFiles(prev => [...prev, sharedFile]);

          socket?.emit('file-shared', {
            roomId,
            fileName: file.name,
            fileSize: file.size,
            senderName: userName,
            downloadUrl: response.data.downloadUrl
          });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
  };

  const downloadFile = (downloadUrl) => {
    window.open(downloadUrl, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-sharing-container">
      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          className="upload-box"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            fileInputRef.current.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInputRef.current });
          }}
        >
          <FiUploadCloud size={40} />
          <h3>Drop files here or click to select</h3>
          <p>Drag and drop files to share with others</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Select Files'}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {files.length > 0 && (
        <div className="files-list">
          <h3>Shared Files ({files.length})</h3>
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <p className="file-meta">
                  {formatFileSize(file.size)} • {file.uploadedBy}
                </p>
              </div>
              <button
                onClick={() => downloadFile(file.downloadUrl)}
                className="download-btn"
                title="Download file"
              >
                <FiDownload size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileSharing;
