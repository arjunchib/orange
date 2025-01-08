import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text()
    .primaryKey()
    .$default(() => Bun.randomUUIDv7()),
  name: text().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  deploys: many(deploys),
}));

export const deploys = sqliteTable("deploys", {
  id: text()
    .primaryKey()
    .$default(() => Bun.randomUUIDv7()),
  projectId: text()
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const deploysRelations = relations(deploys, ({ one }) => ({
  project: one(projects, {
    fields: [deploys.projectId],
    references: [projects.id],
  }),
}));
