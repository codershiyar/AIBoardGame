
let SpeelIsBegonnen=  false;
let VeldMap= [];
let VeldIdes= [];
let VeldGrootte = document.getElementById("VeldGrootte");
UpdateLayout()
let TellerTijd = document.getElementById("TellerTijd");
let Interval;
let StandSpeler1=4;
let StandSpeler2=4;

function VeldenDeselecteren(ClassNaam){
    const AllToegestaanVelden = document.querySelectorAll('.'+ClassNaam);
    AllToegestaanVelden.forEach((element) => {
            element.classList.remove(ClassNaam);
    });
}

function KlikOpEigenVak(CoordinateX,CoordinateY,Id){
    VeldenDeselecteren("ToegestaanVelden1"); VeldenDeselecteren("ToegestaanVelden2");
    localStorage.setItem("CoordinateX",CoordinateX)
    localStorage.setItem("CoordinateY",CoordinateY-1 )

    let ToegestaanStappen1 = [Id-1,Id+10,Id+1,Id-10, Id-9,Id-11, Id+9,Id+11]
    ToegestaanStappen1.forEach(VeldId => {
        if(VeldIdes.includes(VeldId)){
            document.getElementById(VeldId).classList.add("ToegestaanVelden1")
        }
    });

    let ToegestaanStappen2 = [Id-2,Id+2,Id+8,Id+12,Id+20,Id+19,Id+18,Id+21,Id+22,Id-20,Id-19,Id-18,Id-21,Id-22,Id-8,Id-12]
    ToegestaanStappen2.forEach(VeldId => {
        if(VeldIdes.includes(VeldId)){
            document.getElementById(VeldId).classList.add("ToegestaanVelden2")
        }
    });
}

function KlikOpVeldenNietVanSpelers (CoordinateX,CoordinateY,Id){
    let Beurt = Number(document.getElementById("Beurt").innerText);
    let ToegestaanVelden = document.querySelectorAll(".ToegestaanVelden1, .ToegestaanVelden2");
    if(ToegestaanVelden.length>0){
     let KanBewegen = false;
       for (let i = 0; i<ToegestaanVelden.length; i++) {
         try {
            if(Id ==ToegestaanVelden[i].id ){
                KanBewegen = true;
                OpslaanVeldInStapel(VeldMap)
                VeldMap[CoordinateY-1][CoordinateX] = Beurt;
                let NieuweId =""+ CoordinateY+ CoordinateX;
                NieuweId = Number(NieuweId)
                if(ToegestaanVelden[i].classList.contains("ToegestaanVelden2")){
                    VeldMap[localStorage.getItem("CoordinateY")][localStorage.getItem("CoordinateX")] = 0;
                }
                BesmettenVijand(NieuweId); VeldAanMaken(VeldMap)
                Beurt = Beurt===2?1:2; document.getElementById("Beurt").innerText =Beurt;
                if(Beurt==2){ setTimeout(() => { StartTegenSpeler1()}, 200); }
            }
        } catch (error) {
            try { document.getElementById("Beurt").innerText =Beurt;  } 
            catch (error) { console.log("Game has started") }
            if(Beurt==2){ setTimeout(() => { StartTegenSpeler1()}, 300); }
        }   
       }
       if(!KanBewegen){ VeldenDeselecteren("ToegestaanVelden1"); VeldenDeselecteren("ToegestaanVelden2") }
    } 
}

function BesmettenVijand(Id){
    let Beurt = Number(document.getElementById("Beurt").innerText);
    let ToegestaanStappen1 = [Id-1,Id+10,Id+1,Id-10, Id-9,Id-11, Id+9,Id+11 ]
    for (let index = 0; index < ToegestaanStappen1.length; ++index) {
        if(ToegestaanStappen1[index]<10 || ToegestaanStappen1[index] > VeldGrootte * 11) continue;
        try {
            var digits = ToegestaanStappen1[index].toString().split('').map(Number);
            let Tegenstanderd = Beurt==2?1:2;
            // Aanzetten aanval achter line
            // if(digits[1] > Number(VeldGrootte.innerText )){
            //     digits[1] = digits[1] - Number(VeldGrootte.innerText ); digits[0] +=1 
            // }
            if(Tegenstanderd==Number(VeldMap[digits[0]-1][digits[1]])){
                VeldMap[digits[0]-1][digits[1]] = Beurt;
            }
        } catch (error) { console.log(error);  }    
    }
}

