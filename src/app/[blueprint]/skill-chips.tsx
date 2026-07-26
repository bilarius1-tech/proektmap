import Link from 'next/link';

export default function SkillChips({ skillsRequired }: { skillsRequired: string }) {
  if (!skillsRequired || skillsRequired === '[]') return null;
  let skills: string[] = [];
  try { skills = JSON.parse(skillsRequired); } catch { return null; }
  if (skills.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
      {skills.map(slug => (
        <Link key={slug} href={"/glossary/" + slug} style={{
          padding: '2px 8px', background: 'var(--color-accent-light)', color: 'var(--color-accent)',
          fontSize: 10, fontWeight: 600, textDecoration: 'none', borderRadius: 0,
        }}>{slug}</Link>
      ))}
    </div>
  );
}
