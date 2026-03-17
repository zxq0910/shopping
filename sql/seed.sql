USE shopping_platform;

-- 默认管理员密码通过服务启动时环境变量初始化。
-- 下面种子账号密码统一为: Admin@123456
INSERT INTO users (username, email, password, role, avatar)
VALUES ('demo-admin', 'admin@example.com', '$2a$10$MdRU0SUCUG8z43ANuFpM..VLSfYfojjScEWVPMyGMspKyKDJabMGK', 'admin', '')
ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password), role = VALUES(role);

INSERT INTO users (username, email, password, role, avatar)
VALUES ('demo-user', 'user@example.com', '$2a$10$MdRU0SUCUG8z43ANuFpM..VLSfYfojjScEWVPMyGMspKyKDJabMGK', 'user', '')
ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password), role = VALUES(role);
