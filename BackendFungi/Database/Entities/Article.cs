using System;
using System.Collections.Generic;

namespace BackendFungi.Database.Entities;

public partial class Article
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public DateTime? PublishDate { get; set; }

    public virtual ICollection<Paragraph> Paragraphs { get; set; } = new List<Paragraph>();
}
