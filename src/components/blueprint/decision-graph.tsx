'use client';

import { useMemo, useCallback } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, MiniMap, Handle, Position, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { CheckCircle, Circle, HelpCircle, AlertTriangle } from 'lucide-react';

interface DecisionNode {
  id: string; title: string; slug: string; stageTitle: string; stageSlug: string;
  status: 'completed' | 'pending' | 'skipped';
  userChoice?: string;
  xpReward: number;
}

interface Relation {
  fromDecisionId: string;
  toDecisionId: string;
  relationType: string;
}

interface StageGroup {
  title: string; slug: string;
  decisions: DecisionNode[];
}

const RELATION_COLORS: Record<string, { stroke: string; label: string }> = {
  amplifies:   { stroke: '#22c55e', label: 'Усиливает' },
  conflicts:   { stroke: '#ef4444', label: 'Конфликтует' },
  compromise:  { stroke: '#f59e0b', label: 'Компромисс' },
  depends_on:  { stroke: '#3b82f6', label: 'Зависит от' },
  related:     { stroke: '#94a3b8', label: 'Связано' },
};

const STAGE_COLORS = [
  '#ecfdf5', '#eff6ff', '#fefce8', '#fef2f2', '#f5f3ff',
  '#ecfeff', '#fff7ed', '#f0fdf4', '#fdf2f8', '#f1f5f9',
];

