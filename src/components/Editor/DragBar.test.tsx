import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DragBar from './DragBar';

describe('DragBar', () => {
  it('reports clientX minus the grab offset in row layout', () => {
    const onDrag = vi.fn();
    render(<DragBar layout="row" onDrag={onDrag} />);
    const bar = screen.getByRole('separator');
    fireEvent.pointerDown(bar, { clientX: 105, pointerId: 1 });
    fireEvent.pointerMove(bar, { clientX: 250, pointerId: 1 });
    expect(onDrag).toHaveBeenCalledWith(145);
  });

  it('drags along clientY in column layout', () => {
    const onDrag = vi.fn();
    render(<DragBar layout="column" onDrag={onDrag} />);
    const bar = screen.getByRole('separator');
    expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    fireEvent.pointerDown(bar, { clientY: 40, pointerId: 1 });
    fireEvent.pointerMove(bar, { clientY: 120, pointerId: 1 });
    expect(onDrag).toHaveBeenCalledWith(80);
  });

  it('stops reporting after pointer up', () => {
    const onDrag = vi.fn();
    render(<DragBar layout="row" onDrag={onDrag} />);
    const bar = screen.getByRole('separator');
    fireEvent.pointerDown(bar, { clientX: 10, pointerId: 1 });
    fireEvent.pointerMove(bar, { clientX: 60, pointerId: 1 });
    fireEvent.pointerUp(bar, { pointerId: 1 });
    fireEvent.pointerMove(bar, { clientX: 300, pointerId: 1 });
    expect(onDrag).toHaveBeenCalledTimes(1);
  });
});
