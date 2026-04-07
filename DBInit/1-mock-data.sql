-- Insert roles
INSERT INTO public."Roles" ("Id", "Name", "AccessLevel")
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin', 0),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Editor', 19),
       ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'User', 20);

-- Insert permissions
INSERT INTO public."Permissions" ("Id", "Code", "Name", "Description", "IsSystem")
VALUES ('10000000-0000-0000-0000-000000000001', 'rbac.roles.read', 'Read roles', 'Read roles and their permissions', true),
       ('10000000-0000-0000-0000-000000000002', 'rbac.roles.manage', 'Manage roles', 'Create, update, delete roles and assign permissions', true),
       ('10000000-0000-0000-0000-000000000003', 'rbac.permissions.read', 'Read permissions', 'Read available permission catalog', true),
       ('10000000-0000-0000-0000-000000000004', 'rbac.permissions.manage', 'Manage permissions', 'Manage permission catalog', true),
       ('10000000-0000-0000-0000-000000000005', 'users.read', 'Read users', 'Read users list', true),
       ('10000000-0000-0000-0000-000000000006', 'users.manage', 'Manage users', 'Create and update users', true),
       ('10000000-0000-0000-0000-000000000007', 'users.delete', 'Delete users', 'Delete users', true),
       ('10000000-0000-0000-0000-000000000008', 'content.articles.write', 'Write articles', 'Create and update articles', true),
       ('10000000-0000-0000-0000-000000000009', 'content.articles.delete', 'Delete articles', 'Delete articles', true),
       ('10000000-0000-0000-0000-000000000010', 'content.mushrooms.write', 'Write mushrooms', 'Create and update mushrooms', true),
       ('10000000-0000-0000-0000-000000000011', 'content.mushrooms.delete', 'Delete mushrooms', 'Delete mushrooms', true),
       ('10000000-0000-0000-0000-000000000012', 'content.article-mushrooms.write', 'Link mushrooms and articles', 'Manage article-mushroom links', true),
       ('10000000-0000-0000-0000-000000000013', 'profile.editor.materials.read', 'Profile editor materials tab', 'Access editor materials tab', true),
       ('10000000-0000-0000-0000-000000000014', 'profile.editor.drafts.read', 'Profile editor drafts tab', 'Access editor drafts tab', true),
       ('10000000-0000-0000-0000-000000000015', 'profile.editor.moderation-queue.read', 'Profile editor moderation queue tab', 'Access editor moderation queue tab', true),
       ('10000000-0000-0000-0000-000000000016', 'profile.ja.moderation.read', 'Profile JA moderation tab', 'Access junior admin moderation tab', true),
       ('10000000-0000-0000-0000-000000000017', 'profile.ja.reports.read', 'Profile JA reports tab', 'Access junior admin reports tab', true),
       ('10000000-0000-0000-0000-000000000018', 'profile.ja.users.read', 'Profile JA users tab', 'Access junior admin users tab', true),
       ('10000000-0000-0000-0000-000000000019', 'profile.admin.users-roles.read', 'Profile admin users and roles tab', 'Access admin users and roles tab', true),
       ('10000000-0000-0000-0000-000000000020', 'profile.admin.action-logs.read', 'Profile admin action logs tab', 'Access admin action logs tab', true),
       ('10000000-0000-0000-0000-000000000021', 'profile.su.system.read', 'Profile superuser system tab', 'Access superuser system tab', true),
       ('10000000-0000-0000-0000-000000000022', 'profile.su.audit.read', 'Profile superuser audit tab', 'Access superuser audit tab', true),
       ('10000000-0000-0000-0000-000000000023', 'profile.su.config.read', 'Profile superuser config tab', 'Access superuser config tab', true),
       ('10000000-0000-0000-0000-000000000024', 'content.articles.review', 'Review articles', 'Review and reject articles', true),
       ('10000000-0000-0000-0000-000000000025', 'content.articles.publish', 'Publish articles', 'Approve and publish articles', true),
       ('10000000-0000-0000-0000-000000000026', 'content.articles.archive', 'Archive articles', 'Archive articles from active publication', true),
       ('10000000-0000-0000-0000-000000000027', 'content.articles.manage-any', 'Manage any articles', 'Manage all articles regardless of ownership', true),
       ('10000000-0000-0000-0000-000000000028', 'content.articles.purge', 'Purge articles', 'Hard delete articles', true),
       ('10000000-0000-0000-0000-000000000029', 'content.article-media.write', 'Write article media', 'Upload and delete article media files', true),
       ('10000000-0000-0000-0000-000000000030', 'content.mushrooms.review', 'Review mushrooms', 'Review and reject mushrooms', true),
       ('10000000-0000-0000-0000-000000000031', 'content.mushrooms.publish', 'Publish mushrooms', 'Approve and publish mushrooms', true),
       ('10000000-0000-0000-0000-000000000032', 'content.mushrooms.archive', 'Archive mushrooms', 'Archive mushrooms from public catalog', true),
       ('10000000-0000-0000-0000-000000000033', 'content.mushrooms.manage-any', 'Manage any mushrooms', 'Manage all mushrooms regardless of ownership', true),
       ('10000000-0000-0000-0000-000000000034', 'content.mushrooms.purge', 'Purge mushrooms', 'Hard delete mushrooms', true),
       ('10000000-0000-0000-0000-000000000035', 'content.mushroom-media.write', 'Write mushroom media', 'Upload and delete mushroom media files', true);

