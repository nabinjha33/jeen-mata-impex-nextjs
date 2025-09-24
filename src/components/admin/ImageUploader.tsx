'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Trash2, GripVertical } from 'lucide-react';
import { Reorder } from "framer-motion";

interface ImageUploaderProps {
  files: string[];
  setFiles: (files: string[]) => void;
}

export default function ImageUploader({ files, setFiles }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Replace with actual file upload API
      // const { file_url } = await UploadFile({ file });
      
      // For now, create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      setFiles([...files, tempUrl]);
      
      console.log('File selected for upload:', file.name);
      // In a real implementation, you would upload the file to your server/cloud storage
    } catch (error) {
      console.error('Upload failed', error);
    }
    setIsUploading(false);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setFiles([...files, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };


  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
        />
        <Button type="button" onClick={handleAddUrl}>Add URL</Button>
        <Button asChild type="button" variant="outline">
          <label htmlFor="file-upload">
            <Upload className="mr-2 h-4 w-4" /> Upload
            <input 
              id="file-upload" 
              type="file" 
              className="sr-only" 
              onChange={handleFileChange} 
              disabled={isUploading}
              accept="image/*"
            />
          </label>
        </Button>
      </div>
      
      {isUploading && <p className="text-sm text-gray-600">Uploading...</p>}

      {/* Reorderable list with framer-motion */}
      <Reorder.Group axis="y" values={files} onReorder={setFiles}>
        <div className="space-y-2">
          {files.map((file, index) => (
            <Reorder.Item key={file} value={file}>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <GripVertical className="cursor-grab text-gray-400" />
                <img 
                  src={file} 
                  alt={`Image ${index + 1}`} 
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                  }}
                />
                <span className="flex-1 truncate text-sm">{file}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Reorder.Item>
          ))}
        </div>
      </Reorder.Group>

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Upload className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">No images added yet</p>
          <p className="text-sm">Upload files or add URLs to get started</p>
        </div>
      )}
    </div>
  );
}
