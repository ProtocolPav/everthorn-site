'use client';

import * as React from 'react';

import type { PlateElementProps } from 'platejs/react';

import { type VariantProps, cva } from 'class-variance-authority';
import { PlateElement } from 'platejs/react';

const headingVariants = cva(
  'relative mb-1 data-[nav-target=true]:rounded-md data-[nav-target=true]:bg-(--color-highlight)',
  {
    variants: {
      variant: {
        h1: 'mt-[0.9em] mb-[0.28em] pb-1 font-almendra font-semibold text-[1.75rem] tracking-tight [word-spacing:0.1em]',
        h2: 'mt-[0.8em] mb-[0.28em] pb-px font-almendra font-semibold text-[1.4rem] tracking-tight [word-spacing:0.1em]',
        h3: 'mt-[0.7em] mb-[0.28em] pb-px font-almendra font-semibold text-[1.2rem] tracking-tight [word-spacing:0.1em]',
        h4: 'mt-[0.6em] mb-[0.28em] font-almendra font-semibold text-lg tracking-tight [word-spacing:0.1em]',
        h5: 'mt-[0.6em] mb-[0.28em] font-almendra font-semibold text-base tracking-tight [word-spacing:0.1em]',
        h6: 'mt-[0.6em] mb-[0.28em] font-almendra font-semibold text-base tracking-tight [word-spacing:0.1em]',
      },
    },
  }
);

export function HeadingElement({
  variant = 'h1',
  ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
  return (
    <PlateElement
      as={variant!}
      className={headingVariants({ variant })}
      {...props}
    >
      {props.children}
    </PlateElement>
  );
}

export function H1Element(props: PlateElementProps) {
  return <HeadingElement variant="h1" {...props} />;
}

export function H2Element(props: PlateElementProps) {
  return <HeadingElement variant="h2" {...props} />;
}

export function H3Element(props: PlateElementProps) {
  return <HeadingElement variant="h3" {...props} />;
}

export function H4Element(props: PlateElementProps) {
  return <HeadingElement variant="h4" {...props} />;
}

export function H5Element(props: PlateElementProps) {
  return <HeadingElement variant="h5" {...props} />;
}

export function H6Element(props: PlateElementProps) {
  return <HeadingElement variant="h6" {...props} />;
}
