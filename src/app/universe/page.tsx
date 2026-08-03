"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";

interface Node3D {
  id: string; name: string; group: string;
  x: number; y: number; z: number;
  color: string; size: number; type: string;
}

const GROUP_COLORS: Record<string, string> = {
  Blueprint: "#0FB880",
  "Инструмент": "#3B82F6",
  "РФ AI": "#EF4444",
};

export default function UniversePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Node3D | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 40);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Background stars
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 100;
      starPositions[i + 1] = (Math.random() - 0.5) * 60;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Light
    scene.add(new THREE.AmbientLight(0x404060, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // Nodes
    const nodes3D: Node3D[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    fetch("/api/graph/full")
      .then(r => r.json())
      .then((data: { nodes: any[]; links: any[] }) => {
        const bpCount = data.nodes.filter(n => n.group === "Blueprint").length;

        data.nodes.forEach((n: any, i: number) => {
          const color = GROUP_COLORS[n.group] || "#999";
          // Spiral galaxy layout
          const angle = (i / data.nodes.length) * Math.PI * 6;
          const radius = 3 + (i / data.nodes.length) * 20;
          const height = (Math.random() - 0.5) * 8;

          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = height;
          const size = n.group === "Blueprint" ? 0.5 : 0.2;

          // Glow sphere
          const geo = new THREE.SphereGeometry(size, 16, 16);
          const mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(color),
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, z);
          mesh.userData = {
            id: n.id, name: n.name, group: n.group, type: n.type,
            color, size,
          } as Node3D;
          scene.add(mesh);
          nodeMeshes.push(mesh);
          nodes3D.push({ id: n.id, name: n.name, group: n.group, x, y, z, color, size, type: n.type });

          // Orbit ring for Blueprints
          if (n.group === "Blueprint") {
            const ringGeo = new THREE.TorusGeometry(radius * 0.3, 0.03, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.2 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(x, y, z);
            ring.rotation.x = Math.PI / 2;
            scene.add(ring);
          }
        });

        // Connection lines
        data.links.forEach((l: any) => {
          const src = nodes3D.find(n => n.id === l.source);
          const tgt = nodes3D.find(n => n.id === l.target);
          if (src && tgt) {
            const points = [new THREE.Vector3(src.x, src.y, src.z), new THREE.Vector3(tgt.x, tgt.y, tgt.z)];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
            const line = new THREE.Line(lineGeo, lineMat);
            scene.add(line);
          }
        });

        setLoading(false);
      });

    // Raycaster for click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener("click", (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        setSelected(intersects[0].object.userData as Node3D);
      } else {
        setSelected(null);
      }
    });

    // Mouse move — gentle camera rotation
    let targetRotY = 0;
    renderer.domElement.addEventListener("mousemove", (e: MouseEvent) => {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.5;
    });

    // Scroll zoom
    renderer.domElement.addEventListener("wheel", (e: WheelEvent) => {
      camera.position.z += e.deltaY * 0.05;
      camera.position.z = Math.max(10, Math.min(80, camera.position.z));
    });

    // Animation
    let frame = 0;
    function animate() {
      requestAnimationFrame(animate);
      frame += 0.002;

      // Rotate stars slowly
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;

      // Gentle camera orbit
      const camAngle = frame * 0.1 + targetRotY;
      camera.position.x = Math.sin(camAngle) * 35;
      camera.position.z = Math.cos(camAngle) * 35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh", background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000010 100%)", position: "relative", overflow: "hidden" }}>
      {/* HUD */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>
          <span style={{ fontSize: "var(--text-l)", fontWeight: 800, color: "white", fontFamily: "var(--font-heading)" }}>🌌 Вселенная ProektMap</span>
        </div>
        <Link href="/graph" style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.5)", textDecoration: "none", pointerEvents: "auto" }}>2D граф →</Link>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, color: "rgba(255,255,255,0.6)", pointerEvents: "none" }}>
          Загрузка галактики...
        </div>
      )}

      {/* Selected node */}
      {selected && (
        <div style={{ position: "absolute", top: 70, right: 20, zIndex: 10, background: "rgba(10,10,36,0.95)", border: `1px solid ${selected.color}40`, borderRadius: "var(--radius-l)", padding: "var(--space-l)", minWidth: 220, color: "white" }}>
          <div style={{ fontSize: 10, color: selected.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{selected.group}</div>
          <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 6 }}>{selected.name}</div>
          {selected.type === "blueprint" && (
            <Link href={`/blueprints/${selected.id}`} target="_blank" style={{ fontSize: 11, color: selected.color, textDecoration: "none" }}>Открыть Blueprint →</Link>
          )}
          {selected.type === "aitool" && (
            <Link href={`/ai-tools/${selected.id}`} target="_blank" style={{ fontSize: 11, color: selected.color, textDecoration: "none" }}>Открыть инструмент →</Link>
          )}
          <button onClick={() => setSelected(null)} style={{ display: "block", marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Hint */}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", zIndex: 10, fontSize: 11, color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>
        🖱 Двигай мышью · Скролл — zoom · Клик — информация
      </div>
    </div>
  );
}
