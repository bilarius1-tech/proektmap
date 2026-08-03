"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import Link from "next/link";

const GROUP_COLORS: Record<string, string> = {
  Blueprint: "#0FB880",
  "Инструмент": "#3B82F6",
  "РФ AI": "#EF4444",
};

export default function UniversePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any>(null);
  const [hovered, setHovered] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 200);
    camera.position.set(0, 18, 42);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Background stars
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 100;
      starPos[i+1] = (Math.random() - 0.5) * 60;
      starPos[i+2] = (Math.random() - 0.5) * 80;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 }));
    scene.add(stars);

    // Lighting
    scene.add(new THREE.AmbientLight(0x404060, 1.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(15, 25, 15);
    scene.add(dir);

    // State
    const nodeMeshes: THREE.Mesh[] = [];
    const ringMeshes: THREE.Mesh[] = [];
    let hoveredMesh: THREE.Mesh | null = null;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.3;
    const mouse = new THREE.Vector2();

    // Fetch data
    fetch("/api/graph/full")
      .then(r => r.json())
      .then((data: { nodes: any[]; links: any[] }) => {
        setNodeCount(data.nodes.length);
        const bpNodes = data.nodes.filter(n => n.group === "Blueprint");

        data.nodes.forEach((n: any, i: number) => {
          const color = GROUP_COLORS[n.group] || "#999";
          // Spiral layout — Blueprints in center, tools around
          const angle = (i / data.nodes.length) * Math.PI * 6;
          const radius = n.group === "Blueprint" ? 4 + (bpNodes.indexOf(n) / bpNodes.length) * 12 : 8 + Math.random() * 18;
          const height = n.group === "Blueprint" ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 10;
          const size = n.group === "Blueprint" ? 0.55 : 0.22;

          const geo = new THREE.SphereGeometry(size, 20, 20);
          const mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(color),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9,
          });

          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
          mesh.userData = { ...n, baseEmissive: 0.5, baseScale: 1, color, size };
          scene.add(mesh);
          nodeMeshes.push(mesh);

          // Orbit ring for Blueprints
          if (n.group === "Blueprint") {
            const ringGeo = new THREE.TorusGeometry(size * 2.5, 0.03, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.25 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(mesh.position);
            ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            ring.userData = { baseOpacity: 0.25, isRing: true };
            scene.add(ring);
            ringMeshes.push(ring);
          }
        });

        // Connection lines
        data.links.forEach((l: any) => {
          const src = nodeMeshes.find(m => m.userData.id === l.source);
          const tgt = nodeMeshes.find(m => m.userData.id === l.target);
          if (src && tgt) {
            const curve = new THREE.QuadraticBezierCurve3(
              src.position.clone(),
              new THREE.Vector3((src.position.x + tgt.position.x) / 2, (src.position.y + tgt.position.y) / 2 + 2, (src.position.z + tgt.position.z) / 2),
              tgt.position.clone()
            );
            const lineGeo = new THREE.TubeGeometry(curve, 8, 0.02, 4, false);
            const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
            scene.add(new THREE.Mesh(lineGeo, lineMat));
          }
        });

        setLoading(false);
      });

    // Zoom state
    let zoomLevel = 42;
    let targetZoom = 42;

    // Mouse move — hover detection
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      // Reset previous hover
      if (hoveredMesh && (!intersects.length || intersects[0].object !== hoveredMesh)) {
        const m = hoveredMesh.material as THREE.MeshPhongMaterial;
        m.emissiveIntensity = hoveredMesh.userData.baseEmissive;
        hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale);
        hoveredMesh = null;
        setHovered(null);
        container!.style.cursor = "default";
      }

      // Set new hover
      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        if (obj !== hoveredMesh && nodeMeshes.includes(obj)) {
          hoveredMesh = obj;
          const m = obj.material as THREE.MeshPhongMaterial;
          obj.userData.baseEmissive = m.emissiveIntensity;
          obj.userData.baseScale = obj.scale.x;
          m.emissiveIntensity = 1.2;
          obj.scale.setScalar(obj.userData.size * 1.8);
          setHovered(obj.userData);
          container!.style.cursor = "pointer";
        }
      }
    }

    // Click handler
    function onClick(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        setSelected(intersects[0].object.userData);
      } else {
        setSelected(null);
      }
    }

    // Scroll zoom
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      targetZoom += e.deltaY * 0.05;
      targetZoom = Math.max(8, Math.min(90, targetZoom));
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("wheel", onWheel, { passive: false });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth zoom
      zoomLevel += (targetZoom - zoomLevel) * 0.08;
      camera.position.z = zoomLevel;

      // Gentle rotation
      const t = Date.now() * 0.00005;
      camera.position.x = Math.sin(t) * zoomLevel * 0.85;
      camera.position.z = Math.cos(t) * zoomLevel * 0.85;
      camera.lookAt(0, 0, 0);

      // Stars rotate very slowly
      stars.rotation.y += 0.00008;
      stars.rotation.x += 0.00003;

      // Ring pulse animation
      ringMeshes.forEach((ring, i) => {
        const pulse = 1 + Math.sin(Date.now() * 0.002 + i) * 0.3;
        (ring.material as THREE.MeshBasicMaterial).opacity = ring.userData.baseOpacity * pulse;
      });

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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh", background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000010 100%)", position: "relative", overflow: "hidden", cursor: "default" }}>
      {/* HUD */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>
          <span style={{ fontSize: "var(--text-l)", fontWeight: 800, color: "white", fontFamily: "var(--font-heading)" }}>🌌 Вселенная ProektMap</span>
          <span style={{ marginLeft: 12, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{nodeCount} систем</span>
        </div>
        <div style={{ display: "flex", gap: 12, pointerEvents: "auto" }}>
          <Link href="/graph" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>📊 2D граф</Link>
          <Link href="/" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>← На главную</Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, color: "rgba(255,255,255,0.5)", pointerEvents: "none", fontSize: "var(--text-s)" }}>
          🌌 Загрузка галактики...
        </div>
      )}

      {/* Hover tooltip */}
      {hovered && !selected && (
        <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "rgba(10,10,36,0.9)", border: `1px solid ${hovered.color}60`, borderRadius: "var(--radius-m)", padding: "6px 14px", color: "white", pointerEvents: "none", fontSize: "var(--text-xs)" }}>
          <span style={{ color: hovered.color, fontWeight: 700 }}>{hovered.group}</span> {hovered.name}
        </div>
      )}

      {/* Selected card */}
      {selected && (
        <div style={{ position: "absolute", top: 70, right: 20, zIndex: 10, background: "rgba(10,10,36,0.96)", border: `1px solid ${selected.color}50`, borderRadius: "var(--radius-l)", padding: "var(--space-l)", minWidth: 240, maxWidth: 320, color: "white", boxShadow: `0 0 30px ${selected.color}20` }}>
          <div style={{ fontSize: 10, color: selected.color, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 4 }}>{selected.group}</div>
          <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 8 }}>{selected.name}</div>
          {selected.type === "blueprint" && (
            <Link href={`/blueprints/${selected.id}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 14px", background: selected.color, color: "white", textDecoration: "none", borderRadius: "var(--radius-m)", fontSize: 11, fontWeight: 600 }}>
              Открыть Blueprint →
            </Link>
          )}
          {selected.type === "aitool" && (
            <Link href={`/ai-tools/${selected.id}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 14px", background: selected.color, color: "white", textDecoration: "none", borderRadius: "var(--radius-m)", fontSize: 11, fontWeight: 600 }}>
              Открыть инструмент →
            </Link>
          )}
          {!selected.type?.match(/blueprint|aitool/) && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Нет ссылки</div>
          )}
          <button onClick={() => setSelected(null)} style={{ display: "block", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>✕ Закрыть</button>
        </div>
      )}

      {/* Hint bar */}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", zIndex: 10, fontSize: 11, color: "rgba(255,255,255,0.2)", pointerEvents: "none" }}>
        🖱 Наведи на узел · Скролл — zoom · Клик — карточка · Двигай мышью — обзор
      </div>
    </div>
  );
}
