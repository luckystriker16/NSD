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

const srcAdress = "127.0.0.1";
const port = 60367;
const wsAdress = "wss://nsd2.servebeer.com:25565";


window.onload = ()=>{
    nsdCloud.init();
}


nsdCloud = {
    init(){
        cssLoader(`https://luckystriker16.github.io/NSD/nsd.css`);

        document.body.appendChild(createHTML('<div id="info_container"></div>'));
        document.body.appendChild(createHTML('<div id="error_container"></div>'));
        document.body.appendChild(createHTML(`<div id="nsdOverlay" class="nsd_opened">
        <div id="nsdOverlay_close">X</div>
        <h1>Willkommen beim NSD Generator</h1>
        <div class="nsdLoadCloud">
            <h2>NSD aus der Cloud Laden</h2>
            <p>Id</p>
            <input id="nsdIdInput"></input>
            <p>Key (optional)</p>
            <input id="nsdKeyInput"></input>
            <hr width="100%">
            <button onclick="nsdCloud.loadNSD()">Senden</button>
        </div>
    </div>`));
        document.body.appendChild(createHTML(`
            <div id="nsdCloudSave">
                <h4>In der Cloud speichern</h4>
                <p>Id: <input id="nsdSaveIdInput"></input></p>
                <p>Key(optional): <input id="nsdSaveKeyInput"></input></p>
                <button onclick="nsdCloud.saveNSD()">Speichern</button>
            </div>
        `));

        document.getElementById("nsdOverlay_close").addEventListener("click",()=>{
            nsdCloud.hideUI();
        });

        console.log("NSD initiiert");

        websocket.connect(wsAdress);
        websocket.onload = ()=>{
            //loadNSD() ...... Hier Programm starten
            this.start();
        }
        websocket.onmessage = (message)=>{
            console.log(message);
            this.handleMessage(message);
        }
    },
    start(){
        console.log(urlData);
        if(urlData.id){
            this.hideUI();
            message = {
                command: "loadNSD",
                id: urlData.id
            }
            if(urlData.key){
                message.key = urlData.key;
            }
            websocket.send(message, "nsdHandleMessage");
        }else{
            this.showUI();
        }
    },
    handleMessage(message){
        if(message.type == "error"){
            this.handleError(message);
        }else if(message.type == "data"){
            this.showNSD(message.data);
        }
    },
    handleError(message){
        if(message.type == "error"){
            var err = message.data.error;
            error.show(err.context);
        }
    },
    showUI(){
        var ui = document.getElementById("nsdOverlay");
        ui.classList.add("nsd_opened");
        ui.classList.remove("nsd_closed");
    },
    hideUI(){
        var ui = document.getElementById("nsdOverlay");
        ui.classList.remove("nsd_opened");
        ui.classList.add("nsd_closed");
    },
    saveNSD(data){
        console.log("saveNSD noch nicht verfügbar");
        var idInput = document.getElementById("nsdSaveIdInput");
        var keyInput = document.getElementById("nsdSaveKeyInput");
        if(window.location.origin == "https://editor.p5js.org"){
            data = fields;
        }else{
            data = {"Placeholder": true}
        }
        if(idInput.value != ""){
            message = {
                command: "saveNSD",
                type: "open",
                id: idInput.value,
                data: data
            }
            if(keyInput.value != ""){
                message.type = "protected",
                message.key = keyInput.value;
            }
            console.log(message);
            websocket.send(message);
            info.show("Anfrage gesendet");
        }else{
            console.log("Keine Id angegeben");
            error.show("Keine Id angegeben");
        }
    },
    loadNSD(){
        var idInput = document.getElementById("nsdIdInput");
        var keyInput = document.getElementById("nsdKeyInput");
        if(idInput.value != ""){
            message = {
                command: "loadNSD",
                id: idInput.value
            }
            if(keyInput.value != ""){
                message.key = keyInput.value;
            }
            websocket.send(message);
            info.show("Anfrage gesendet");
            this.hideUI();
        }else{
            console.log("Keine Id angegeben");
            error.show("Keine Id angegeben");
        }
    },
    showNSD(data){
        console.log(data);
        if(window.location.origin == "https://editor.p5js.org"){
            console.log("Injeziere NSD")
            // CODE VON NICKs NSD GENERATOR
            let parsedSafeState = data;
            fields = [];
            titleInput.value(parsedSafeState.shift());
            widthSlider.value(parsedSafeState.shift());
            for(let i = 0; i < parsedSafeState.length; i++){
              let tempObj = parseObject(parsedSafeState[i]);
              if(tempObj != null){
                fields.push(tempObj);
              }
            }
        
            for(let i = 0; i < fields.length; i ++){
              fields[i].selected = true;
              fields[i].display();
              fields[i].selected = false;
            }
        }else{
            console.log("Seite ist nicht p5.js");
        }
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

        socket.onerror = (err)=>{
            console.error(`Websocket error`);
            error.show("Ein unbekannter Socketerror ist aufgetreten.");
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
