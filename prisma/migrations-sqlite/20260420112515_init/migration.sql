-- CreateTable
CREATE TABLE "sectors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "controller" TEXT NOT NULL DEFAULT 'CONTESTED',
    "faithful_score" INTEGER NOT NULL DEFAULT 0,
    "infernal_score" INTEGER NOT NULL DEFAULT 0,
    "svg_path_id" TEXT,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "battle_submissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warband_name" TEXT,
    "player_faction" TEXT NOT NULL,
    "opponent_faction" TEXT NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL,
    "key_moment" TEXT,
    "ip_hash" TEXT,
    "week_number" INTEGER NOT NULL,
    CONSTRAINT "battle_submissions_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "battle_reports" (
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
    CONSTRAINT "battle_reports_linked_submission_id_fkey" FOREIGN KEY ("linked_submission_id") REFERENCES "battle_submissions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weekly_snapshots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "week_number" INTEGER NOT NULL,
    "snapshot_data" JSONB NOT NULL,
    "narrative_summary" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "sectors_slug_key" ON "sectors"("slug");

-- CreateIndex
CREATE INDEX "battle_submissions_sector_id_idx" ON "battle_submissions"("sector_id");

-- CreateIndex
CREATE INDEX "battle_submissions_week_number_idx" ON "battle_submissions"("week_number");

-- CreateIndex
CREATE INDEX "battle_submissions_ip_hash_submitted_at_idx" ON "battle_submissions"("ip_hash", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "battle_reports_slug_key" ON "battle_reports"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "battle_reports_linked_submission_id_key" ON "battle_reports"("linked_submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_snapshots_week_number_key" ON "weekly_snapshots"("week_number");