export default function DecisionGraph({
  stages, relations, onDecisionClick,
}: {
  stages: StageGroup[];
  relations: Relation[];
  onDecisionClick?: (decisionId: string) => void;
}) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const relationSet = new Set(relations.map(r => `${r.fromDecisionId}->${r.toDecisionId}`));

    let globalIdx = 0;
    // Layout: stages in rows, decisions in columns within each row
    const COLS_PER_ROW = 5;
    const NODE_W = 200;
    const NODE_H = 90;
    const GAP_X = 30;
    const GAP_Y = 50;
    const STAGE_GAP = 30;

    let yOffset = 0;

    stages.forEach((stage, stageIdx) => {
      const stageDecisions = stage.decisions;
      // Calculate stage header height
      const headerH = 50;
      const rows = Math.ceil(stageDecisions.length / COLS_PER_ROW);
      const stageH = headerH + rows * (NODE_H + GAP_Y) + STAGE_GAP;

      // Stage header node
      nodes.push({
        id: `stage-${stage.slug}`,
        type: 'default',
        data: {
          label: (
            <div style={{
              padding: '10px 20px', fontWeight: 700, fontSize: 14,
              color: 'var(--color-accent)', textAlign: 'center',
            }}>
              {stage.title}
              <span style={{ fontSize: 11, marginLeft: 8, color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
                {stageDecisions.filter(d => d.status === 'completed').length}/{stageDecisions.length}
              </span>
            </div>
          ),
        },
        position: { x: 0, y: yOffset },
        style: {
          width: COLS_PER_ROW * (NODE_W + GAP_X),
          background: STAGE_COLORS[stageIdx % STAGE_COLORS.length],
          border: '1px solid var(--color-border-light)',
          borderRadius: 0,
          padding: 0,
        },
        draggable: false,
      });

      yOffset += headerH;

      // Decision nodes
      stageDecisions.forEach((dec, decIdx) => {
        const col = decIdx % COLS_PER_ROW;
        const row = Math.floor(decIdx / COLS_PER_ROW);

        const isDone = dec.status === 'completed';
        const isSkipped = dec.status === 'skipped';

        nodes.push({
          id: dec.id,
          type: 'default',
          data: {
            label: <DecisionCard decision={dec} />,
          },
          position: {
            x: col * (NODE_W + GAP_X) + 10,
            y: yOffset + row * (NODE_H + GAP_Y),
          },
          style: {
            width: NODE_W, height: NODE_H,
            background: isDone ? '#ecfdf5' : isSkipped ? '#f8fafc' : '#ffffff',
            border: isDone ? '2px solid #22c55e' : isSkipped ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
            borderRadius: 0,
            padding: 10,
            fontSize: 12,
            cursor: 'pointer',
          },
          draggable: true,
          connectable: false,
        });

        // Sequential edges within stage
        if (decIdx < stageDecisions.length - 1) {
          const nextId = stageDecisions[decIdx + 1].id;
          if (!relationSet.has(`${dec.id}->${nextId}`)) {
            edges.push({
              id: `seq-${dec.id}-${nextId}`,
              source: dec.id,
              target: nextId,
              type: 'smoothstep',
              style: { stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '5,5' },
              animated: false,
            });
          }
        }
      });

      yOffset += rows * (NODE_H + GAP_Y) + STAGE_GAP;
    });

    // Custom relations
    relations.forEach(rel => {
      const color = RELATION_COLORS[rel.relationType] || RELATION_COLORS.related;
      edges.push({
        id: `rel-${rel.fromDecisionId}-${rel.toDecisionId}`,
        source: rel.fromDecisionId,
        target: rel.toDecisionId,
        type: 'smoothstep',
        style: { stroke: color.stroke, strokeWidth: 2, opacity: 0.8 },
        animated: true,
        label: color.label,
        labelStyle: { fontSize: 9, fill: color.stroke, fontWeight: 600 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
        markerEnd: { type: MarkerType.ArrowClosed, color: color.stroke, width: 16, height: 16 },
      });
    });

    return { nodes, edges };
  }, [stages, relations]);

  const onNodeClick = useCallback((_event: any, node: Node) => {
    if (node.id.startsWith('stage-')) return;
    onDecisionClick?.(node.id);
  }, [onDecisionClick]);

  const totalDecs = stages.reduce((sum, s) => sum + s.decisions.length, 0);
  const completedDecs = stages.reduce((sum, s) => sum + s.decisions.filter(d => d.status === 'completed').length, 0);

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        padding: 'var(--space-m) var(--space-l)', background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-l)', fontWeight: 700, margin: 0 }}>🧠 Граф решений</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
            {totalDecs} решений · {completedDecs} принято · {relations.length} связей
          </p>
        </div>
        <Legend />
      </div>

      {/* Graph */}
      <div style={{ width: '100%', height: '75vh', background: 'var(--color-bg-secondary)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={false}
        >
          <Background color="var(--color-border-light)" gap={20} />
          <Controls style={{ borderRadius: 0 }} />
          <MiniMap
            style={{ borderRadius: 0, border: '1px solid var(--color-border)' }}
            nodeColor={(n) => {
              if (n.id?.startsWith('stage-')) return STAGE_COLORS[0];
              const allDecs = stages.flatMap(s => s.decisions);
              const dec = allDecs.find(d => d.id === n.id);
              if (!dec) return '#e2e8f0';
              return dec.status === 'completed' ? '#22c55e' : dec.status === 'skipped' ? '#cbd5e1' : '#e2e8f0';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

function DecisionCard({ decision }: { decision: DecisionNode }) {
  const isDone = decision.status === 'completed';
  const isSkipped = decision.status === 'skipped';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        {isDone
          ? <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
          : isSkipped
            ? <HelpCircle size={14} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 1 }} />
            : <Circle size={14} style={{ color: '#cbd5e1', flexShrink: 0, marginTop: 1 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.3, wordBreak: 'break-word' }}>
            {decision.title}
          </div>
          {decision.userChoice && (
            <div style={{
              marginTop: 4, fontSize: 9, color: '#22c55e', fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {decision.userChoice}
            </div>
          )}
        </div>
        <span style={{ fontSize: 9, color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
          +{decision.xpReward}
        </span>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10, color: 'var(--color-text-secondary)' }}>
      {Object.entries(RELATION_COLORS).map(([type, { stroke, label }]) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 16, height: 3, background: stroke, borderRadius: 2 }} />
          <span>{label}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 16, height: 3, background: '#e2e8f0', borderRadius: 2, borderTop: '1px dashed #e2e8f0' }} />
        <span>Последовательно</span>
      </div>
    </div>
  );
}
