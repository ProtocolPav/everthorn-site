import { useState } from 'react'
import type { MediaGalleryBlock as MediaGalleryBlockType } from '@/api/nexuscore/model'
import { ImagesIcon, XIcon } from '@phosphor-icons/react'

interface MediaGalleryBlockProps {
    block: MediaGalleryBlockType
}

export function MediaGalleryBlock({ block }: MediaGalleryBlockProps) {
    const [lightbox, setLightbox] = useState<number | null>(null)

    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div className="mb-8 flex items-center gap-2.5">
                    <ImagesIcon className="w-6 h-6 text-primary" weight="duotone" />
                    <h2 className="text-2xl md:text-3xl font-bold">
                        {block.heading ?? 'Gallery'}
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {block.items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setLightbox(i)}
                            className="group relative aspect-video rounded-xl overflow-hidden border hover:border-primary/40 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <img
                                src={item.src}
                                alt={item.caption ?? `Gallery image ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs text-white font-medium">{item.caption}</p>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <XIcon className="w-5 h-5 text-white" weight="bold" />
                    </button>
                    <img
                        src={block.items[lightbox].src}
                        alt={block.items[lightbox].caption ?? ''}
                        className="max-w-full max-h-[85vh] rounded-lg object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {block.items[lightbox].caption && (
                        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80 bg-black/50 px-4 py-1.5 rounded-full">
                            {block.items[lightbox].caption}
                        </p>
                    )}
                </div>
            )}
        </section>
    )
}
