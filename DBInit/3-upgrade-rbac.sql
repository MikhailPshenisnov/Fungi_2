CREATE TABLE IF NOT EXISTS public."Permissions" (
  "Id" uuid PRIMARY KEY NOT NULL,
  "Code" character varying(128) NOT NULL,
  "Name" character varying(64) NOT NULL,
  "Description" character varying(512),
  "IsSystem" boolean NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX IF NOT EXISTS permissions_unique_code ON public."Permissions" USING btree ("Code");

CREATE TABLE IF NOT EXISTS public."RolePermissions" (
  "RoleId" uuid NOT NULL,
  "PermissionId" uuid NOT NULL,
  PRIMARY KEY ("RoleId", "PermissionId"),
  FOREIGN KEY ("RoleId") REFERENCES public."Roles" ("Id") ON DELETE CASCADE,
  FOREIGN KEY ("PermissionId") REFERENCES public."Permissions" ("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "fki_RolePermissions_RoleId_fkey" ON public."RolePermissions" USING btree ("RoleId");
CREATE INDEX IF NOT EXISTS "fki_RolePermissions_PermissionId_fkey" ON public."RolePermissions" USING btree ("PermissionId");

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
       ('10000000-0000-0000-0000-000000000023', 'profile.su.config.read', 'Profile superuser config tab', 'Access superuser config tab', true)
ON CONFLICT ("Code") DO NOTHING;

-- SuperUser (access = 0) gets all permissions
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
CROSS JOIN public."Permissions" p
WHERE r."AccessLevel" = 0
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Administrator (access 1..5)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'rbac.roles.read',
    'rbac.roles.manage',
    'rbac.permissions.read',
    'users.read',
    'users.manage',
    'users.delete',
    'content.articles.write',
    'content.articles.delete',
    'content.mushrooms.write',
    'content.mushrooms.delete',
    'content.article-mushrooms.write',
    'profile.editor.materials.read',
    'profile.editor.drafts.read',
    'profile.editor.moderation-queue.read',
    'profile.ja.moderation.read',
    'profile.ja.reports.read',
    'profile.ja.users.read',
    'profile.admin.users-roles.read',
    'profile.admin.action-logs.read'
)
WHERE r."AccessLevel" BETWEEN 1 AND 5
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Junior administrator (access 6..18)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'users.read',
    'users.manage',
    'content.articles.write',
    'content.articles.delete',
    'content.mushrooms.write',
    'content.mushrooms.delete',
    'content.article-mushrooms.write',
    'profile.editor.materials.read',
    'profile.editor.drafts.read',
    'profile.editor.moderation-queue.read',
    'profile.ja.moderation.read',
    'profile.ja.reports.read',
    'profile.ja.users.read'
)
WHERE r."AccessLevel" BETWEEN 6 AND 18
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- Editor (access = 19)
INSERT INTO public."RolePermissions" ("RoleId", "PermissionId")
SELECT r."Id", p."Id"
FROM public."Roles" r
JOIN public."Permissions" p ON p."Code" IN (
    'content.articles.write',
    'content.mushrooms.write',
    'content.article-mushrooms.write',
    'profile.editor.materials.read',
    'profile.editor.drafts.read',
    'profile.editor.moderation-queue.read'
)
WHERE r."AccessLevel" = 19
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;
