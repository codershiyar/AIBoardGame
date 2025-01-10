using my_new_app;

namespace App.Tests;

public class StapelTest
{
    [Fact]
    public void TestDuwEnPak()
    {
        Stapel<int> stapel = new Stapel<int>();
        stapel.Duw(15); // toeveogen 15 aan stapel
        stapel.Duw(2); // toeveogen 2 aan stapel
        stapel.Duw(16); // toeveogen 16 aan stapel
        Assert.Equal(16, stapel.Pak()); // geeft 16 terug
        Assert.Equal(2, stapel.Pak());  // geeft 2 terug
        Assert.Equal(15, stapel.Pak()); // geeft 15 terug
    }
    
    [Fact]
    public void TestLegeStapel()
    {
        Stapel<string> stapel = new Stapel<string>();
        Assert.Throws<InvalidOperationException>(() => stapel.Pak());
    }
    
    [Fact]
    public void TestStapelMetString()
    {
        Stapel<string> stapel = new Stapel<string>();
        stapel.Duw("Shiyar");
        stapel.Duw("Tim");
        stapel.Duw("Bart");
        
        Assert.Equal("Bart", stapel.Pak());
        Assert.Equal("Tim", stapel.Pak());
        Assert.Equal("Shiyar", stapel.Pak());
        
    }
    
    [Fact]
    public void TestRandgevallen()
    {
        // Testen met stapel van maximaal 1 element
        Stapel<int> stapel = new Stapel<int>();
        stapel.Duw(1);

        Assert.Equal(1, stapel.Pak());

        // Testen van lege stapel
        stapel = new Stapel<int>();

        Assert.Throws<InvalidOperationException>(() => stapel.Pak());

        // Testen van maximale stapelgrootte
        stapel = new Stapel<int>();
        int maxSize = 1000;
        for (int i = 0; i < maxSize; i++)
        {
            stapel.Duw(i);
        }

        for (int i = maxSize - 1; i >= 0; i--)
        {
            Assert.Equal(i, stapel.Pak());
        }
    }
    
    [Fact]
    public void TestConditionCoverage()
    {
        // Testen of Pak een InvalidOperationException gooit als de stapel leeg is
        Stapel<string> stapel = new Stapel<string>();
        Assert.Throws<InvalidOperationException>(() => stapel.Pak());
    
        // Testen of het toevoegen van null elementen niet toegestaan is
        stapel = new Stapel<string>();
        Assert.Throws<InvalidDataException>(() => stapel.Duw(null));
    }
    
    
    [Fact]
    public void TestMultipleTypes()
    {
        // Testen van stapel met verschillende datatypes
        Stapel<object> stapel = new Stapel<object>();
        stapel.Duw(1);
        stapel.Duw("Test");

        Assert.Equal("Test", stapel.Pak());
        Assert.Equal(1, stapel.Pak());
    }
    
    
}

