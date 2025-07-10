import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Trash2, 
  Eye,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  category: string;
}

interface FileUploaderProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesUploaded
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fileCategories = {
    'POD': ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    'Invoice': ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
    'Manifest': ['application/pdf', 'text/csv', 'application/json'],
    'Permit': ['application/pdf', 'image/jpeg', 'image/png'],
    'Insurance': ['application/pdf', 'image/jpeg', 'image/png'],
    'Other': ['*']
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getFileCategory = (type: string): string => {
    for (const [category, types] of Object.entries(fileCategories)) {
      if (types.includes(type) || types.includes('*')) {
        return category;
      }
    }
    return 'Other';
  };

  const simulateUpload = (file: UploadedFile): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, uploadProgress: 100, status: 'completed', url: `#file-${file.id}` }
                : f
            )
          );
          resolve();
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, uploadProgress: progress }
                : f
            )
          );
        }
      }, 200);
    });
  };

  const handleFiles = async (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading' as const,
      category: getFileCategory(file.type)
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload for each file
    for (const file of newFiles) {
      try {
        await simulateUpload(file);
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error' }
              : f
          )
        );
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    if (onFilesUploaded) {
      onFilesUploaded(uploadedFiles.filter(f => f.status === 'completed'));
    }
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = () => {
    if (fileInputRef.current?.files) {
      handleFiles(fileInputRef.current.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Removed",
      description: "File removed from upload queue",
    });
  };

  const downloadFile = (file: UploadedFile) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    });
  };

  const previewFile = (file: UploadedFile) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${file.name}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-truck-online" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'POD': 'bg-truck-online text-white',
      'Invoice': 'bg-primary text-white',
      'Manifest': 'bg-truck-delayed text-white',
      'Permit': 'bg-purple-500 text-white',
      'Insurance': 'bg-blue-500 text-white',
      'Other': 'bg-muted text-muted-foreground'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Document Upload Center
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
            hover:border-primary hover:bg-primary/5 cursor-pointer
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {dragActive ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="text-xs text-muted-foreground">
            Supported: PDF, Images, CSV, Excel files (Max 10MB per file)
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
        />

        {/* File Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Document Categories</Label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(fileCategories).map(category => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Uploaded Files ({uploadedFiles.length})
            </Label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20"
                >
                  <div className="text-muted-foreground">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <Badge className={`text-xs ${getCategoryColor(file.category)}`}>
                        {file.category}
                      </Badge>
                      {getStatusIcon(file.status)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.type}</span>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <Progress value={file.uploadProgress} className="mt-2 h-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {file.status === 'completed' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => previewFile(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFile(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;