/**
 * Utility for uploading form attachments, documents, and images
 * to their respective dedicated storage buckets via /api/upload.
 */

export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
  storage: 'supabase' | 'local';
}

export async function uploadFileToBucket(
  file: File | Blob | string,
  bucket: string = 'documents',
  customFilename?: string
): Promise<UploadResult> {
  let fileBase64 = '';
  let filename = customFilename || `file_${Date.now()}`;
  let contentType = 'application/octet-stream';

  if (typeof file === 'string') {
    fileBase64 = file;
    if (file.startsWith('data:')) {
      const match = file.match(/^data:([^;]+);base64,/);
      if (match) contentType = match[1];
    }
  } else if (file instanceof File || file instanceof Blob) {
    if (file instanceof File) {
      filename = customFilename || file.name;
    }
    contentType = file.type || 'application/octet-stream';
    fileBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileBase64,
      filename,
      contentType,
      bucket
    })
  });

  if (!res.ok) {
    throw new Error(`Bucket upload failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Upload error');
  }

  return {
    url: data.url,
    path: data.path,
    bucket: data.bucket || bucket,
    storage: data.storage || 'local'
  };
}
