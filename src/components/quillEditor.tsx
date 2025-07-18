"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Access Quill instance used by react-quill
const Quill = typeof window === "object" ? require("react-quill").Quill : null;

if (Quill && typeof Quill.register === "function") {
  // Register the image resize module ONLY on client
  const ImageResize = require("quill-image-resize-module-react").default;
  Quill.register("modules/imageResize", ImageResize);
}

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const FullQuillEditor = ({ value, onChange }: Props) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      imageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
    />
  );
};

export default FullQuillEditor;