function HandelVeldklik(GeselecteerdVakIsVan, CoordinateX,CoordinateY,Id){
    let Beurt = Number(document.getElementById("Beurt").innerText);
    if (GeselecteerdVakIsVan>0){
        if (GeselecteerdVakIsVan === Beurt)
            KlikOpEigenVak(CoordinateX,CoordinateY,Id);
        else
            document.getElementById("Alert").innerHTML = "<span class='NietJeBeurt'> Het is niet je Beurt </span> <br> Het is Beurt speler <span id='Beurt'>" +Beurt + "</span>"
    }else
        KlikOpVeldenNietVanSpelers (CoordinateX,CoordinateY,Id); 
}

function StartTegenSpeler1(){
    let VeldenVanSpeler2 = document.getElementsByClassName("Speler2"); 
    var MogelijkeBesmettingenPerElement = []  
    for (let index = 0; index < VeldenVanSpeler2.length; index++) {
        const element = VeldenVanSpeler2[index];
        let Id = element.id;
        let ToegestaanStappen = [Id-1,Id+10,Id+1,Id-10, Id-9,Id-11,Id+9,Id+11,Id-2,Id+2,Id+8,Id+12,Id+20,Id+19,Id+18,Id+21,Id+22,Id-20,Id-19,Id-18,Id-21,Id-22,Id-8,Id-12]
        let MogelijkeBesmettingen = 0;
        ToegestaanStappen.forEach(VeldId => {
            if(VeldIdes.includes(VeldId)){
                if(document.getElementById(VeldId).classList.contains("Speler1"))
                   ++MogelijkeBesmettingen;
            }
        });
        MogelijkeBesmettingenPerElement.push([Id,MogelijkeBesmettingen])
    } KlikOpDeBestVeldVanSpeler2(MogelijkeBesmettingenPerElement)
}


function KlikOpDeBestVeldVanSpeler2(MogelijkeBesmettingenPerElement){
let Gevonden = false;
 MogelijkeBesmettingenPerElement.forEach(Element=>{
        if ((!Gevonden) && Element[1] ===  Math.max(...MogelijkeBesmettingenPerElement.map(o => o[1]))) {
            Gevonden=true;
            document.getElementById(Element[0]).click();
            setTimeout(() => { CheckBestVakVoorAanval();  }, 300);
        }
    })

}

function CheckBestVakVoorAanval(){
    let ToegestaanVelden = document.querySelectorAll('.ToegestaanVelden1,.ToegestaanVelden2');
    let MogelijkeBesmettingenPerVak = []  
    for (let index = 0; index < ToegestaanVelden.length; index++) {
        let Id = ToegestaanVelden[index].id;
        if(!ToegestaanVelden[index].classList[0].includes("Speler")){
            let ToegestaanStappen = [Id-1,Id+10,Id+1,Id-10, Id-9,Id-11, Id+9,Id+11]
            let MogelijkeBesmettingen = 0;
            ToegestaanStappen.forEach(VeldId => {
                if(VeldIdes.includes(VeldId)){
                    if(document.getElementById(VeldId).classList.contains("Speler1") ){
                        MogelijkeBesmettingen++;
                    }
                }
            });
            MogelijkeBesmettingenPerVak.push([Id,MogelijkeBesmettingen])
        } } BeginAiAanval(MogelijkeBesmettingenPerVak)
}


function BeginAiAanval(MogelijkeBesmettingenPerVak){
        let MaxMogelijkeBesmettingen = Math.max(...MogelijkeBesmettingenPerVak.map(o => o[1]))
        let Gevonden = false;
        if(MaxMogelijkeBesmettingen ==0 && MogelijkeBesmettingenPerVak.length>0){
            document.getElementById(MogelijkeBesmettingenPerVak[1][0]).click();
        }else{
            MogelijkeBesmettingenPerVak.forEach(Element=>{
                if (Element[1] ===  MaxMogelijkeBesmettingen) {
                    if (!Gevonden) {
                        document.getElementById(Number(Element[0])).click();
                        Gevonden =true;
                    }
                }
            })
        }
}

let SpeelBegonnenKnop = document.getElementById("SpeelBegonnenKnop");
SpeelBegonnenKnop.onclick = () =>{
    SpeelIsBegonnen=!SpeelIsBegonnen;

    if(SpeelBegonnenKnop.innerText.includes("Eind speel"))
        SpeelAfgelopen()
    else{
        TellerTijd.innerText = 60;
    Interval = setInterval(() => {
        Number(TellerTijd.innerText)> 0 ? TellerTijd.innerText = Number(TellerTijd.innerText)-1: SpeelAfgelopen();
    }, 1000);
    Startopstelling();
}
}

