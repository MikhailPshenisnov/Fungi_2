using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class UsersRepository : IUsersRepository
{
    private readonly FungiDbContext _context;

    public UsersRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateUser(User user, CancellationToken cancellationToken)
    {
        var userEntity = new Database.Entities.User
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            AvatarPath = user.AvatarPath,
            RoleId = user.Role.Id
        };

        await _context.Users.AddAsync(userEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return userEntity.Id;
    }

    public async Task<List<User>> GetAllUsers(CancellationToken cancellationToken)
    {
        var userEntities = await _context.Users
            .Include(u => u.Role)
            .ThenInclude(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var users = userEntities
            .Select(userEntity =>
            {
                var (role, roleError) = Role
                    .Create(userEntity.Role.Id,
                        userEntity.Role.Name,
                        userEntity.Role.AccessLevel,
                        userEntity.Role.RolePermissions
                            .Select(rp => rp.Permission.Code)
                            .OrderBy(code => code)
                            .ToList());

                if (!string.IsNullOrEmpty(roleError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create a " +
                                                 $"role model: {roleError}");

                var (user, userError) = User
                    .Create(userEntity.Id,
                        userEntity.Username,
                        userEntity.Email,
                        userEntity.PasswordHash,
                        true,
                        role,
                        userEntity.AvatarPath);

                if (!string.IsNullOrEmpty(userError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create a " +
                                                 $"user model: {userError}");

                return user;
            })
            .ToList();

        return users;
    }

    public async Task<Guid> UpdateUser(Guid userId, User newUser, CancellationToken cancellationToken)
    {
        var oldUserEntity = await _context.Users
            .Include(u => u.Role)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (oldUserEntity is null)
            throw new UnknownIdentifierException("Unknown user id");

        await _context.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(u => u.Username, u => newUser.Username)
                    .SetProperty(u => u.Email, u => newUser.Email)
                    .SetProperty(u => u.PasswordHash, u => newUser.PasswordHash)
                    .SetProperty(u => u.AvatarPath, u => newUser.AvatarPath)
                    .SetProperty(u => u.RoleId, u => newUser.Role.Id),
                cancellationToken);

        return oldUserEntity.Id;
    }

    public async Task<Guid> SetUserAvatarPath(Guid userId, string? avatarPath, CancellationToken cancellationToken)
    {
        var numUpdated = await _context.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(u => u.AvatarPath, u => avatarPath),
                cancellationToken);

        if (numUpdated == 0)
            throw new UnknownIdentifierException("Unknown user id");

        return userId;
    }

    public async Task<Guid> DeleteUser(Guid userId, CancellationToken cancellationToken)
    {
        var numDeleted = await _context.Users
            .Where(u => u.Id == userId)
            .ExecuteDeleteAsync(cancellationToken);

        if (numDeleted == 0)
            throw new UnknownIdentifierException("Unknown user id");

        return userId;
    }
}
