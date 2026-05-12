-- CreateTable
CREATE TABLE "Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantCode" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ageConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "socialPlatform" TEXT NOT NULL,
    "socialHandle" TEXT NOT NULL,
    "socialPostUrl" TEXT NOT NULL,
    "dishName" TEXT,
    "caption" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejectionReason" TEXT,
    "consentContentUsage" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "approvedAt" DATETIME,
    "rejectedAt" DATETIME,
    "suspendedAt" DATETIME,
    "disqualifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER NOT NULL,
    "voterName" TEXT,
    "voterPhone" TEXT,
    "voterEmail" TEXT,
    "voterIp" TEXT,
    "userAgent" TEXT,
    "deviceFingerprint" TEXT,
    "voteStatus" TEXT NOT NULL DEFAULT 'VALID',
    "fraudScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MODERATOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER NOT NULL,
    "adminUserId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "previousStatus" TEXT,
    "newStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ModerationLog_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModerationLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CampaignSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingKey" TEXT NOT NULL,
    "settingValue" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FraudFlag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER,
    "voteId" INTEGER,
    "flagType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_participantCode_key" ON "Participant"("participantCode");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_slug_key" ON "Participant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_socialPostUrl_key" ON "Participant"("socialPostUrl");

-- CreateIndex
CREATE INDEX "Participant_status_idx" ON "Participant"("status");

-- CreateIndex
CREATE INDEX "Participant_phone_idx" ON "Participant"("phone");

-- CreateIndex
CREATE INDEX "Participant_state_idx" ON "Participant"("state");

-- CreateIndex
CREATE INDEX "Participant_createdAt_idx" ON "Participant"("createdAt");

-- CreateIndex
CREATE INDEX "Vote_participantId_idx" ON "Vote"("participantId");

-- CreateIndex
CREATE INDEX "Vote_voterPhone_idx" ON "Vote"("voterPhone");

-- CreateIndex
CREATE INDEX "Vote_voterEmail_idx" ON "Vote"("voterEmail");

-- CreateIndex
CREATE INDEX "Vote_voterIp_idx" ON "Vote"("voterIp");

-- CreateIndex
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "ModerationLog_participantId_idx" ON "ModerationLog"("participantId");

-- CreateIndex
CREATE INDEX "ModerationLog_adminUserId_idx" ON "ModerationLog"("adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignSetting_settingKey_key" ON "CampaignSetting"("settingKey");

-- CreateIndex
CREATE INDEX "FraudFlag_participantId_idx" ON "FraudFlag"("participantId");

-- CreateIndex
CREATE INDEX "FraudFlag_voteId_idx" ON "FraudFlag"("voteId");

-- CreateIndex
CREATE INDEX "FraudFlag_status_idx" ON "FraudFlag"("status");
