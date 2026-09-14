import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Check-list relevés : un enregistrement par check-list soumise
    checklistEntries: defineTable({
      checklistId: v.string(), // water, surchauffee, vapeur, vide, compresseurs, glacee, thermo, groupes, osmose
      values: v.any(), // Record<string, string> — valeurs de champs
      anomaliesCount: v.number(), // nb de champs hors plage
      totalFields: v.number(),
      technicien: v.string(), // nom du technicien
      poste: v.string(), // nuit | matin | apres-midi
      createdAt: v.number(),
    })
      .index("by_checklistId", ["checklistId"])
      .index("by_createdAt", ["createdAt"]),

    // Anomalies déclarées
    anomalies: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      checklistId: v.optional(v.string()), // null = générale
      priority: v.string(), // Normale | Urgente | Critique
      status: v.string(), // ouverte | en cours | resolue
      declaredBy: v.string(), // nom du technicien
      createdAt: v.number(),
      resolvedAt: v.optional(v.number()),
    })
      .index("by_status", ["status"])
      .index("by_createdAt", ["createdAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
