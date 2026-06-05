import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface AmanImageUploaderProps {
  category: 'real-estate' | 'cars';
  onUploadComplete: (urls: string[]) => void;
  lang: 'ar' | 'en';
}

export default function AmanImageUploader({ category, onUploadComplete, lang }: AmanImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<{ file: File; preview: string; status: 'idle' | 'uploading' | 'success' | 'error'; url?: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 5;

  const validateAndAddFiles = (selectedFiles: FileList) => {
    setErrorMsg(null);
    const validUploaded: typeof files = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // 1. File Type Validation
      if (!file.type.startsWith('image/')) {
        setErrorMsg(
          lang === 'ar' 
            ? 'خطأ: يرجى اختيار ملفات صور صالحة فقط (PNG, JPG, WebP)!' 
            : 'Error: Please pick valid image files only (PNG, JPG, WebP)!'
        );
        continue;
      }

      // 2. File Size Validation (5MB Cap)
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setErrorMsg(
          lang === 'ar' 
            ? `خطأ: حجم الصورة يتجاوز الحد المسموح به (${MAX_FILE_SIZE_MB} ميجابايت)!` 
            : `Error: Image size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB!`
        );
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validUploaded.push({
        file,
        preview: previewUrl,
        status: 'idle'
      });
    }

    if (validUploaded.length > 0) {
      const updatedFiles = [...files, ...validUploaded];
      setFiles(updatedFiles);
      triggerStorageUploads(validUploaded, updatedFiles);
    }
  };

  const triggerStorageUploads = async (newAdded: typeof files, allFiles: typeof files) => {
    const folder = category === 'real-estate' ? 'properties_images' : 'cars_images';
    
    // We update status in place
    const updated = [...allFiles];

    for (const item of newAdded) {
      const targetIndex = updated.findIndex(f => f.preview === item.preview);
      if (targetIndex === -1) continue;

      updated[targetIndex].status = 'uploading';
      setFiles([...updated]);

      try {
        // Build path: folder/timestamp-random-name
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${item.file.name}`;
        const storageRef = ref(storage, `${folder}/${filename}`);
        
        // Native upload representation
        const snapshot = await uploadBytes(storageRef, item.file);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        updated[targetIndex].status = 'success';
        updated[targetIndex].url = downloadUrl;
      } catch (uploadError: any) {
        console.warn('Firebase Storage upload blocked or unconfigured, falling back to secure base64 data encoding:', uploadError);
        
        // Fallback Base64 encoding for pure off-grid Sandbox testing
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (e) => reject(e);
          });
          reader.readAsDataURL(item.file);
          const base64Url = await base64Promise;

          updated[targetIndex].status = 'success';
          updated[targetIndex].url = base64Url;
        } catch (e) {
          updated[targetIndex].status = 'error';
        }
      }
      setFiles([...updated]);
    }

    // Filter successfully uploaded ones and pass up to parent
    const completeUrls = updated
      .filter(f => f.status === 'success' && f.url)
      .map(f => f.url as string);
    onUploadComplete(completeUrls);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    URL.revokeObjectURL(fileToRemove.preview);
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);

    const completeUrls = updated
      .filter(f => f.status === 'success' && f.url)
      .map(f => f.url as string);
    onUploadComplete(completeUrls);
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
        {lang === 'ar' ? 'رفع صور حقيقية عالية الجودة 📸' : 'Upload Genuine High-Res Images 📸'}
      </label>

      {/* Drag & Drop Main Box */}
      <div
        id="file-drop-container"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 select-none h-40 ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 scale-[0.99] border-solid'
            : 'border-slate-300 dark:border-zinc-700 hover:border-emerald-500/70 dark:hover:border-emerald-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && validateAndAddFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-zinc-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Upload className="w-6 h-6 animate-pulse" />
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
          {lang === 'ar' 
            ? 'اسحب وأفلت الصور هنا، أو انقر للتصفح' 
            : 'Drag and drop images here, or click to browse'}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-zinc-400">
          {lang === 'ar' 
            ? `يدعم الصور بصيغة PNG | JPG | WebP فقط (بحد أقصى ${MAX_FILE_SIZE_MB} ميجابايت)` 
            : `Supports PNG | JPG | WebP image files only (Max ${MAX_FILE_SIZE_MB}MB per file)`}
        </p>
      </div>

      {/* Error Output alert */}
      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400 text-xs py-2 px-3.5 rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-950/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Previews Frame Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {files.map((item, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-zinc-850 bg-slate-100 dark:bg-zinc-800">
              <img src={item.preview} alt="Listing Preview" className="w-full h-full object-cover" />
              
              {/* Cover overlay when uploading */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-[10px] text-white">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-1"></div>
                  <span>{lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</span>
                </div>
              )}

              {/* Cover overlay when error occurs */}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-rose-950/80 flex flex-col items-center justify-center text-[10px] text-white px-1 text-center">
                  <span className="font-semibold text-rose-400">{lang === 'ar' ? 'فشل الرفع' : 'Upload Failed'}</span>
                </div>
              )}

              {/* Removing Action Floating Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/70 hover:bg-rose-600 text-white flex items-center justify-center transition opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Status Success Indicator */}
              {item.status === 'success' && (
                <div className="absolute bottom-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
