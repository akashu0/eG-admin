"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, X, Download, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Brochure } from '@/type/courseForm';

interface BrochureSectionProps {
  data?: Brochure[];
  onSave: (data?: Brochure) => void;
  onNext: () => void;
}

export function BrochureSection({
  data,
  onSave,
  onNext,
}: BrochureSectionProps) {
  const [brochure, setBrochure] = useState<Brochure | undefined>(data?.[0]);
  const [isUploading, setIsUploading] = useState(false);
  const { handleSubmit } = useForm();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/brochure', {
        method: 'POST',
        body: formData,
      });

      const uploadedFile = await response.json();

      setBrochure({
        fileName: file.name,
        fileUrl: uploadedFile.url,
        fileSize: file.size,
        title: file.name,
        description: file.name,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeBrochure = () => {
    setBrochure(undefined);
  };

  const onSubmit = () => {
    onSave(brochure);
    onNext();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-gray-900" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course Brochure</h2>
            <p className="text-sm text-gray-600">Optional: Upload a detailed course brochure (PDF, DOC, DOCX)</p>
          </div>
        </div>

        <div className="space-y-4">
          {brochure ? (
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FileText className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{brochure?.fileName}</h3>
                    {/* <p className="text-sm text-gray-600 mt-1">
                      {formatFileSize(brochure?.fileSize)}  
                    </p> */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(brochure.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeBrochure}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
              `}
            >
              <input {...getInputProps()} disabled={isUploading} />
              {isUploading ? (
                <Loader2 className="h-12 w-12 mx-auto text-gray-400 animate-spin mb-4" />
              ) : (
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              )}
              <p className="text-gray-600 mb-2">
                {isUploading
                  ? 'Uploading...'
                  : isDragActive
                    ? 'Drop the file here'
                    : 'Drag & drop a brochure, or click to select'}
              </p>
              <p className="text-sm text-gray-400">
                Supports: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-6 border-t">

        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}