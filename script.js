let status="buy"
const inpt=document.querySelector("#in")
const out=document.querySelector("#out")
let wybor=document.querySelector("#waluta")
let kursy
let kolor
addEventListener("DOMContentLoaded", (event) => {
    kolor=localStorage.getItem("backgroundColor")
    let tekst=localStorage.getItem("textColor")
    if(kolor){
        document.body.style.backgroundColor=kolor
        document.body.style.color=tekst
    }
    let tabela=document.querySelector("#waluty")
    fetch("https://api.nbp.pl/api/exchangerates/tables/C/?format=json")
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            kursy=data[0].rates
            for(const kurs of kursy){
                let punkt=document.createElement("tr")
                punkt.innerHTML=`<td>${kurs.code}</td><td>${kurs.bid.toFixed(2)}</td><td>${kurs.ask.toFixed(2)}</td>`
                tabela.appendChild(punkt)
            }
            for(kurs of kursy){
                const opcja=document.createElement("option")
                opcja.value=kurs.code
                opcja.innerHTML=`${kurs.code}`
                wybor.appendChild(opcja)
            }
        })
})
const mode=document.getElementById("dl")
mode.addEventListener("click",()=>{
    kolor=localStorage.getItem("backgroundColor")
    console.log(kolor)
    if(kolor==="#dcdcdc"){
        document.body.style.backgroundColor="black"
        document.body.style.color="#dcdcdc"
        localStorage.setItem("backgroundColor", "black")
        localStorage.setItem("textColor","#dcdcdc")

    }
    else{
        document.body.style.backgroundColor="#dcdcdc"
        document.body.style.color="#212529"
        localStorage.setItem("backgroundColor", "#dcdcdc")
        localStorage.setItem("textColor", "#212529")
    }
})

let trumpS=document.querySelector("#begint")
trumpS.addEventListener('click',()=>{
    const result=document.querySelector("#qst")
    const btns=document.querySelectorAll(".card")
    let wynik=0
    let tury=0
    result.innerHTML=`${wynik}`
    for(const btn of btns){
        btn.disabled.false
        btn.addEventListener('click',()=>{
            const txtbtn=btn.querySelector('p')
            let los=Math.round((Math.random()*24-12)*10)/10
            if(los<0){
                btn.setAttribute("style","background-color: red")
            }
            else{
                btn.setAttribute("style","background-color: green")
            }
            if(los >10 || los<-10){
                btn.setAttribute("style","background-image: url(trump.png)")
                result.innerHTML=`Niestety, Trump przejął ekonomię. Nie ma ratunku dla gospodarki...`
                setTimeout(()=>{
                    txtbtn.innerHTML=``
                    btn.setAttribute("style","background-image: none")
                }, 1000)
                for(const btn of btns){
                    btn.disabled=true
                }
            }
            else{
                txtbtn.innerHTML=`${los}%`
                wynik+=los
                wynik=Math.round(wynik*10)/10
                result.innerHTML=`${wynik}%`
                setTimeout(()=>{
                    txtbtn.innerHTML=``
                    btn.setAttribute("style"," background-color: #00378a")
                    tury+=1
                }, 1000)
                if(wynik>=25){
                    result.innerHTML=`Gratulacje, wygrałeś w ${tury} turach!`
                    for(const btn of btns){
                    btn.disabled=true
                }
                }
                if(wynik<=-25){
                    for(const btn of btns){
                    btn.disabled=true
                }
                    result.innerHTML=`Niestety, przez ciebie kurs dolara zaliczył spektakularny spadek`
                }
            }
        })
    }
    
})
function quiz(){
    let waluty=['Dolar', 'Euro', 'Funt', 'Frank', 'Korona', 'Lek', 'Rubel', 'Peso', 'Lew','Dinar', 'Złoty']
    let zestawy=[
        {kraj:'USA', waluta:'Dolar'},
        {kraj:'Jemen', waluta:'Dinar'},
        {kraj:'Niemcy', waluta:'Euro'},
        {kraj:'Norwegia', waluta:'Korona'},
        {kraj:'Chile', waluta:'Peso'}
    ]
    let pytanie=document.querySelector("#qst")
    const btns=document.querySelectorAll(".ansr")
    let poprawna=Math.floor(Math.random()*zestawy.length)
    let numer=Math.floor(Math.random()*btns.length)
    let odpowiedzi=[zestawy[poprawna].waluta]
    pytanie.innerHTML=`Jaka waluta obowiązuje w kraju: ${zestawy[poprawna].kraj}`
    for(let i=0;i<4;i++){
        btns[i].disabled=false
        if(i==numer){
            btns[i].innerHTML=`${zestawy[poprawna].waluta}`
        }
        else{
            let wrong
            do{
                wrong=waluty[Math.floor(Math.random()*waluty.length)]
            }while(odpowiedzi.includes(wrong))
            odpowiedzi.push(wrong)
            btns[i].innerHTML=wrong
        }
        const nowyBtn=btns[i].cloneNode(true)
        btns[i].parentNode.replaceChild(nowyBtn, btns[i])
    }  
    const nBtns=document.querySelectorAll(".ansr")
    for(const btn of nBtns){
        btn.addEventListener('click',()=>{
            if(btn.innerHTML==zestawy[poprawna].waluta){
                quiz()
            }
            else{
                pytanie.innerHTML=`Zła odpowiedź. Koniec gry!`
                for(const bs of nBtns){
                    bs.disabled=true
                }
            }
        })
    }
}
const button=document.querySelector("#buySell")
console.log(status)
function przelacz(){
    if(status=="buy"){
        status="sell"
        inpt.placeholder="Wpisz kwotę w wybranej walucie"
    }
    else{
        status="buy"
        inpt.placeholder="Wpisz kwotę w PLN"
    }
}
function licz(){
    if(status=="buy"){
        let kwota=parseFloat(inpt.value)
        let wal=wybor.value
        let mnoznik=kursy.find(k=>k.code==wal)
        let result=kwota*mnoznik.ask
        out.value=result.toFixed(2)
    }
    else{
        let kwota=parseFloat(inpt.value)
        let wal=wybor.value
        let mnoznik=kursy.find(k=>k.code==wal)
        let result=kwota/mnoznik.bid
        out.value=result.toFixed(2)
    }
}
