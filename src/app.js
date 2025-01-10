let GameHasStarted=  false;
let FieldMap= [];
let FieldIds= [];
let FieldSize = document.getElementById("FieldSize");
let GameOpeningPage = document.getElementById("App");
let Interval;
UpdateLayout()
let CounterTime = document.getElementById("CounterTime");
let ScorePlayer1=4;
let ScorePlayer2=4;
function DeselectFields(ClassName){
const AllAllowedFields = document.querySelectorAll('.'+ClassName);
AllAllowedFields.forEach((element) => {
element.classList.remove(ClassName);
});
}

function ClickOnOwnField(CoordinateX,CoordinateY,Id){
DeselectFields("AllowedFields1"); DeselectFields("AllowedFields2");
localStorage.setItem("CoordinateX",CoordinateX)
localStorage.setItem("CoordinateY",CoordinateY-1 )
let AllowedSteps1 = [Id-1,Id+10,Id+1,Id-10, Id-9,Id-11, Id+9,Id+11]
AllowedSteps1.forEach(FieldId => {
    if(FieldIds.includes(FieldId)){
        document.getElementById(FieldId).classList.add("AllowedFields1")
    }
});

let AllowedSteps2 = [Id-2,Id+2,Id+8,Id+12,Id+20,Id+19,Id+18,Id+21,Id+22,Id-20,Id-19,Id-18,Id-21,Id-22,Id-8,Id-12]
AllowedSteps2.forEach(FieldId => {
    if(FieldIds.includes(FieldId)){
        document.getElementById(FieldId).classList.add("AllowedFields2")
    }
});

}

function ClickOnFieldsNotFromPlayers(CoordinateX, CoordinateY, Id) {
    let Turn = Number(document.getElementById("Turn").innerText);
    let AllowedFields = document.querySelectorAll(".AllowedFields1, .AllowedFields2");
    if (AllowedFields.length > 0) {
        let CanMove = false;
        for (let i = 0; i < AllowedFields.length; i++) {
            try {
                if (Id == AllowedFields[i].id) {
                    CanMove = true;
                    SaveFieldInStack(FieldMap);
                    FieldMap[CoordinateY - 1][CoordinateX] = Turn;
                    let NewId = "" + CoordinateY + CoordinateX;
                    NewId = Number(NewId);
                    if (AllowedFields[i].classList.contains("AllowedFields2")) {
                        FieldMap[localStorage.getItem("CoordinateY")][localStorage.getItem("CoordinateX")] = 0;
                    }
                    InfectEnemy(NewId);
                    CreateMap(FieldMap);
                    Turn = Turn === 2 ? 1 : 2;
                    document.getElementById("Turn").innerText = Turn;
                    if (Turn == 2) {
                        setTimeout(() => {
                            StartAgainstPlayer1()
                        }, 200);
                    }
                }
            } catch (error) {
                try {
                    document.getElementById("Turn").innerText = Turn;
                } catch (error) {
                    console.log("Game has ended");
                }
                if (Turn == 2) {
                    setTimeout(() => {
                        StartAgainstPlayer1()
                    }, 300);
                }
            }
        }
        if (!CanMove) {
            DeselectFields("AllowedFields1");
            DeselectFields("AllowedFields2");
        }
    }
}

function InfectEnemy(Id) {
    let Turn = Number(document.getElementById("Turn").innerText);
    let AllowedSteps1 = [Id - 1, Id + 10, Id + 1, Id - 10, Id - 9, Id - 11, Id + 9, Id + 11];
    for (let index = 0; index < AllowedSteps1.length; ++index) {
        if (AllowedSteps1[index] < 10 || AllowedSteps1[index] > FieldSize * 11) continue;
        try {
            var digits = AllowedSteps1[index].toString().split('').map(Number);
            let Opponent = Turn == 2 ? 1 : 2;
            // Enable attack behind line
            // if(digits[1] > Number(FieldSize.innerText )){
            //     digits[1] = digits[1] - Number(FieldSize.innerText ); digits[0] +=1 
            // }
            if (Opponent == Number(FieldMap[digits[0] - 1][digits[1]])) {
                FieldMap[digits[0] - 1][digits[1]] = Turn;
            }
        } catch (error) {
            console.log(error);
        }
    }
    UpdateScore();
}


