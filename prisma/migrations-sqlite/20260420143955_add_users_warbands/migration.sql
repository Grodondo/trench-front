-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "saved_warbands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "name" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "subfaction" TEXT,
    "notes" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "total_ducats" INTEGER NOT NULL DEFAULT 0,
    "total_glory" INTEGER NOT NULL DEFAULT 0,
    "roster_json" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "saved_warbands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_battle_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warband_name" TEXT,
    "player_faction" TEXT,
    "opponent_faction" TEXT,
    "location" TEXT,
    "outcome" TEXT,
    "key_moments" JSONB,
    "tone" TEXT,
    "generated_narrative" TEXT,
    "linked_submission_id" INTEGER,
    "warband1_id" INTEGER,
    "warband2_id" INTEGER,
    CONSTRAINT "battle_reports_linked_submission_id_fkey" FOREIGN KEY ("linked_submission_id") REFERENCES "battle_submissions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "battle_reports_warband1_id_fkey" FOREIGN KEY ("warband1_id") REFERENCES "saved_warbands" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "battle_reports_warband2_id_fkey" FOREIGN KEY ("warband2_id") REFERENCES "saved_warbands" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_battle_reports" ("created_at", "generated_narrative", "id", "key_moments", "linked_submission_id", "location", "opponent_faction", "outcome", "player_faction", "slug", "tone", "warband_name") SELECT "created_at", "generated_narrative", "id", "key_moments", "linked_submission_id", "location", "opponent_faction", "outcome", "player_faction", "slug", "tone", "warband_name" FROM "battle_reports";
DROP TABLE "battle_reports";
ALTER TABLE "new_battle_reports" RENAME TO "battle_reports";
CREATE UNIQUE INDEX "battle_reports_slug_key" ON "battle_reports"("slug");
CREATE UNIQUE INDEX "battle_reports_linked_submission_id_key" ON "battle_reports"("linked_submission_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
