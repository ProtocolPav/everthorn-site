'use client';

import { CaptionPlugin } from '@platejs/caption/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@platejs/media/react';
import { KEYS } from 'platejs';

import { AudioElement } from '@/components/ui/media-audio-node';
import { MediaEmbedElement } from '@/components/ui/media-embed-node';
import { FileElement } from '@/components/ui/media-file-node';
import { ImageElement } from '@/components/ui/media-image-node';
import { PlaceholderElement } from '@/components/ui/media-placeholder-node';
import { MediaPreviewDialog } from '@/components/ui/media-preview-dialog';
import { MediaUploadToast } from '@/components/ui/media-upload-toast';
import { VideoElement } from '@/components/ui/media-video-node';

export const MediaKit = [
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: { afterEditable: MediaPreviewDialog, node: ImageElement },
  }),
  MediaEmbedPlugin.withComponent(MediaEmbedElement),
  VideoPlugin.withComponent(VideoElement),
  AudioPlugin.withComponent(AudioElement),
  FilePlugin.withComponent(FileElement),
  PlaceholderPlugin.configure({
    options: {
      disableEmptyPlaceholder: true,
      // Remove the default 4MB image / 8-16MB media caps from Plate's
      // upload validation so the wiki editor is only limited by the storage
      // backend (R2 presigned PUT), not the client.
      uploadConfig: {
        image: { mediaType: KEYS.img, maxFileSize: '1GB' },
        video: { mediaType: KEYS.video, maxFileSize: '1GB' },
        audio: { mediaType: KEYS.audio, maxFileSize: '1GB' },
        blob: { mediaType: KEYS.file, maxFileSize: '1GB' },
        pdf: { mediaType: KEYS.file, maxFileSize: '1GB' },
        text: { mediaType: KEYS.file, maxFileSize: '1GB' },
      },
    },
    render: { afterEditable: MediaUploadToast, node: PlaceholderElement },
  }),
  CaptionPlugin.configure({
    options: {
      query: {
        allow: [KEYS.img, KEYS.video, KEYS.audio, KEYS.file, KEYS.mediaEmbed],
      },
    },
  }),
];
