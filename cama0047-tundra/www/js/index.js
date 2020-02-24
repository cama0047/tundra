const app = {
    APIactual:"http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?",
    currentData:[],
    currentCard: [],
    likedArray:[],
    imgBaseURL:null,
    likedList:null,
    APP:null,  
    touch:{
        xstart:null, 
        xend:null, 
        dir:null
    },
    init: ()=>{
        app.KEY = "device" in window ? "REVIEW" + device.uuid : "REVIEWTEMPKEY";
        app.fetchData()
        .then(()=>{
            app.createACard()
        })
        .then(()=>{
            app.addListeners()
        })
    },
    
    // creando las cartas
    createACard: ()=>{
        app.currentCard = app.currentData[0];
        // card
        let card = document.querySelector("#cards");
        card.textContent = "";
        // img
        let img = document.createElement("img");
        img.setAttribute("class", "img-home")  
        img.addEventListener("touchstart", app.start);
        img.addEventListener("touchmove", app.move);
        img.addEventListener("touchend", app.end);
        img.addEventListener("touchcancel", app.cancel);

        img.src = "http:" + decodeURIComponent(app.imgBaseURL)+ app.currentCard.avatar;
        img.alt = "cardImg-home";
        // informacion
        let info = document.createElement("div");
        info.setAttribute("class", "info-first");
        // nombre
        let fullName = document.createElement("h1");
        fullName.setAttribute("id", "name");
        fullName.textContent = (app.currentCard.first + " " + app.currentCard.last);
        // prueba nombre
        console.log(fullName);
        // genero
        let gender = document.createElement("img");
        gender.setAttribute("id", "gender");
        //   div para el genero 
        let info2 = document.createElement("div");
        info2.setAttribute("class", "info-second");
        let genderLine = document.createElement("p");
        genderLine.textContent = "Gender: " + app.currentCard.gender;
        // distancia
        let dist = document.createElement("p");
        dist.textContent = "Distance: " + app.currentCard.dist + " away";

        // Dependencias
        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(info2);
        info.appendChild(fullName);
        info.appendChild(gender);
        info2.appendChild(genderLine);
        info2.appendChild(dist);
    },

    fetchData: async() => {
        if (app.currentData.length == 0){
            const res = await fetch(app.APIactual);
            const myJson = await res.json();
            app.imgBaseURL = myJson.imgBaseURL;
            app.currentData = myJson.profiles;
        } else if (app.currentData.length < 3){
            // adicionar mas personas si hay menos de 3
            console.log("Quedan menos de 3!")
            const res = await fetch(app.APIactual);
            // esperamos
            const myJson = await res.json();
            console.log("saliendo de myJson");
            let newData = myJson.profiles;
            newData.forEach(element => {
                app.currentData.push(element);
            });
            console.log("adicionando personas")  
        }   
    },
    // me gustaron
    createLikedList: ()=>{
        let str = sessionStorage.getItem(app.KEY);

        if(str){
            app.likedArray = JSON.parse(str);
        }
        let cardList = document.querySelector(".card-list");
        cardList.textContent = "";
        console.log(app.likedArray)
        document.getElementById("likeNum").textContent = app.likedArray.length++ + " ";

        let title= document.createElement('h2');
        title.textContent='You like this people';
        cardList.appendChild(title);
        
        app.likedArray.forEach(element => {
            let card = document.createElement("div");
            card.setAttribute("class", "card-liked");
            card.setAttribute("id",  Date.now());          
            let imgLiked = document.createElement("img");
            imgLiked.setAttribute("class", "img-liked");
            imgLiked.src = "http:" + decodeURIComponent(app.imgBaseURL) + element.avatar;
            imgLiked.alt = "liked image";
            let infoLiked = document.createElement('div');
            infoLiked.setAttribute("class", "info-liked")
            let cardTop = document.createElement("div");
            cardTop.setAttribute("class", "card-top");
            let cardName = document.createElement("h4");
            cardName.setAttribute("class", "card-name");
            cardName.textContent = element.first + " " + element.last;
            console.log("Valor CardName: "+cardName);
        
            let cardBottom = document.createElement("p");
            cardBottom.setAttribute("class", "card-bottom");
            cardBottom.textContent = "Distance: " + element.distance + " away";
            let deleteBtn = document.createElement("img");
            deleteBtn.setAttribute("class", "delete");
            deleteBtn.src = "./img/delete-btn.svg";
            deleteBtn.alt = "delete-btn"
            deleteBtn.setAttribute("num", element.id);
            deleteBtn.addEventListener("click", app.delete);
            
            // Dependencias
            cardList.appendChild(card);
            card.appendChild(imgLiked);
            card.appendChild(infoLiked);
            infoLiked.appendChild(cardTop);
            cardTop.appendChild(cardName);
            infoLiked.appendChild(cardBottom);
            card.appendChild(deleteBtn); 
                
        });
        // mensaje
        if(document.querySelector(".card-liked") == null){
            let empty = document.createElement("h3");
            empty.textContent = "humm.. you don't have any one in here.Keep looking in Tundra!";
            empty.setAttribute("class", "empty");
            cardList.appendChild(empty);
        }

    },
    // eliminar
    delete: ev=>{
        let btn = ev.target;
        let target = btn.getAttribute("num");
        console.log(target)
        console.log(app.likedArray)
        const index = app.likedArray.findIndex(card => card.id === target);
        console.log(index)
        document.querySelectorAll(".card-liked")[index].classList.add("active");
        app.likedArray.splice(index, 1);
        app.likedArray = app.likedArray.filter(card => card !== null);
        console.log(app.likedArray);
        sessionStorage.setItem(app.KEY, JSON.stringify(app.likedArray));
        setTimeout(() => {
            app.createLikedList();  
        }, 800);

    },
    // sessionStorage
    like: ()=>{
        setTimeout(() => {
            document.querySelector(".trans-like").classList.add("active"); 
        }, 400);               
            app.likedArray.push(app.currentCard);
            app.likedArray = app.likedArray.filter(card => card !== null);
            sessionStorage.setItem(app.KEY, JSON.stringify(app.likedArray));
            app.currentData.shift();
            app.fetchData();
            setTimeout(() => {
                app.createACard();
            }, 500);
 
            setTimeout(() => {
                document.querySelector(".trans-like").classList.remove("active");
            }, 1500);
            

            console.log(sessionStorage.getItem(app.KEY))
            console.log(app.currentData);

    },
    // Dislike
    NEGG: ()=>{
        setTimeout(() => {
            document.querySelector(".trans-nope").classList.add("active"); 
        }, 400);  
        setTimeout(() => {
            app.currentData.shift();
            app.fetchData();
            app.createACard();
        }, 500);
        setTimeout(() => {
            document.querySelector(".trans-nope").classList.remove("active");
        }, 1500);

        
    },
    nav: ev => {
        console.log("entrando a nav")
        let btn = ev.currentTarget;
        console.log("ev target", ev.currentTarget);
        let target = btn.getAttribute("data-target");
        console.log("Navigate to", target);
        document.querySelector(".page.active").classList.remove("active");
        document.getElementById(target).classList.add("active");
        if(target == "liked"){
            app.createLikedList();
        }
    },

    addListeners: (ev)=> {
        document.querySelectorAll(".nav-btn").forEach(element => {
            element.addEventListener("click", app.nav);
        });
       
    },
    start:ev=>{
        app.touch.xstart = ev.touches[0].clientX;
        setTimeout(() => {
            app.touch.xstart = null;
            console.log("that was too long!")
        }, 1000);
    },
    move:ev=>{
        app.touch.xend = ev.touches[0].clientX;
        setTimeout(() => {
            app.touch.xend = null;
            console.log("that was too long!")
        }, 1000);
    },
    end:(ev)=>{
   
        if(app.touch.xend == null && app.touch.start ==null){console.log("xend is null!")}
        else{
        let deltaX = app.touch.xend- app.touch.xstart;
        console.log(app.touch.xend);
        console.log(app.touch.xstart);
        console.log(deltaX);
        if(deltaX > 0){
            app.touch.dir = "right";
        }else{
            app.touch.dir = "left";
            console.log("NOOOOO!");

        }
       
        if(app.touch.dir !== null){
            console.log(app.touch.dir);
            ev.target.classList.add(app.touch.dir);
            if(app.touch.dir == "right"){
                console.log("llamando a app.like");
                app.like();
                console.log("like!");
                app.touch.xstart= null;
                app.touch.xend = null;
                app.touch.dir = null;
            }else{
                console.log("llamando a app.Negg");
                
                app.NEGG();
                app.touch.xstart= null;
                app.touch.xend = null;
                app.touch.dir = null;
            }
        }  
    }
    },
    cancel:()=>{
        console.log(ev);
            app.touch.xstart = null;
            app.touch.xend = null;
            app.touch.dir=null;
    },
    
}
const ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";
document.addEventListener(ready, app.init);
