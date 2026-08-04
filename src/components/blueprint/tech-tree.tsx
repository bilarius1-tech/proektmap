'use client';

import { useMemo, useCallback } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, MarkerType, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Lock, Unlock, CheckCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface TechNode {
  id: string; title: string; stageTitle: string;
  status: 'locked' | 'available' | 'completed';
  xpReward: number;
  userChoice?: string;
  dependsOn: string[]; // IDs of prerequisite decisions
}

interface StageGroup {
  title: string; slug: string;
  decisions: TechNode[];
}

const STAGE_BG = [
  'rgba(15,184,128,0.04)', 'rgba(59,130,246,0.04)', 'rgba(245,158,11,0.04)',
  'rgba(239,68,68,0.04)', 'rgba(139,92,246,0.04)', 'rgba(6,182,212,0.04)',
];

export default function TechTreeView({
  stages, onNodeClick, onUnlock,
}: {
  stages: StageGroup[];
  onNodeClick?: (id: string) => void;
  onUnlock?: (id: string) => void;
}) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const NODE_W = 180;
    const NODE_H = 120;
    const GAP_X = 40;
    const GAP_Y = 60;
    const STAGE_HEADER_H = 45;
    const STAGE_PAD = 30;
    const MAX_COLS = 5;

    let y = 0;

    stages.forEach((stage, si) => {
      const decs = stage.decisions || [];
      const rows = Math.ceil(decs.length / MAX_COLS);
      const stageW = MAX_COLS * (NODE_W + GAP_X) + STAGE_PAD;
      const stageH = STAGE_HEADER_H + rows * (NODE_H + GAP_Y) + STAGE_PAD;

      // Stage header
      const completed = decs.filter(d => d.status === 'completed').length;
      nodes.push({
        id: `stage-hdr-${stage.slug}`,
        type: 'default',
        data: {
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-accent)' }}>{stage.title}</span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99,
                background: completed === decs.length ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                color: completed === decs.length ? 'white' : 'var(--color-text-tertiary)',
                fontWeight: 700,
              }}>
                {completed}/{decs.length}
              </span>
              {completed === decs.length && <Sparkles size={14} style={{ color: '#f59e0b' }} />}
            </div>
          ),
        },
        position: { x: STAGE_PAD / 2, y },
        style: {
          width: stageW, height: STAGE_HEADER_H,
          background: 'transparent', border: 'none',
        },
        draggable: false,
        selectable: false,
      });

      y += STAGE_HEADER_H + 10;

      // Decision nodes
      decs.forEach((dec, di) => {
        const col = di % MAX_COLS;
        const row = Math.floor(di / MAX_COLS);
        const x = col * (NODE_W + GAP_X) + STAGE_PAD / 2;
        const ny = y + row * (NODE_H + GAP_Y);

        const isCompleted = dec.status === 'completed';
        const isLocked = dec.status === 'locked';

        nodes.push({
          id: dec.id,
          type: 'default',
          data: {
            label: <TechNodeCard node={dec} />,
          },
          position: { x, y: ny },
          style: {
            width: NODE_W, height: NODE_H,
            background: isCompleted
              ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
              : isLocked
                ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: isCompleted
              ? '2px solid #22c55e'
              : isLocked
                ? '1px dashed #cbd5e1'
                : '1px solid #e2e8f0',
            borderRadius: 0,
            padding: 0,
            cursor: isLocked ? 'not-allowed' : 'pointer',
            opacity: isLocked ? 0.6 : 1,
            boxShadow: isCompleted
              ? '0 0 20px rgba(34,197,94,0.15)'
              : isLocked
                ? 'none'
                : '0 1px 3px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease',
          },
          draggable: false,
        });

        // Sequential edges
        if (di < decs.length - 1 && !isLocked) {
          edges.push({
            id: `seq-${dec.id}`,
            source: dec.id,
            target: decs[di + 1].id,
            type: 'smoothstep',
            style: {
              stroke: isCompleted ? '#22c55e' : '#e2e8f0',
              strokeWidth: isCompleted ? 2 : 1,
              strokeDasharray: isCompleted ? 'none' : '5,5',
            },
            animated: isCompleted,
            markerEnd: isCompleted
              ? { type: MarkerType.ArrowClosed, color: '#22c55e', width: 12, height: 12 }
              : undefined,
          });
        }

        // Dependency edges
        dec.dependsOn.forEach(depId => {
          edges.push({
            id: `dep-${depId}-${dec.id}`,
            source: depId,
            target: dec.id,
            type: 'smoothstep',
            style: { stroke: '#3b82f6', strokeWidth: 1.5, opacity: 0.5 },
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 10, height: 10 },
          });
        });
      });

      y += rows * (NODE_H + GAP_Y) + STAGE_PAD;
    });

    return { nodes, edges };
  }, [stages]);

  const onNodeClickHandler = useCallback((_e: any, node: Node) => {
    if (node.id.startsWith('stage-hdr')) return;
    onNodeClick?.(node.id);
  }, [onNodeClick]);

  const totalDecs = stages.reduce((s, st) => s + st.decisions.length, 0);
  const completed = stages.reduce((s, st) => s + st.decisions.filter(d => d.status === 'completed').length, 0);

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Game UI Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white', padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Zap size={20} style={{ color: '#f59e0b' }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.02em' }}>TECH TREE</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={14} style={{ color: '#22c55e' }} /> {completed}/{totalDecs} открыто
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
            <Lock size={14} /> {totalDecs - completed} закрыто
          </span>
        </div>
      </div>

      {/* Graph */}
      <div style={{ flex: 1, background: '#0f172a' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClickHandler}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={24} size={1} />
          <Controls
            style={{ borderRadius: 0, background: '#1e293b', border: '1px solid #334155' }}
            className="[&>button]:!bg-[#1e293b] [&>button]:!border-[#334155] [&>button]:!text-white"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

function TechNodeCard({ node }: { node: TechNode }) {
  const isCompleted = node.status === 'completed';
  const isLocked = node.status === 'locked';

  return (
    <div style={{ padding: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isCompleted ? '#22c55e' : isLocked ? '#e2e8f0' : 'var(--color-accent)',
          flexShrink: 0,
        }}>
          {isCompleted
            ? <CheckCircle size={14} style={{ color: 'white' }} />
            : isLocked
              ? <Lock size={12} style={{ color: '#94a3b8' }} />
              : <Unlock size={12} style={{ color: 'white' }} />}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
          background: isCompleted ? '#dcfce7' : isLocked ? '#f1f5f9' : 'var(--color-accent-light)',
          color: isCompleted ? '#16a34a' : isLocked ? '#94a3b8' : 'var(--color-accent)',
        }}>
          +{node.xpReward} XP
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 11, fontWeight: 600, lineHeight: 1.3,
        color: isLocked ? '#94a3b8' : '#1e293b',
        flex: 1, overflow: 'hidden',
      }}>
        {isLocked ? '???' : node.title}
      </div>

      {/* Choice */}
      {node.userChoice && (
        <div style={{
          marginTop: 4, fontSize: 9, color: '#16a34a', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          background: '#dcfce7', padding: '2px 6px', borderRadius: 2,
        }}>
          {node.userChoice}
        </div>
      )}
    </div>
  );
}
