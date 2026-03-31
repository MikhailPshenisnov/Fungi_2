namespace BackendFungi.Models.Other;

public static class PermissionCodes
{
    public const string RolesRead = "rbac.roles.read";
    public const string RolesManage = "rbac.roles.manage";
    public const string PermissionsRead = "rbac.permissions.read";
    public const string PermissionsManage = "rbac.permissions.manage";

    public const string UsersRead = "users.read";
    public const string UsersManage = "users.manage";
    public const string UsersDelete = "users.delete";

    public const string ArticlesWrite = "content.articles.write";
    public const string ArticlesReview = "content.articles.review";
    public const string ArticlesPublish = "content.articles.publish";
    public const string ArticlesArchive = "content.articles.archive";
    public const string ArticlesManageAny = "content.articles.manage-any";
    public const string ArticlesPurge = "content.articles.purge";
    public const string ArticlesDelete = "content.articles.delete";
    public const string ArticleMediaWrite = "content.article-media.write";
    public const string MushroomsWrite = "content.mushrooms.write";
    public const string MushroomsReview = "content.mushrooms.review";
    public const string MushroomsPublish = "content.mushrooms.publish";
    public const string MushroomsArchive = "content.mushrooms.archive";
    public const string MushroomsManageAny = "content.mushrooms.manage-any";
    public const string MushroomsPurge = "content.mushrooms.purge";
    public const string MushroomMediaWrite = "content.mushroom-media.write";
    public const string MushroomsDelete = "content.mushrooms.delete";
    public const string ArticleMushroomsWrite = "content.article-mushrooms.write";

    public const string ProfileEditorMaterialsRead = "profile.editor.materials.read";
    public const string ProfileEditorDraftsRead = "profile.editor.drafts.read";
    public const string ProfileEditorModerationQueueRead = "profile.editor.moderation-queue.read";

    public const string ProfileJaModerationRead = "profile.ja.moderation.read";
    public const string ProfileJaReportsRead = "profile.ja.reports.read";
    public const string ProfileJaUsersRead = "profile.ja.users.read";

    public const string ProfileAdminUsersRolesRead = "profile.admin.users-roles.read";
    public const string ProfileAdminActionLogsRead = "profile.admin.action-logs.read";

    public const string ProfileSuSystemRead = "profile.su.system.read";
    public const string ProfileSuAuditRead = "profile.su.audit.read";
    public const string ProfileSuConfigRead = "profile.su.config.read";
}
