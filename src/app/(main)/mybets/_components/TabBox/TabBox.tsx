'use client'

import './style.scss';
import { ReactNode } from 'react';
import TabButton from './TabButton';

interface Props {
  tabs: {
    title: string
    widget: ReactNode
    badgeText?: string
  }[]
  selectedId: number
  setSelectedId: (id: number) => void
}

export default function TabBox({ tabs, selectedId, setSelectedId }: Props) {
  return (
    <div className="tab-box">
      <div className="tab-top-part">
        {tabs.map((t, index) => <TabButton key={index} title={t.title} selected={selectedId === index} badgeText={t.badgeText} onClick={() => setSelectedId(index)} />)}
      </div>
      <div className="tab-body">
        {tabs[selectedId].widget}
      </div>
    </div>
  )
}