function HandleFieldClick(SelectedBoxIsFrom, CoordinateX, CoordinateY, Id) {
    if(!GameHasStarted)
        return;
    let Turn = Number(document.getElementById("Turn").innerText);
    if (SelectedBoxIsFrom > 0) {
        if (SelectedBoxIsFrom === Turn) {
            ClickOnOwnField(CoordinateX, CoordinateY, Id);
        } else {
            document.getElementById("Alert").innerHTML = "<span class='NotYourTurn'>  It's not your territory </span> <br> It's Player's Turn <span id='Turn'>" + Turn + "</span>";
        }
    } else {
        ClickOnFieldsNotFromPlayers(CoordinateX, CoordinateY, Id);
    }
}
function StartAgainstPlayer1() {
    let FieldsOfPlayer2 = document.getElementsByClassName("Player2");
    let PossibleInfectionsPerElement = [];
    for (let index = 0; index < FieldsOfPlayer2.length; index++) {
        const element = FieldsOfPlayer2[index];
        let Id = element.id;
        let AllowedSteps = [Id - 1, Id + 10, Id + 1, Id - 10, Id - 9, Id - 11, Id + 9, Id + 11, Id - 2, Id + 2, Id + 8, Id + 12, Id + 20, Id + 19, Id + 18, Id + 21, Id + 22, Id - 20, Id - 19, Id - 18, Id - 21, Id - 22, Id - 8, Id - 12];
        let PossibleInfections = 0;
        AllowedSteps.forEach(FieldId => {
            if (FieldIds.includes(FieldId)) {
                if (document.getElementById(FieldId).classList.contains("Player1")) {
                    ++PossibleInfections;
                }
            }
        });
        PossibleInfectionsPerElement.push([Id, PossibleInfections]);
    }
    ClickOnTheBestFieldOfPlayer2(PossibleInfectionsPerElement);
}

function ClickOnTheBestFieldOfPlayer2(PossibleInfectionsPerElement) {
    let Found = false;
    PossibleInfectionsPerElement.forEach(Element => {
        if ((!Found) && Element[1] === Math.max(...PossibleInfectionsPerElement.map(o => o[1]))) {
            Found = true;
            document.getElementById(Element[0]).click();
            setTimeout(() => {
                CheckBestBoxForAttack();
            }, 300);
        }
    });
}


function CheckBestBoxForAttack() {
    let AllowedFields = document.querySelectorAll('.AllowedFields1,.AllowedFields2');
    let PossibleInfectionsPerBox = [];
    for (let index = 0; index < AllowedFields.length; index++) {
        let Id = AllowedFields[index].id;
        if (!AllowedFields[index].classList[0].includes("Player")) {
            let AllowedSteps = [Id - 1, Id + 10, Id + 1, Id - 10, Id - 9, Id - 11, Id + 9, Id + 11];
            let PossibleInfections = 0;
            AllowedSteps.forEach(FieldId => {
                if (FieldIds.includes(FieldId)) {
                    if (document.getElementById(FieldId).classList.contains("Player1")) {
                        PossibleInfections++;
                    }
                }
            });
            PossibleInfectionsPerBox.push([Id, PossibleInfections]);
        }
    }
    BeginAiAttack(PossibleInfectionsPerBox);
}

function BeginAiAttack(PossibleInfectionsPerBox) {
    let MaxPossibleInfections = Math.max(...PossibleInfectionsPerBox.map(o => o[1]));
    let Found = false;
    if (MaxPossibleInfections == 0 && PossibleInfectionsPerBox.length > 0) {
        document.getElementById(PossibleInfectionsPerBox[1][0]).click();
    } else {
        PossibleInfectionsPerBox.forEach(Element => {
            if (Element[1] === MaxPossibleInfections) {
                if (!Found) {
                    document.getElementById(Number(Element[0])).click();
                    Found = true;
                }
            }
        });
    }
}
let GameStartedButton = document.getElementById("GameStartedButton");
GameStartedButton.onclick = () => {
    if (GameHasStarted) {
        // End the game
        GameHasStarted = false;
        GameStartedButton.innerText = "BEGIN GAME";
        GameStartedButton.style.background = "rgb(139 139 255)";
        clearInterval(Interval);
        PrintWinner();
        GameOpeningPage(); // Reset to landing page
    } else {
        // Start the game
        GameHasStarted = true;
        GameStartedButton.innerText = "END GAME";
        GameStartedButton.style.background = "rgb(240 81 94)";
        CounterTime.innerText = 60;
        Interval = setInterval(() => {
            if (Number(CounterTime.innerText) > 0) {
                CounterTime.innerText = Number(CounterTime.innerText) - 1;
            } else {
                GameOver();
            }
        }, 1000);
        StartingLineUp();
    }
};

function StartingLineUp(){
    GameStartedButton.innerText = "END GAME"
    GameStartedButton.style.background = "rgb(240 81 94)";
    CreateMap( NewMap())
}
function  GameOver(){
    GameStartedButton.innerText = "BEGIN GAME"
    GameStartedButton.style.background = "rgb(139 139 255)";
    clearInterval(Interval);
    PrintWinner();
}

