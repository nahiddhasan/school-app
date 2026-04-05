// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { UploadCloud } from "lucide-react";
// import React, { useRef, useState } from "react";

// interface DropzoneProps {
//   onChange: React.Dispatch<React.SetStateAction<File | undefined>>;
//   className?: string;
//   fileExtension?: string;
// }

// export function Dropzone({
//   onChange,
//   className = "",
//   fileExtension,
//   ...props
// }: DropzoneProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [fileInfo, setFileInfo] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const { files } = e.dataTransfer;
//     handleFiles(files);
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { files } = e.target;
//     if (files) handleFiles(files);
//   };

//   const handleFiles = (files: FileList) => {
//     const uploadedFile = files[0];
//     if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
//       setError(`Invalid file type. Expected: .${fileExtension}`);
//       return;
//     }

//     const fileSizeInKB = Math.round(uploadedFile.size / 1024);
//     onChange(uploadedFile);

//     setFileInfo(`Uploaded: ${uploadedFile.name} (${fileSizeInKB} KB)`);
//     setError(null);
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <Card
//       onClick={handleButtonClick}
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//       className={`group border-2 border-dashed border-muted-foreground/40 hover:border-primary/60 bg-muted text-center transition duration-300 cursor-pointer w-full mx-auto ${className}`}
//       {...props}
//     >
//       <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
//         <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-primary transition duration-300" />
//         <div className="text-sm text-muted-foreground">
//           <p>
//             <span className="font-medium">Drag and drop</span> a file here, or
//           </p>
//           <Button
//             variant="ghost"
//             size="sm"
//             type="button"
//             onClick={handleButtonClick}
//             className="mt-1 text-xs"
//           >
//             Browse Files
//           </Button>
//         </div>

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept={fileExtension ? `.${fileExtension}` : undefined}
//           onChange={handleFileInputChange}
//           className="hidden"
//         />

//         {fileInfo && (
//           <p className="text-xs text-muted-foreground text-center">
//             {fileInfo}
//           </p>
//         )}
//         {error && <span className="text-xs text-red-500">{error}</span>}
//       </CardContent>
//     </Card>
//   );
// }

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import React, { useRef, useState } from "react";

interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<File[]>>;
  className?: string;
  fileExtension?: string; // e.g., 'jpg' or 'png'
  multiple?: boolean;
  maxFiles?: number; // Max number of files allowed
}

export function Dropzone({
  onChange,
  className = "",
  fileExtension,
  multiple = false,
  maxFiles = 5,
  ...props
}: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInfos, setFileInfos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);

    if (fileExtension) {
      const invalidFiles = fileArray.filter(
        (file) => !file.name.endsWith(`.${fileExtension}`)
      );
      if (invalidFiles.length > 0) {
        setError(`Invalid file(s). Only .${fileExtension} allowed.`);
        return;
      }
    }

    if (fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed.`);
      return;
    }

    const fileNames = fileArray.map(
      (file) => `${file.name} (${Math.round(file.size / 1024)} KB)`
    );

    onChange(fileArray);
    setFileInfos(fileNames);
    setError(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      onClick={handleButtonClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`group border-2 border-dashed border-muted-foreground/40 hover:border-primary/60 bg-muted text-center transition duration-300 cursor-pointer w-full mx-auto ${className}`}
      {...props}
    >
      <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
        <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-primary transition duration-300" />
        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Drag and drop</span> file
            {multiple ? "s" : ""} here, or
          </p>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleButtonClick}
            className="mt-1 text-xs"
          >
            Browse Files
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={fileExtension ? `.${fileExtension}` : undefined}
          onChange={handleFileInputChange}
          className="hidden"
          multiple={multiple}
        />

        {fileInfos.length > 0 && (
          <div className="text-xs text-muted-foreground text-center space-y-1">
            {fileInfos.map((info, idx) => (
              <p key={idx}>{info}</p>
            ))}
          </div>
        )}

        {error && <span className="text-xs text-red-500">{error}</span>}
      </CardContent>
    </Card>
  );
}
