async function init(){ //Erforderliche Dateien und HTML laden ---->>>>>> ALT
    //cssLoader("http://127.0.0.1:60312/style.css");
    cssLoader(`http://127.0.0.1:${port}/nsd.css`);
    //cssLoader("http://127.0.0.1:60312/stylesheets/error/error.css");
    document.body.appendChild(createHTML('<div id="info_container"></div>'));
    document.body.appendChild(createHTML('<div id="error_container"></div>'));
    //await scriptLoader(`http://127.0.0.1:${port}/script.js`, initNSD);
    nsdCloud.init();

    console.log("NSD initiiert");
}

var port = 53447;
var wsAdress = "ws://127.0.0.1:3000";


window.onload = ()=>{
    nsdCloud.init();
}


nsdCloud = {
    init(){
        cssLoader(`http://127.0.0.1:${port}/nsd.css`);

        document.body.appendChild(createHTML('<div id="info_container"></div>'));
        document.body.appendChild(createHTML('<div id="error_container"></div>'));

        console.log("NSD initiiert");

        websocket.connect(wsAdress);
        websocket.onload = ()=>{
            //loadNSD() ...... Hier Programm starten
        }
        websocket.onmessage = (message)=>{
            console.log(message);
        }
    },
    start(){
        console.log(urlData);
        message = {
            command: "loadNSD",
            id: "TEST6",
            type: "protected",
            key: "234",
            data: {"MOIN": false}
        }
        websocket.send(message, "nsdHandleMessage");
    }
}


websocket = {
    loaded: false,
    connect(adress){
        socket = new WebSocket(adress);

        socket.onopen = (e)=>{
            this.loaded = true;
            this.onload();
            console.log("Websocket verbunden");
            info.show("Verbindung Hergestellt");
        }

        socket.onmessage = (message)=>{
            this.handleMessage(message);
        }
    },
    send(data){
        if(!this.loaded){
            console.warn("Websocket nicht verbunden");
            error.show("Websocket nicht verbunden");
            return false;
        }

        if(typeof data != "string"){
            data = this.prepareMessage(data);
        }

        try{
            socket.send(data);
            info.show("Nachricht gesendet.");
            return true;
        }
        catch(err){
            error.show("Message konnte nicht gesendet werden.");
            console.error(err);
            return false;
        }
    },
    prepareMessage(message){//Kann verwendet werden, um eine Nachricht vor dem Senden vorzubereiten.
        try{
            return JSON.stringify(message);
        }
        catch{
            error.show("[prepareMessage] failed");
            return "INVALID VALUE";
        }
    },
    onload(){},//Hier kann mit websocket.onload = ()=>{} festgelegt werden, was beim Laden passieren soll.
    handleMessage(message){
        var message = message.data;
        if(typeof message == "string"){
            message = JSON.parse(message);
        }

        if(message.type == "error"){
            console.warn(message.data.error.context);
        }else if(message.type == "data"){

        }
        this.onmessage(message);
    },
    onmessage(message){}//Hier kann mit websocket.onmessage = (message)=>{} festgelegt werden, was beim erhalt einer Serverantwort passieren soll.
}


error = {
    loadContainer(){
        this.container = document.getElementById("error_container");
        return this.container;
    },
    show(content){
        this.loadContainer();
        this.container.innerHTML = content;
        this.container.style.opacity = 1;
            setTimeout(()=>{this.container.style.opacity = 0}, 5000);
        return true;
    },
}

info = {
    loadContainer(){
        this.container = document.getElementById("info_container");
        return this.container;
    },
    show(content){
        this.loadContainer();
        this.container.innerHTML = content;
        this.container.style.opacity = 1;
            setTimeout(()=>{this.container.style.opacity = 0}, 5000);
        return true;
    },
}

function cssLoader(file, callback){ //Ein CSS stylesheet einbetten
    var link = document.createElement("link");
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    link.onload = function(){
        if(typeof(callback) == "function"){
            callback();
        }
    }
}

async function scriptLoader(path, callback){ //Ein JS script einbetten
    var script = document.createElement('script');
    script.type = "text/javascript";
    //script.async = true;
    script.src = path;
    script.onload = function(){  
    if(typeof(callback) == "function"){
        callback();
    }
    }
    try
    {
    var scriptOne = document.getElementsByTagName('script')[0];
    scriptOne.parentNode.insertBefore(script, scriptOne);
    }
    catch(e)
    {
    document.getElementsByTagName("head")[0].appendChild(script);
    }
}

function sleep(ms) { //Sleep funktion, wird ausgelöst mit: await sleep(ms) !!Aufrufende funktion muss asynchron sein!!
  return new Promise(resolve => setTimeout(resolve, ms));
}

function element_add(wert, element, mode){ //Etwas (z.B. Text) zu einem html element hinzufügen
    if(element){
      if(mode){
        if(mode == "add"){
          document.getElementById(element).innerHTML = document.getElementById(element).innerHTML + wert;
        }
        mode = undefined;
      }else{
        document.getElementById(element).innerHTML = wert;
        console.log("container add to element");
        element = undefined;
      }
    }else{
      console.warn("ERROR: -element_add() kein Element angegeben");
    }
}

function createHTML(htmlString) { //HTML element erstellen
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

function Werteliste (querystring) {
    if (querystring == '') return;
    var wertestring = querystring.slice(1);
    var paare = wertestring.split("&");
    var paar, name, wert;
    for (var i = 0; i < paare.length; i++) {
      paar = paare[i].split("=");
      name = paar[0];
      wert = paar[1];
      name = unescape(name).replace("+", " ");
      wert = unescape(wert).replace("+", " ");
      this[name] = wert;
    }
}
var urlData = new Werteliste(location.search);
