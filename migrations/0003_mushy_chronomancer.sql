DROP TABLE form;
--> statement-breakpoint
CREATE TABLE form (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT,
  shareUrl TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  submissions INTEGER NOT NULL DEFAULT 0,
  published INTEGER DEFAULT false,
  createdAt TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updatedAt INTEGER,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX idx_userId_name ON form(userId, name);
