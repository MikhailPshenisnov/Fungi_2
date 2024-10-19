using System;
using System.Collections.Generic;

namespace BackendFungi.DataBase.Entities;

public partial class Paragraph
{
    public int Id { get; set; }

    public int ArticleId { get; set; }

    public string? ParagraphText { get; set; }

    public int SerialNumber { get; set; }

    public virtual Article Article { get; set; } = null!;
}
