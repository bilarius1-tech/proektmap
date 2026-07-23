import { getDb } from './src/lib/db/index';

const data = JSON.parse(require('fs').readFileSync('./tools-meta.json', 'utf-8'));

async function main() {
  const db = await getDb();
  for (const t of data) {
    await db.aITool.updateMany({
      where: { slug: t.slug },
      data: {
        creator: t.creator,
        foundedYear: t.foundedYear,
        lastUpdate: t.lastUpdate,
        headquarters: t.headquarters,
        shortDescription: t.shortDescription,
      }
    });
    console.log('OK:', t.slug);
  }
}

main();
