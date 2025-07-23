public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }

    public User(int id, string username, string email, DateTime createdAt)
    {
        Id = id;
        Username = username;
        Email = email;
        CreatedAt = createdAt;
    }

    public override string ToString()
    {
        return $"{Id}: {Username} ({Email}) - Created at: {CreatedAt}";
    }
}  