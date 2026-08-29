import * as React from 'react';

import { useGetPresignedUploadUrlV1ImagesPresignPost } from '@/api/nexuscore/images/images.ts';

export interface R2UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
  key?: string;
}

/**
 * Uploads files directly to R2 via the presigned-PUT flow, instead of
 * uploadThing. Reports progress through XMLHttpRequest so the media
 * placeholder can show a real percentage.
 */
export function useR2UploadFile() {
  const [uploadedFile, setUploadedFile] = React.useState<R2UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const presignMutation = useGetPresignedUploadUrlV1ImagesPresignPost();

  const uploadFile = React.useCallback(
    async (file: File): Promise<R2UploadedFile> => {
      setIsUploading(true);
      setUploadingFile(file);
      setProgress(0);

      try {
        const { upload_url, public_url } =
          await presignMutation.mutateAsync({
            data: {
              filename: file.name,
              content_type: file.type as never,
            },
          });

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', upload_url);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded / event.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`R2 upload failed (${xhr.status})`));
          };
          xhr.onerror = () => reject(new Error('R2 upload network error'));
          xhr.send(file);
        });

        const result: R2UploadedFile = {
          url: public_url,
          name: file.name,
          size: file.size,
          type: file.type,
        };

        setUploadedFile(result);

        return result;
      } finally {
        setIsUploading(false);
        setUploadingFile(undefined);
      }
    },
    [presignMutation]
  );

  return { isUploading, progress, uploadedFile, uploadFile, uploadingFile };
}
