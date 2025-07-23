public class item
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; }
    public string Source { get; set; }

    public item(int id, string name, string description, decimal price)
    {
        Id = id;
        Name = name;
        Description = description;
        Price = price;
        Image = image;
        Source = source;
    }

    public override string ToString()
    {
        return $"{Id}: {Name} - {Description} (${Price})";
    }
}   