CREATE TABLE `user` (
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  password_hash TEXT NOT NULL
);
-- breakpoint
CREATE TABLE `session` (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES user(id)
);
-- breakpoint
CREATE TABLE IF NOT EXISTS `identity` (
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
-- breakpoint
CREATE TABLE IF NOT EXISTS `message` (
  id TEXT NOT NULL PRIMARY KEY,
  `subject` TEXT NOT NULL,
  content TEXT NOT NULL,
  `from` INTEGER NOT NULL,
  `to` INTEGER NOT NULL,
  `status` TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(`from`) REFERENCES identity(id),
  FOREIGN KEY(`to`) REFERENCES identity(id)
);