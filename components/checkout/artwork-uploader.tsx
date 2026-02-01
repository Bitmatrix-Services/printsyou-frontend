'use client';

import React, {FC, useState, useCallback, ChangeEvent, DragEvent} from 'react';
import axios from 'axios';
import Image from 'next/image';
import {MdOutlineFileDownload, MdClose} from 'react-icons/md';
import {FaFile} from 'react-icons/fa';
import {LinearProgressWithLabel} from '@components/globals/linear-progress-with-label.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';
const allowedImageTypes = ['jpeg', 'png', 'webp', 'gif', 'avif', 'svg+xml', 'jpg'];

export interface ArtworkFile {
  filename: string;
  fileType: string;
  fileKey: string;
}

interface ArtworkUploaderProps {
  files: ArtworkFile[];
  onFilesChange: (_files: ArtworkFile[]) => void;
  uploadId: string;
  uploadType?: 'CART' | 'QUOTE' | 'ORDER';
  disabled?: boolean;
  maxFiles?: number;
}

export const ArtworkUploader: FC<ArtworkUploaderProps> = ({
  files,
  onFilesChange,
  uploadId,
  uploadType = 'CART',
  disabled = false,
  maxFiles = 10
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (file: File): Promise<ArtworkFile | null> => {
    const data = {
      type: uploadType,
      fileName: file.name,
      id: uploadId
    };

    try {
      const res = await axios.get(`${API_BASE_URL}/s3/signedUrl`, {params: data});
      await axios.put(res.data.payload.url, file, {
        onUploadProgress: event => {
          const percent = Math.floor((event.loaded / (event.total as number)) * 100);
          setUploadProgress(percent);
        }
      });

      const uploadedFile = res.data.payload;
      if (uploadedFile?.url && uploadedFile?.objectKey) {
        return {
          filename: file.name,
          fileType: file.type.split('/').pop() || '',
          fileKey: uploadedFile.objectKey
        };
      }
      return null;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
      return null;
    }
  };

  const processFiles = async (fileList: FileList | File[]) => {
    if (disabled) return;
    setError('');

    const filesArray = Array.from(fileList);
    const remainingSlots = maxFiles - files.length;

    if (remainingSlots <= 0) {
      setError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const filesToProcess = filesArray.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const uploadedFile = await handleFileUpload(file);
      if (uploadedFile) {
        onFilesChange([...files, uploadedFile]);
      }
    }
    setUploadProgress(0);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      await processFiles(selectedFiles);
      e.target.value = '';
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        await processFiles(droppedFiles);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, disabled, maxFiles, onFilesChange]
  );

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onFilesChange(updatedFiles);
  };

  const isImageFile = (fileType: string) => {
    return allowedImageTypes.some(type => fileType.toLowerCase() === type);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-blue-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
        `}
      >
        <input
          id="artworkFileInput"
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={disabled || uploadProgress > 0}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="*/*"
        />

        <div className="flex flex-col items-center">
          <MdOutlineFileDownload className="w-10 h-10 text-blue-500 mb-3" />
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? 'Drop files here' : 'Drag & drop your artwork files here'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or click to browse ({files.length}/{maxFiles} files)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            We accept all formats. Vector files (.ai, .eps, .svg) are preferred.
          </p>
        </div>
      </div>

      {/* Upload progress */}
      {uploadProgress > 0 && (
        <div className="px-2">
          <LinearProgressWithLabel progress={uploadProgress} />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-600 px-2">{error}</p>}

      {/* Uploaded files list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={file.fileKey}
              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              {/* File preview */}
              {isImageFile(file.fileType) ? (
                <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                  <Image
                    className="object-cover w-full h-full"
                    width={48}
                    height={48}
                    src={`${ASSETS_SERVER_URL}${file.fileKey}`}
                    alt={file.filename}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                  <FaFile className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* File name */}
              <div className="flex-grow pl-3 min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate block">{file.filename}</span>
                <span className="text-xs text-gray-400 uppercase">{file.fileType}</span>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                disabled={disabled}
                className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
