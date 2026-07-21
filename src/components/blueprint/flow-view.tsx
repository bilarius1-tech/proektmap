'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, MiniMap } from 'reactflow';
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

      return {
        id: s.slug,
        data: { label: '' },
        position: { x: (i % 4) * 240, y: Math.floor(i / 4) * 180 },
        style: {
          background: isActive ? 'var(--color-accent-light)' : 'var(--color-bg-primary)',
          border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
          borderRadius: 0,
          padding: '12px 16px',
          minWidth: 180,
          color: 'var(--color-text-primary)',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
        },
      };
    });
  }, [stages, completed, activeStage]);

  const edges: Edge[] = useMemo(() => {
    return stages.slice(1).map((s, i) => ({
      id: `e-${i}`,
      source: stages[i].slug,
      target: s.slug,
      style: { stroke: 'var(--color-border)', strokeWidth: 2 },
      animated: true,
    }));
  }, [stages]);

  const onNodeClick = useCallback((_event: any, node: Node) => {
    onStageClick(node.id);
  }, [onStageClick]);

  return (
    <div style={{ width: '100%', height: 500, background: 'var(--color-bg-secondary)', borderRadius: 0, border: '1px solid var(--color-border-light)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="var(--color-border-light)" gap={20} />
        <Controls style={{ borderRadius: 0 }} />
        <MiniMap style={{ borderRadius: 0, border: '1px solid var(--color-border)' }} />
      </ReactFlow>
    </div>
  );
}
