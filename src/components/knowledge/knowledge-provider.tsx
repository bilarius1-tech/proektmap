"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import TextSelectionPopover from "@/components/knowledge/text-selection-popover";
import KnowledgePanel from "@/components/knowledge/knowledge-panel";

// Custom events for cross-component communication
export function useKnowledgePanel() {
  const [open, setOpen] = useState(false);
  const [learningMode, setLearningMode] = useState(false);

  useEffect(() => {
    function onToggle() { setOpen(prev => !prev); }
    function onToggleLearning() { setLearningMode(prev => !prev); }
    window.addEventListener("kp:toggle", onToggle);
    window.addEventListener("kp:toggle-learning", onToggleLearning);
    return () => {
      window.removeEventListener("kp:toggle", onToggle);
      window.removeEventListener("kp:toggle-learning", onToggleLearning);
    };
  }, []);

  return { open, learningMode, close: () => setOpen(false), toggleLearning: () => setLearningMode(prev => !prev) };
}

export function dispatchTogglePanel() {
  window.dispatchEvent(new CustomEvent("kp:toggle"));
}
export function dispatchToggleLearning() {
  window.dispatchEvent(new CustomEvent("kp:toggle-learning"));
}

export default function KnowledgeProvider() {
  const { data: session } = useSession();
  const { open, learningMode, close } = useKnowledgePanel();

  if (!session?.user) return null;

  return (
    <>
      <TextSelectionPopover learningMode={learningMode} />
      <KnowledgePanel open={open} onClose={close} />
    </>
  );
}
