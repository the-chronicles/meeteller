"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLAttributes, ReactNode } from "react";

type SortableWidgetProps = {
  id: string;
  children: (args: {
    attributes: HTMLAttributes<HTMLElement>;
    listeners: HTMLAttributes<HTMLElement>;
  }) => ReactNode;
};

export function SortableWidget({ id, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}
