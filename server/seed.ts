import { storage } from "./storage";
import { INITIAL_LOGS, FILES, MESSAGES } from "../client/src/data/mock-data";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed initial logs
  console.log("📋 Seeding logs...");
  for (const log of INITIAL_LOGS) {
    await storage.createLog({
      level: log.level,
      message: log.message,
    });
  }

  // Seed files
  console.log("📁 Seeding files...");
  for (const file of FILES) {
    await storage.createFile({
      name: file.name,
      type: file.type,
      locked: file.locked || false,
      size: file.size || null,
      date: file.date,
      content: file.content || null,
      preview: file.preview || null,
    });
  }

  // Seed messages
  console.log("📧 Seeding messages...");
  for (const message of MESSAGES) {
    await storage.createMessage({
      from: message.from,
      subject: message.subject,
      date: message.date,
      unread: message.unread,
      content: message.content,
    });
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
