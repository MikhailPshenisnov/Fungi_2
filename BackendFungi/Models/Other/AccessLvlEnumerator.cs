namespace BackendFungi.Models.Other;

public enum AccessLevelEnumerator
{
    SuperUser = 0,
    AdministratorMax = 1,
    AdministratorMin = 5,
    JuniorAdministratorMax = 6,
    JuniorAdministratorMin = 18,
    Editor = 19,
    CommonUser = 20
}