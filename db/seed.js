import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create 20 tracks
  for (let i = 1; i <= 20; i++) {
    await db.query(
      `
      INSERT INTO tracks(name, duration_ms)
      VALUES ($1, $2);
      `,
      [`Track ${i}`, i * 1000],
    );
  }

  // Create 10 playlists
  for (let i = 1; i <= 10; i++) {
    await db.query(
      `
      INSERT INTO playlists(name, description)
      VALUES ($1, $2);
      `,
      [`Playlist ${i}`, `Description ${i}`],
    );
  }

  // Create 15 relationships
  for (let i = 1; i <= 15; i++) {
    await db.query(
      `
      INSERT INTO playlists_tracks(playlist_id, track_id)
      VALUES ($1, $2);
      `,
      [((i - 1) % 10) + 1, i],
    );
  }
}