function PrintWinner(){
    document.getElementById("Alert").innerHTML = "Game is over." + (ScorePlayer1==ScorePlayer2? " Game is tied." : ScorePlayer1>ScorePlayer2?  " Player 1 has won" : " Player 2 has won");
}

function  NewMap(){
    let Size = Number(FieldSize.innerText)
    
    let Fields= []
    localStorage.setItem("FieldSize",Size)
    for (let i1 = 0; i1<Size; i1++){
        let Fieldij = []
        for (let i2 = 0; i2<Size; i2++){
            if (i1 < 2)
                Fieldij.length >= Number(localStorage.getItem("FieldSize")) - 2 ? Fieldij.push(1): Fieldij.push(0)
            else if (i1 > Number(localStorage.getItem("FieldSize")) - 3)
                Fieldij.length === 0 || Fieldij.length === 1 ? Fieldij.push(2): Fieldij.push(0)
            else
                Fieldij.push(0)
        }
       Fields.push(Fieldij);
    }
    return Fields
}

function EndPlay() {
    clearInterval(Interval); // Stop the timer
    GameHasStarted = false; // Update game state
    GameStartedButton.innerText = "BEGIN GAME"; 
    GameStartedButton.style.background = "rgb(139 139 255)";
    PrintWinner(); // Display the winner
}

function EndPlaywowinner() {
    if (!Interval) {
        console.error("Interval is not initialized!");
        return;
    }clearInterval(Interval); // Stop the timer
    GameHasStarted = false; // Update game state
    GameStartedButton.innerText = "BEGIN GAME"; 
    GameStartedButton.style.background = "rgb(139 139 255)";
}

function UpdateScore() {
    ScorePlayer1 = document.getElementsByClassName("Player1").length;
    ScorePlayer2 = document.getElementsByClassName("Player2").length;
    document.getElementById("ScorePlayer1").innerText = ScorePlayer1;
    document.getElementById("ScorePlayer2").innerText = ScorePlayer2;
    if (ScorePlayer1 === 0 || ScorePlayer2 === 0) {
        EndPlay();
    }
}

function SaveFieldInStack(Value) {
    fetch("https://localhost:7102/stack", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "Value": JSON.stringify(Value) })
    }).then(Request => Request.text()).then(Response => {
        console.log("Sent: " + Response);
    }).catch(error => {
        console.log("Catch error", error);
    });
}

function CreateMap(Field) {
    if (ScorePlayer1 == 0 || ScorePlayer2 == 0) {
        EndPlay();
    }
    FieldMap = Field;
    FieldTemplate(Field);
    UpdateScore();
    document.getElementById("Back").onclick = () => {
        fetch("https://localhost:7102/stack")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch the stack data");
                }
                return response.text();
            })
            .then((responseText) => {
                let responseData = JSON.parse(responseText);
                if (responseData && responseData.Value) {
                    CreateMap(JSON.parse(responseData.Value));
                } else {
                    console.log("No previous state available in the stack.");
                    alert("No previous state available.");
                }
            })
            .catch((error) => {
                console.error("Error fetching previous state:", error);
                alert("Unable to fetch the previous state. Resetting to a new map.");
                CreateMap(NewMap());
            });
    };
    UpdateScore();
}


function FieldTemplate(Field) {
    FieldIds = [];
    let FieldContent = `
    <div class="alert alert-warning p-2" >
        <span id="Alert">It's Turn of Player <span id="Turn">1</span></span>
        <div style="text-align: right;">  <img id="Back" title="back" src="public/left-arrow.png" width="40"/></div>
    </div>`;
    Object.keys(Field).map((Row) => {
        FieldContent += `<div>
        ${
            Field[Row].map((Item, Index) => {
                let Cell = Item > 0 ? "Player" : "EmptyField";
                Cell = Cell.includes("Player") ? Cell + Item : Cell;
                let Coordinate = { X: Index, Y: Number(Row) + 1 };
                let Id = Coordinate.Y + "" + Coordinate.X;
                FieldIds.push(Number(Id));
                return ` <button onclick="HandleFieldClick(${Item} , ${Coordinate.X} , ${Coordinate.Y} , ${Id})"  id="${Id}" class="${Cell}"></button>`;
            })
        }
        </div>`;
    });
    FieldContent += `</section>`;
    document.getElementById("Board").innerHTML = FieldContent;
}

function IncreaseFieldSize() {
    FieldSize.innerText = Number(FieldSize.innerText) + 1;
    UpdateLayout();
    CreateMap(NewMap());
}

function DecreaseFieldSize() {
    FieldSize.innerText > 4 ? FieldSize.innerText = Number(FieldSize.innerText) - 1 : "";
    UpdateLayout();
    CreateMap(NewMap());
}

function UpdateLayout() {
    EndPlaywowinner();
    document.getElementById("App").style.width = (Number(FieldSize.innerText) * 65) + "px";
}