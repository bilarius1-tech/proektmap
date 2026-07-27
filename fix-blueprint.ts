import { getDb } from './src/lib/db/index';

async function main() {
  const db: any = await getDb();

  // Fix placeholder prompts using raw SQL
  await db.;
  await db.;

  // Add skills to decisions
  await db.;
  await db.;
  await db.;
  await db.;
  await db.;
  await db.;
  
  console.log('Done — prompts and skills updated');
}

main();
