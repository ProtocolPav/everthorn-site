'use client';

import { LinkRules, upsertLink, validateUrl } from '@platejs/link';
import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/components/ui/link-node';
import { LinkFloatingToolbar } from '@/components/ui/link-toolbar';

/**
 * Extract a URL from pasted clipboard data. Handles both a plain-text URL and
 * an HTML anchor (e.g. copying a link from a webpage).
 */
function getPastedUrl(data: DataTransfer, editor: Parameters<typeof validateUrl>[0]): string | null {
  const text = data.getData('text/plain')?.trim();
  if (text && validateUrl(editor, text)) return text;

  const html = data.getData('text/html');
  if (html) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const href = doc.querySelector('a[href]')?.getAttribute('href');
      if (href) return href;
    } catch {
      // ignore malformed html
    }
  }
  return null;
}

export const LinkKit = [
  LinkPlugin.configure({
    inputRules: [
      LinkRules.markdown(),
      LinkRules.autolink({ variant: 'paste' }),
      LinkRules.autolink({ variant: 'space' }),
      LinkRules.autolink({ variant: 'break' }),
    ],
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }).overrideEditor(({ editor, tf: { insertData: baseInsertData } }) => ({
    transforms: {
      insertData(data) {
        // Selecting text and pasting a link should wrap that text in a link
        // (preserving the selected text) rather than replacing it.
        if (editor.selection && !editor.api.isCollapsed()) {
          const url = getPastedUrl(data, editor);
          if (url) {
            upsertLink(editor, { url, skipValidation: true });
            return;
          }
        }
        baseInsertData(data);
      },
    },
  })),
];
