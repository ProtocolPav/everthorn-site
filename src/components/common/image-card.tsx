import React from "react";
import clsx from "clsx";

type ImageCardProps = {
    src: string;
    alt?: string;
    children?: React.ReactNode;

    /** Tailwind size classes for the card */
    widthClassName?: string;
    heightClassName?: string;

    /** Tailwind padding classes for the inner content */
    contentClassName?: string;

    /** Extra classes */
    className?: string;

    /** Optional inline sizing fallback */
    style?: React.CSSProperties;
};

export function ImageCard({
                              src,
                              alt = "",
                              children,
                              widthClassName = "w-[292px]",
                              heightClassName = "h-[360px]",
                              contentClassName = "p-4",
                              className,
                              style,
                          }: ImageCardProps) {
    return (
        <div
            role="img"
            aria-label={alt}
            className={clsx(
                "relative overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat shrink-0",
                widthClassName,
                heightClassName,
                className
            )}
            style={{
                backgroundImage: `url(${src})`,
                ...style,
            }}
        >
            <div className={clsx("absolute inset-0 flex flex-col", contentClassName)}>
                {children}
            </div>
        </div>
    );
}