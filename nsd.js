window.onload = ()=>{
    init();
}

async function init(){ //Erforderliche Dateien und HTML laden
    //cssLoader("http://127.0.0.1:60312/style.css");
    cssLoader("http://127.0.0.1:60312/nsd.css");
    //cssLoader("http://127.0.0.1:60312/stylesheets/error/error.css");
    document.body.appendChild(createHTML('<div id="info_container"></div>'));
    document.body.appendChild(createHTML('<div id="error_container"></div>'));
    await scriptLoader("http://127.0.0.1:60312/script.js", initNSD);


    console.log("NSD initiiert");
}

function initNSD(){ //Kontakt zum Server aufnehmen / auf Speicherstand checken --> Nachdem client-server-script geladen wurde.
    websocket.start();
}

function loadNSD(id){
    console.log(urlData);
    console.log(websocket);
    if(!id){
        if(urlData.nsd){

        }else{
            console.log("Kein Speicherstand angegeben.");
            message = {
                command: "saveNSD",
                id: "TEST7",
                type: "protected",
                key: "234",
                data: {"MOIN": false}
            }
            websocket.send(JSON.stringify(message), "nsdHandleMessage");
        }
    }else{

    }
}

function nsdHandleMessage(message){
    var message = message.data;
    if(typeof message == "string"){
        message = JSON.parse(message);
    }
    console.log(message);

    if(message.type == "error"){
        console.warn(message.data.error.context);
    }else if(message.type == "data"){

    }
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

