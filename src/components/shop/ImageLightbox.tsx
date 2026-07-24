'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

type Props = {
  images: string[];
  alt: string;
  initialIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function ImageLightbox({ images, alt, initialIndex, onIndexChange, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  function goTo(next: number) {
    const wrapped = (next + images.length) % images.length;
    setIndex(wrapped);
    onIndexChange(wrapped);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goTo(index - 1);
      else if (e.key === 'ArrowRight') goTo(index + 1);
      else if (e.key === '+' || e.key === '=') setScale((s) => Math.min(MAX_SCALE, s + 0.5));
      else if (e.key === '-') setScale((s) => Math.max(MIN_SCALE, s - 0.5));
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s - e.deltaY * 0.002)));
  }

  function handleDoubleClick() {
    setScale((s) => (s > 1 ? 1 : 2.5));
    setOffset({ x: 0, y: 0 });
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (scale <= 1) return;
    dragState.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    setOffset({
      x: dragState.current.originX + (e.clientX - dragState.current.startX),
      y: dragState.current.originY + (e.clientY - dragState.current.startY),
    });
  }
  function handlePointerUp() {
    dragState.current = null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/95" onClick={onClose}>
      <div className="flex items-center justify-between px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm text-white/60">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(MIN_SCALE, s - 0.5))}
            aria-label="Zoom out"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-lg text-white hover:bg-white/10"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(MAX_SCALE, s + 0.5))}
            aria-label="Zoom in"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-lg text-white hover:bg-white/10"
          >
            +
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-lg text-white hover:bg-white/10"
          >
            ×
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden touch-none select-none"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="h-full w-full"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragState.current ? 'none' : 'transform 0.2s ease-out',
            cursor: scale > 1 ? 'grab' : 'zoom-in',
          }}
        >
          <Image src={images[index]} alt={alt} fill sizes="100vw" className="object-contain" priority />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              aria-label="Previous image"
              className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index + 1);
              }}
              aria-label="Next image"
              className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            >
              ›
            </button>
          </>
        )}
      </div>

      <p className="pb-4 text-center text-xs text-white/40">
        Scroll or +/− to zoom · drag to pan · arrow keys to switch · Esc to close
      </p>
    </div>
  );
}