-- Insert users
INSERT INTO public."Users" ("Id", "Username", "Email", "PasswordHash", "RoleId")
VALUES
-- Пароль: Fungi123!
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'admin_user', 'admin@mushroomproject.com',
 '$2a$11$zA5O21EK4ncH2AOyaY/aoOnN8OXUIhz5m5tVGuhhTybxeTjLiohoq', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'editor_user', 'editor@mushroomproject.com',
 '$2a$11$zA5O21EK4ncH2AOyaY/aoOnN8OXUIhz5m5tVGuhhTybxeTjLiohoq', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'regular_user', 'user@mushroomproject.com',
 '$2a$11$zA5O21EK4ncH2AOyaY/aoOnN8OXUIhz5m5tVGuhhTybxeTjLiohoq', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

-- Assign permissions to roles
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', p."Id"
FROM public."Permissions" p;

INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
VALUES ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000008'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000010'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000012'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000029'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000035'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000013'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000014'),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10000000-0000-0000-0000-000000000015');

-- Insert articles
INSERT INTO public."Articles" ("Id", "Title", "PublishDate", "AuthorString", "HeaderPhotoLink", "ExtraPhotoLinks", "Status",
                               "CreatedByUserId", "UpdatedByUserId", "CreatedAt", "UpdatedAt", "PublishedAt")
VALUES ('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'Как отличить съедобные грибы от ядовитых', '2023-08-15 10:00:00+03',
        'Иван Петров', 'https://i.imgur.com/safety.jpg',
        'https://i.imgur.com/safety1.jpg;https://i.imgur.com/safety2.jpg',
        'Published',
        'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        '2023-08-15 10:00:00+03',
        '2023-08-15 10:00:00+03',
        '2023-08-15 10:00:00+03'),
       ('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'Топ-5 самых опасных грибов России', '2023-09-01 14:30:00+03',
        'Мария Сидорова', 'https://i.imgur.com/dangerous.jpg', NULL,
        'Published',
        'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
        '2023-09-01 14:30:00+03',
        '2023-09-01 14:30:00+03',
        '2023-09-01 14:30:00+03');

-- Insert paragraphs
INSERT INTO public."Paragraphs" ("Id", "ArticleId", "ParagraphText", "SerialNumber", "IsSubtitle")
VALUES ('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'Основные правила безопасности',
        0, true),
       ('4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
        'Никогда не собирайте грибы, в которых вы не уверены.', 1, false),
       ('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '1. Бледная поганка', 0, true);

-- Insert article likes
INSERT INTO public."ArticleLikes" ("Id", "ArticleId", "UserId", "LikeDate")
VALUES
-- Лайки для статьи "Как отличить съедобные грибы от ядовитых"
('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
 '2023-08-15 10:15:00+03'), -- админ
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
 '2023-08-15 11:30:00+03'), -- редактор
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
 '2023-08-16 09:45:00+03'), -- пользователь

-- Лайки для статьи "Топ-5 самых опасных грибов России"
('2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
 '2023-09-01 15:00:00+03'), -- админ
('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
 '2023-09-02 12:20:00+03');
-- пользователь
