using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace my_new_app.Controllers;

[ApiController]
[Route("[controller]")]
public class StackController : ControllerBase
{
    private static Stack<String> BoardStack = new Stack<String>();

    [HttpGet()]
    public String GetBoardStack()
    { 
        try
        {
            return BoardStack.Pop();
        }
        catch (System.Exception) { }
       
        return "BoardStack is empty";
    }
    
    [HttpPost()]
    public ActionResult<String> Post([FromBody] Cell NewCell)
    {
        string NewCellJsonString = JsonSerializer.Serialize(NewCell);
        Console.WriteLine(NewCellJsonString);
        BoardStack.Push(NewCellJsonString);
        return NewCellJsonString;
    }
        
    public class Cell
    {
        public string Value { get; set; }
    }
}
