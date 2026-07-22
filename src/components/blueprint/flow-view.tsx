'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, MiniMap, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

interface Stage {
  id: string; title: string; slug: string;
  decisions: Array<{ id: string; title: string }>;
}

export default function BlueprintFlow({ stages, completed, activeStage, onStageClick }: {
  stages: Stage[];
  completed: Set<string>;
  activeStage: string;
  onStageClick: (slug: string) => void;
}) {
  const nodes: Node[] = useMemo(() => {
    return stages.map((s, i) => {
      const total = s.decisions?.length || 0;
      const done = s.decisions?.filter((d: any) => completed.has(d.id)).length || 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const isActive = s.slug === activeStage;
      const isDone = pct === 100;

      return {
        id: s.slug,
        data: {
          label: (
            <div style={{ position: 'relative' }}>
              <Handle type="target" position={Position.Top} style={{ background: 'transparent', border: 'none' }} />
              <div style={{
                padding: '14px 20px',
                borderRadius: 0,
                background: isDone ? '#ecfdf5' : isActive ? 'var(--color-accent-light)' : 'var(--color-bg-primary)',
                border: isDone ? '2px solid #22c55e' : isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                minWidth: 200,
                maxWidth: 240,
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isDone ? '✅' : isActive ? '📍' : '⬜'} {s.title}
                </div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {Array.from({ length: Math.min(total, 10) }).map((_, j) => (
                    <div key={j} style={{
                      width: 10, height: 4,
                      background: j < done ? (isDone ? '#22c55e' : 'var(--color-accent)') : 'var(--color-border-light)',
                    }} />
                  ))}
                  {total > 10 && <span style={{ fontSize: 8, color: 'var(--color-text-tertiary)', marginLeft: 4 }}>+{total - 10}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: 'var(--color-text-tertiary)' }}>{done}/{total}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: isDone ? '#22c55e' : 'var(--color-accent)' }}>{pct}%</span>
                </div>
              </div>
              <Handle type="source" position={Position.Bottom} style={{ background: 'transparent', border: 'none' }} />
            </div>
          ),
        },
        position: { x: (i % 4) * 270, y: Math.floor(i / 4) * 200 },
        style: { background: 'transparent', border: 'none', padding: 0, width: 'auto', height: 'auto' },
        draggable: true,
      };
    });
  }, [stages, completed, activeStage]);

  const edges: Edge[] = useMemo(() => {
    return stages.slice(1).map((s, i) => ({
      id: `e-${i}`,
      source: stages[i].slug,
      target: s.slug,
      type: 'smoothstep',
      style: { stroke: 'var(--color-accent)', strokeWidth: 2, opacity: 0.6 },
      animated: true,
      markerEnd: { type: 'arrowclosed' as any, color: 'var(--color-accent)' },
    }));
  }, [stages]);

  const onNodeClick = useCallback((_event: any, node: Node) => {
    onStageClick(node.id);
  }, [onStageClick]);

  return (
    <div style={{ width: '100%', height: 600, background: 'var(--color-bg-secondary)', borderRadius: 0, border: '1px solid var(--color-border-light)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-left"
        minZoom={0.3}
        maxZoom={2}
      >
        <Background color="var(--color-border-light)" gap={24} />
        <Controls style={{ borderRadius: 0 }} />
        <MiniMap style={{ borderRadius: 0, border: '1px solid var(--color-border)' }} nodeColor={(n) => {
          const s = stages.find(st => st.slug === n.id);
          if (!s) return 'var(--color-border-light)';
          const done = s.decisions?.filter((d: any) => completed.has(d.id)).length || 0;
          const total = s.decisions?.length || 1;
          return done === total ? '#22c55e' : done > 0 ? 'var(--color-accent)' : 'var(--color-border-light)';
        }} />
      </ReactFlow>
    </div>
  );
}