function Startopstelling() {
    SpeelBegonnenKnop.innerText = "End Game"
    SpeelBegonnenKnop.style.background = "rgb(240 81 94)";
    VeldAanMaken(NieuweMapAanmaken())
}
function  SpeelAfgelopen() {
    SpeelBegonnenKnop.innerText = "Begin Game"
    SpeelBegonnenKnop.style.background = "rgb(139 139 255)";
    clearInterval(Interval);
    PrintGewonnenSpeler()
}

function PrintGewonnenSpeler(){
    document.getElementById("Alert").innerHTML = "The game is over." + (StandSpeler1==StandSpeler2? "The score is tied" : StandSpeler1>StandSpeler2?  " Speler 1 heeft gewonen" : " Speler 2 heeft gewonen");
}

function NieuweMapAanmaken(){
    let Grootte = Number(VeldGrootte.innerText)
    let Veld =  []
    localStorage.setItem("VeldGrootte",Grootte)
    for (let i1 = 0; i1<Grootte; i1++){
        let VeldRij = []
        for (let i2 = 0; i2<Grootte; i2++){
            if (i1 < 2)
                VeldRij.length >= Number(localStorage.getItem("VeldGrootte")) - 2 ? VeldRij.push(1): VeldRij.push(0)
            else if (i1 > Number(localStorage.getItem("VeldGrootte")) - 3)
                VeldRij.length === 0 || VeldRij.length === 1 ? VeldRij.push(2): VeldRij.push(0)
            else
                VeldRij.push(0)
        }
        Veld.push(VeldRij)
    }
    return Veld
}

function UpdateStand(){
    StandSpeler1= document.getElementsByClassName("Speler1").length;
    StandSpeler2=document.getElementsByClassName("Speler2").length;
    document.getElementById("StandSpeler1").innerText = StandSpeler1;
    document.getElementById("StandSpeler2").innerText = StandSpeler2;
    if (StandSpeler1 == 0 || StandSpeler2 == 0 ) {
        SpeelAfgelopen()
    }
}

function OpslaanVeldInStapel(Waarde){
    fetch("https://localhost:7102/stapel", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({"Waarde": JSON.stringify(Waarde)}) 
    }).then(Request=> Request.text()).then(Antwoord=>{
        // console.log("Gestuurd: "+ Antwoord)
    }).catch(error=>{
        console.log("Catch error", error)
    })
}

function VeldAanMaken(Veld){
   
    if(StandSpeler1==0 || StandSpeler2==0){
       SpeelAfgelopen()
    }   VeldMap =Veld;
        VeldTemplate(Veld)
       UpdateStand()
       document.getElementById("Terug").onclick = ()=>{
        fetch("https://localhost:7102/stapel").then(Request=> Request.text()).then(Antwoord=>{
            Antwoord = JSON.parse(Antwoord);
            VeldAanMaken(JSON.parse(Antwoord.Waarde))
            // console.log("Terug:" + JSON.parse(Antwoord.Waarde))
        }).catch(error=>{
           NieuweMapAanmaken()
        })
    }   
    UpdateStand()
}
``
function VeldTemplate(Veld){
     VeldIdes = []
    let VeldInhoud =   ` 
    <div class="alert alert-warning p-2" >
        <span id="Alert">Het is Beurt van Speler <span id="Beurt">1</span></span> 
         <div style=" text-align: right;">  <img id="Terug" title="terug" src="public/left-arrow.png" width="40"/></div>
    </div>`
   Object.keys(Veld).map((Rij) => {
    VeldInhoud+= `<div>
     ${
         Veld[Rij].map((Item,Index) => {
             let Vak =  Item >0 ? "Speler" : "LeegVeld";
             Vak = Vak.includes("Speler")? Vak+Item: Vak;
             let Coordinate = {X: Index, Y:Number(Rij)+1}
             let Id = Coordinate.Y+ "" + Coordinate.X;
             VeldIdes.push(Number(Id))
            return ` <button onclick="HandelVeldklik(${Item} , ${Coordinate.X} , ${Coordinate.Y} , ${Id})"  id="${Id}" class="${Vak}"></button>`
         })
     }
        </div>` }
    )
    VeldInhoud+= `</section>`; document.getElementById("Bord").innerHTML = VeldInhoud;
}

function VerhogenVeldGrootte(){
   VeldGrootte.innerText = Number(VeldGrootte.innerText) + 1;
   UpdateLayout()
   VeldAanMaken(NieuweMapAanmaken())
}
function VerlagenVeldGrootte(){
    VeldGrootte.innerText>5?   VeldGrootte.innerText = Number(VeldGrootte.innerText) -1:""
    UpdateLayout()
    VeldAanMaken(NieuweMapAanmaken())

}
function UpdateLayout(){
    document.getElementById("App").style.width = (Number(VeldGrootte.innerText) * 65 ) + "px";
}




