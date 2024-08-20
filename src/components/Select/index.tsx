'use client'

import './style.scss';
import { useEffect, useRef, useState } from 'react';

interface SelectItem {
  text: string
  value: string
}

interface Props {
  items: SelectItem[]
  value?: string
  onChange?: (value: string) => void
}

export default function JSelect({ items, value, onChange }: Props) {
  const [contentVisible, setContentVisible] = useState(false);
  const ref = useRef<any>();

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as any)) {
        setContentVisible(false);
      }
    }

    window.addEventListener('click', clickListener);
    return () => window.removeEventListener('click', clickListener);
  }, []);

  const ItemClick = (item: SelectItem) => {
    onChange && onChange(item.value);
    setContentVisible(false);
  }

  const currentText = items.find(it => it.value === value)?.text || 'Select';

  return (
    <div className="j-select" ref={ref}>
      <div className="select-view" onClick={() => setContentVisible(v => !v)}>{currentText}</div>
      <div className="select-content" data-visible={contentVisible}>
        {items.map((it, index) => (
          <button key={index} className="select-item" onClick={() => ItemClick(it)}>{it.text}</button>
        ))}
      </div>
    </div>
  )
}