using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Services;

public class UsersService : IUsersService
{
    private readonly IUsersRepository _usersRepository;

    public UsersService(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    // Creates a new user in the system via the repository
    // Parameters: user model with user data and cancellation token
    // Returns: guid of the created user
    public async Task<Guid> CreateUserAsync(User user, CancellationToken cancellationToken)
    {
        var createdUserId = await _usersRepository.CreateUser(user, cancellationToken);

        return createdUserId;
    }

    // Retrieves a user by its guid from the repository
    // Parameters: guid of the user and cancellation token
    // Returns: user model if found or throws UnknownIdentifierException if the user guid is unknown
    public async Task<User> GetUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var allUsers = await _usersRepository.GetAllUsers(cancellationToken);

        var user = allUsers.FirstOrDefault(u => u.Id == userId);

        if (user == null)
            throw new UnknownIdentifierException("Unknown user id");

        return user;
    }

    // Retrieves a filtered list of user based on the provided filter from the repository
    // Parameters: optional user filter model to filter users and cancellation token
    // Returns: list of user models matching the filter, sorted by username
    public async Task<List<User>> GetFilteredUsersAsync(UserFilter? userFilter, CancellationToken cancellationToken)
    {
        var users = await _usersRepository.GetAllUsers(cancellationToken);

        if (userFilter is null)
            return users;

        if (userFilter.PartOfUsername is not null)
        {
            users = users
                .Where(u => u.Username.ToLower().Contains(userFilter.PartOfUsername.ToLower()))
                .ToList();
        }

        if (userFilter.PartOfEmail is not null)
        {
            users = users
                .Where(u => u.Email != null &&
                            u.Email.ToLower().Contains(userFilter.PartOfEmail.ToLower()))
                .ToList();
        }

        if (userFilter.RoleId is not null)
        {
            users = users
                .Where(u => u.Role.Id == userFilter.RoleId)
                .ToList();
        }

        return users.OrderBy(u => u.Username).ToList();
    }

    // Updates an existing user in the system via the repository
    // Parameters: guid of the user, user model with updated data, and cancellation token
    // Returns: guid of the updated user
    public async Task<Guid> UpdateUserAsync(Guid userId, User newUser, CancellationToken cancellationToken)
    {
        var updatedUserId = await _usersRepository.UpdateUser(userId, newUser, cancellationToken);

        return updatedUserId;
    }

    // Updates avatar path for a user via the repository
    // Parameters: guid of the user, new avatar path (or null to clear), and cancellation token
    // Returns: guid of the updated user
    public async Task<Guid> SetUserAvatarPathAsync(Guid userId, string? avatarPath, CancellationToken cancellationToken)
    {
        var updatedUserId = await _usersRepository.SetUserAvatarPath(userId, avatarPath, cancellationToken);

        return updatedUserId;
    }

    // Deletes a user from the system via the repository
    // Parameters: guid of the user and cancellation token
    // Returns: guid of the deleted user
    public async Task<Guid> DeleteUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var deletedUserId = await _usersRepository.DeleteUser(userId, cancellationToken);

        return deletedUserId;
    }
}
