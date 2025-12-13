"use client";

import React from "react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const modules = {
    toolbar: true, // enable all default tools (bold, image, lists, etc.)
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <ReactQuill
        value={content}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="prose max-w-none"
        style={{ minHeight }}
      />
    </div>
  );
}
