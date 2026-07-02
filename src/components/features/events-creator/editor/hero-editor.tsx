import { useState } from 'react';

export default function HeroEditor() {
  return (
    <div>
      <h1>Hero Editor</h1>
      <input placeholder={''} data-name="Image URL" />
      <input placeholder={''} data-name="Eyebrow" />
      <input placeholder={''} data-name="Tagline" />
    </div>
  );
}