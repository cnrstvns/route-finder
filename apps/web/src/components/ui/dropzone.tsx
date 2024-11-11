'use client';
import type { FileRouter } from '@/app/api/uploadthing/lib';
import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { faUpload } from '@fortawesome/pro-regular-svg-icons/faUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  UploadFileResponse,
  generateClientDropzoneAccept,
} from 'uploadthing/client';
import { inferEndpointOutput } from 'uploadthing/server';

type DropzoneProps = {
  endpoint: keyof FileRouter;
  onUploadComplete: (
    res: UploadFileResponse<
      inferEndpointOutput<FileRouter[keyof FileRouter]>
    >[],
  ) => void;
};

const Dropzone = ({ endpoint, onUploadComplete }: DropzoneProps) => {
  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    endpoint,
    {
      onClientUploadComplete: (f) => {
        toast.success('File uploaded successfully');
        onUploadComplete(f);
      },
      onUploadError: () => {
        toast.error('Error uploading file. Please try again later.');
      },
    },
  );

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      className="w-full border group rounded hover:dark:border-zinc-600 dark:border-zinc-700 h-32 flex items-center justify-center border-dashed"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col space-y-3 items-center">
        <FontAwesomeIcon
          icon={isUploading ? faSpinnerThird : faUpload}
          className={cn(
            'h-8 w-8 dark:text-zinc-500 group-hover:dark:text-zinc-400',
            {
              'fa-spin': isUploading,
            },
          )}
        />
        <div className="dark:text-zinc-400 text-sm">
          {isUploading ? 'Uploading...' : 'Upload a file'}
        </div>
      </div>
    </div>
  );
};
Dropzone.displayName = 'Dropzone';

export { Dropzone };
