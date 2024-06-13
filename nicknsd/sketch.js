const version = "v0.3.3";

var widthSlider;
var newProcessButton;
var newIfButton;
var newCheckFirstLoopButton;
var newCheckLastLoopButton;
var newFixedLoopButton;
var newSubroutineButton;
var titleInput;
var fontSelector;

var fieldContentInput;
var fieldHeightSlider;
var fieldTextArea;

var maxY = 100;

var fields = [];

var lastTouchesLength = 0;

var saveImgButton;

var saveToStorageButton;
var loadFromStorageButton;


function setup() {
  createCanvas(400, 400);
 //input Elements for all fields
  fieldContentInput = createInput();
  fieldContentInput.position(420, 70);
  fieldContentInput.size(370);
  fieldContentInput.hide();
  
  fieldHeightSlider = createSlider(30, 3000, 30, 30);
  fieldHeightSlider.position(800, 70);
  fieldHeightSlider.size(500);
  fieldHeightSlider.hide();
  
  fieldTextArea = createElement('textarea');
  fieldTextArea.position(width + 10, 100);
  fieldTextArea.size(100, 200);
  fieldTextArea.hide();
  
  
  
  //create canvas width slider
  widthSlider = createSlider(400, 2400, 800, 10);
  widthSlider.position(10,10);
  widthSlider.size(windowWidth - 20);
  
  // ---- BUTTONS ----
  //Create Button for new Process
  newProcessButton = createButton("Prozess");
  newProcessButton.position(10, 40);
  newProcessButton.mouseReleased(newProcess);
  
  //Create Button for new If
  newIfButton = createButton("Abzweigung");
  newIfButton.position(70, 40);
  newIfButton.mouseReleased(newIf);
  
  //Create Button for new Check First Loop
  newCheckFirstLoopButton = createButton("Abweisende Schleife");
  newCheckFirstLoopButton.position(160, 40);
  newCheckFirstLoopButton.mouseReleased(newCheckFirstLoop);
  
  //Create Button for new Check Last Loop
  newCheckLastLoopButton = createButton("Nichtabweisende Schleife");
  newCheckLastLoopButton.position(300, 40);
  newCheckLastLoopButton.mouseReleased(newCheckLastLoop);
  
  //Create Button for new Fixed Loop
  newFixedLoopButton = createButton("Zählergesteuerte Schleife");
  newFixedLoopButton.position(470, 40);
  newFixedLoopButton.mouseReleased(newFixedLoop);
  
  //Create Button for new Fixed Loop
  newSubroutineButton = createButton("Unterprogramm");
  newSubroutineButton.position(640, 40);
  newSubroutineButton.mouseReleased(newSubroutine);
  
  //Create Button to save as Image
  saveImgButton = createButton("Als Bild speichern");
  saveImgButton.position(10, height + 110);
  saveImgButton.mouseReleased(saveDiagram);
  
  //Create Button to save to localStorage
  saveToStorageButton = createButton("Im lokalem Speicher sichern");
  saveToStorageButton.position(400, height + 140);
  saveToStorageButton.mouseReleased(saveToStorage);
  
  //Create Button to load from localStorage
  loadFromStorageButton = createButton("Aus lokalem Speicher laden");
  loadFromStorageButton.position(600, height + 140);
  loadFromStorageButton.mouseReleased(loadFromStorage);
  
  //Save Name Input
  saveNameInput = createInput("");
  saveNameInput.position(400, height + 110);
  saveNameInput.size(360);
  saveNameInput.attribute('placeholder', 'Speicherstandname');
  
  //Create Button to destroy everything
  deleteAllButton = createButton("Alles Löschen");
  deleteAllButton.position(10, height + 170);
  deleteAllButton.mouseReleased(deleteEverything);
  
  
  //TitleInput
  titleInput = createInput("Nassi-Shneidermann Diagramm");
  titleInput.position(10, 70);
  titleInput.size(400);
  
  //Font Selector
  fontSelector = createSelect();
  fontSelector.position(140, height + 110);
  fontSelector.option('Sans Serif', 'sans-serif');
  fontSelector.option('Times New Roman', 'times new roman');
  fontSelector.option('Calibri', 'calibri');
  fontSelector.option('Georgia', 'georgia');
  fontSelector.option('Courier New', 'courier new');
  fontSelector.option('Georgia', 'georgia');
  fontSelector.option('Impact', 'impact');
  fontSelector.option('🌈', 'webdings');
  
  
  fields.push(new HiddenField(20, 0, width - 40, 50));
  
  autoload();
}

function draw() {    
  updateCanvasSize(); //update canvas width from slider
  
  saveImgButton.position(10, height + 110);
  fontSelector.position(140, height + 110);
  saveToStorageButton.position(width - 380, height + 140);
  loadFromStorageButton.position(width - 180, height + 140);
  saveNameInput.position(width - 380, height + 110);
  fieldTextArea.position(width + 10, 100);
  deleteAllButton.position(10, height + 170);
  
  
  textFont(fontSelector.value());
  
  background("white");
  
  drawTitle(titleInput.value(), width/2, 25, 40);
  for(let i = 0; i < fields.length; i++){
    fields[i].display();
  }
  
  if(touches.length == 1 && lastTouchesLength == 0){
    mousePressed();
  }
  lastTouchesLength = touches.length;
  
  if(frameCount % 50 == 0){
    autosave();
  }
}

// -------------------------------------------------- CLASSES --------------------------------------------------

//  ----------------  PROCESS
class Process{
  constructor(_content, _x, _y, _w, _h){
    this.type = "process";
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.selected = false;
    this.selected_old = false;
    this.connected = false;
    this.content = _content
    
    //this.inputElements = [];
    //this.inputElements.push(createInput(_content));
    //this.inputElements[0].position(420, 70);
    //this.inputElements[0].size(370);
    //this.inputElements[0].hide();
    //this.inputElements[1] = createSlider(1, 100, 1, 1);
    //this.inputElements[1].position(800, 70);
    //this.inputElements[1].size(500);
    //this.inputElements[1].hide();
    
    this.connectors = [new Connector(this.x, this.y + this.h, this.w)];
  }
  
  display(){
    if(this.selected && !this.selected_old){
      fieldHeightSlider.value(this.h);
      fieldContentInput.value(this.content);
      fieldHeightSlider.show();
      fieldContentInput.show();
    }
    if(!this.selected && this.selected_old){
      fieldHeightSlider.hide();
      fieldContentInput.hide();
    }
    if(this.selected){
      this.h = fieldHeightSlider.value();
      this.content = fieldContentInput.value();
    }
    
    if(this.selected && mouseIsPressed){
      if(mouseOnCanvas()){
        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
      }
      
      let connectionCandidates = [];
      for(let i = 0; i < fields.length; i++){
        if(fields[i] != this){
          for(let j = 0; j < fields[i].connectors.length; j++){
            if(dist(this.x, this.y, fields[i].connectors[j].x, fields[i].connectors[j].y) < 20){
              connectionCandidates.push(fields[i].connectors[j]);
            }
          }
        }
      }
      if(connectionCandidates.length >= 1){
        let maxSize = 20;
        let biggestConnectorIndex = -1;
        for(let i = 0; i < connectionCandidates.length; i++){
          if(connectionCandidates[i].w >= maxSize){
            maxSize = connectionCandidates[i].w;
            biggestConnectorIndex = i;
          }
        }
        if(biggestConnectorIndex >= 0){
          this.connected = connectionCandidates[biggestConnectorIndex];
        }
      }
      else{
        this.connected = false;
        this.w = 200;
      }
    }
    
    
    if(this.selected){
      if(keyIsPressed && keyCode === DELETE){
        killField(this);
      }
    }
    
      
    if(this.connected != false){
      this.x = this.connected.x;
      this.y = this.connected.y;
      this.w = this.connected.w;
    }
    
    
    
    strokeWeight(2);
    if(this.selected){
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
    
    fill("rgba(255,255,255,0.8)");
    rect(this.x, this.y, this.w, this.h);
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(LEFT, CENTER);
    text(this.content, this.x + 10, this.y + this.h/2, this.w - 20);
    
    for(let i = 0; i < this.connectors.length; i++){
      this.connectors[i].x = this.x;
      this.connectors[i].y = this.y + this.h;
      this.connectors[i].w = this.w;
    }  
    
    
    
    this.selected_old = this.selected;
  }
}


//  ----------------  IF
class If{
  constructor(_content, _x, _y, _w, _h){
    this.type = "if";
    this.content = _content
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.options = '1;1\n2;1\nØ;1';
    this.subfieldspacing = 60;
    this.selected = false;
    this.selected_old = false;
    this.connected = false;

    
    this.connectors = [new Connector(this.x, this.y + this.h + this.subfieldspacing, this.w)];
  }
  
  display(){
    if(this.selected && !this.selected_old){
      fieldHeightSlider.value(this.subfieldspacing + 30);
      fieldContentInput.value(this.content);
      fieldTextArea.value(this.options);
      fieldHeightSlider.show();
      fieldContentInput.show();
      fieldTextArea.show();
    }
    if(!this.selected && this.selected_old){
      fieldHeightSlider.hide();
      fieldContentInput.hide();
      fieldTextArea.hide();
    }
    if(this.selected){
      this.subfieldspacing = fieldHeightSlider.value() - 30;
      this.content = fieldContentInput.value();
      this.options = fieldTextArea.value();
    }
    
    
    
    let options = this.options.split("\n");
    let totalWidth = 0;
    
    for(let i = 0; i < options.length; i++){
      options[i] = options[i].split(";");
      if(options[i].length == 1){
        options[i].push(1);
      }
      else{
        options[i][1] = Number(options[i][1]);
        if(isNaN(options[i][1]) || options[i][1] <= 0){
          options[i][1] = 1;
        }
      }
      totalWidth += options[i][1];
      
    }
    
    let connectorDifference = options.length - this.connectors.length + 1; //Greater than zero -> to little connectors
    if(connectorDifference > 0){
      for(let i = 0; i < connectorDifference; i++){
        this.connectors.push(new Connector(this.x, this.y + this.h, 0));
      }
    }
    else if(connectorDifference < 0){
      for(let i = 0; i < connectorDifference * -1; i++){
        this.connectors.pop();
      }
    }
    let tempXoffset = 0
    for(let i = 1; i < this.connectors.length; i++){
      this.connectors[i].x = this.x + tempXoffset;
      this.connectors[i].y = this.y + this.h;
      this.connectors[i].w = (this.w/this.connectors.length) * (options[i - 1][1] / totalWidth) * this.connectors.length;
      tempXoffset += this.connectors[i].w;
    }
    this.connectors[0].x = this.x;
    this.connectors[0].y = this.y + this.h + this.subfieldspacing;
    this.connectors[0].w = this.w;
    
    
    if(this.selected && mouseIsPressed){
      if(mouseOnCanvas()){
        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
      }
      

      let connectionCandidates = [];
      for(let i = 0; i < fields.length; i++){
        if(fields[i] != this){
          for(let j = 0; j < fields[i].connectors.length; j++){
            if(dist(this.x, this.y, fields[i].connectors[j].x, fields[i].connectors[j].y) < 20){
              connectionCandidates.push(fields[i].connectors[j]);
            }
          }
        }
      }
      if(connectionCandidates.length >= 1){
        let maxSize = 20;
        let biggestConnectorIndex = -1;
        for(let i = 0; i < connectionCandidates.length; i++){
          if(connectionCandidates[i].w >= maxSize){
            maxSize = connectionCandidates[i].w;
            biggestConnectorIndex = i;
          }
        }
        if(biggestConnectorIndex >= 0){
          this.connected = connectionCandidates[biggestConnectorIndex];
        }
      }
      else{
        this.connected = false;
        this.w = 200;
      }
    }
    
    
    if(this.selected){
      if(keyIsPressed && keyCode === DELETE){
        killField(this);
      }
    }
    if(this.connected != false){
      this.x = this.connected.x;
      this.y = this.connected.y;
      this.w = this.connected.w;
    }
    
    
    
    strokeWeight(2);
    
    if(this.selected){
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
  
    
    fill("rgba(255,255,255,0.8)");
    rect(this.x, this.y, this.w, this.h);
    
    if(this.subfieldspacing != 0){
      line(this.connectors[0].x, this.connectors[0].y, this.connectors[0].x + 10, this.connectors[0].y);
      line(this.connectors[0].x, this.connectors[0].y, this.connectors[0].x, this.connectors[0].y + 10);
    }
      
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.content, this.x + this.w/2, this.y + this.h/6);
    
    stroke(0);
    noFill(0);
    
    for(let i = 1; i < this.connectors.length - 1; i++){
      let unten = this.y + (this.h/3)*2;
      let oben = this.y;
      let rechts = this.connectors[this.connectors.length - 1].x;
      let links = this.x;
      let tempY = ((unten - oben) / (rechts - links)) * ((this.connectors[i].x + this.connectors[i].w) - links) + oben;
      line(this.connectors[i].x + this.connectors[i].w, this.y + this.h, this.connectors[i].x + this.connectors[i].w, tempY);
    }
    line(this.x, this.y, this.connectors[this.connectors.length - 1].x, this.y + (this.h / 3) * 2);
    line(this.x + this.w, this.y, this.connectors[this.connectors.length - 1].x, this.y + (this.h / 3) * 2);
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    for(let i = 0; i < options.length; i++){
      text(options[i][0].trim(), this.connectors[i + 1].x + (this.connectors[i + 1].w / 2), this.y + (this.h/3) * 2.5);
    }
    
    
    this.selected_old = this.selected;
  }
}


//  ----------------  CHECK FIRST LOOP
class CheckFirstLoop{
  constructor(_content, _x, _y, _w, _h){
    this.type = "checkfirstloop";
    this.content = _content;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.selected = false;
    this.selected_old = false;
    this.connected = false;
    
    this.connectors = [new Connector(this.x, this.y + this.h, this.w), new Connector(this.x + this.w * 0.1, this.y + 30, this.w * 0.9)];
  }
  
  display(){
    if(this.selected && !this.selected_old){
      fieldHeightSlider.value(this.h - 30);
      fieldContentInput.value(this.content);
      fieldHeightSlider.show();
      fieldContentInput.show();
    }
    if(!this.selected && this.selected_old){
      fieldHeightSlider.hide();
      fieldContentInput.hide();
    }
    
    if(this.selected){
      this.h = fieldHeightSlider.value() + 30;
      this.content = fieldContentInput.value();
    }
    
        
    if(this.selected && mouseIsPressed){
      if(mouseOnCanvas()){
        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
      }
      

      let connectionCandidates = [];
      for(let i = 0; i < fields.length; i++){
        if(fields[i] != this){
          for(let j = 0; j < fields[i].connectors.length; j++){
            if(dist(this.x, this.y, fields[i].connectors[j].x, fields[i].connectors[j].y) < 20){
              connectionCandidates.push(fields[i].connectors[j]);
            }
          }
        }
      }
      if(connectionCandidates.length >= 1){
        let maxSize = 20;
        let biggestConnectorIndex = -1;
        for(let i = 0; i < connectionCandidates.length; i++){
          if(connectionCandidates[i].w >= maxSize){
            maxSize = connectionCandidates[i].w;
            biggestConnectorIndex = i;
          }
        }
        if(biggestConnectorIndex >= 0){
          this.connected = connectionCandidates[biggestConnectorIndex];
        }
      }
      else{
        this.connected = false;
        this.w = 200;
      }
    }
    
    
    if(this.selected){
      if(keyIsPressed && keyCode === DELETE){
        killField(this);
      }
    }
    if(this.connected != false){
      this.x = this.connected.x;
      this.y = this.connected.y;
      this.w = this.connected.w;
    }
    
    
    
    strokeWeight(2);
    if(this.selected){
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
    
    noFill();
    rect(this.x, this.y, this.w, this.h);
    
    stroke(0);
    line(this.connectors[1].x, this.connectors[1].y, this.connectors[1].x, this.connectors[1].y + 10);
    line(this.connectors[1].x, this.connectors[1].y, this.connectors[1].x + 10, this.connectors[1].y);
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.content, this.x + this.w/2, this.y + 15);
    

    this.connectors[0].x = this.x;
    this.connectors[0].y = this.y + this.h;
    this.connectors[0].w = this.w;
    this.connectors[1].x = this.x + this.w * 0.1;
    this.connectors[1].y = this.y + 30;
    this.connectors[1].w = this.w * 0.9;
    
    this.selected_old = this.selected;
  }
}


//  ----------------  CHECK LAST LOOP
class CheckLastLoop{
  constructor(_content, _x, _y, _w, _h){
    this.type = "checklastloop";
    this.content = _content;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.selected = false;
    this.selected_old = false;
    this.connected = false;

    
    this.connectors = [new Connector(this.x, this.y + this.h, this.w), new Connector(this.x + this.w * 0.1, this.y, this.w * 0.9)];
  }
  
  display(){
    if(this.selected && !this.selected_old){
      fieldHeightSlider.value(this.h - 30);
      fieldContentInput.value(this.content);
      fieldHeightSlider.show();
      fieldContentInput.show();
    }
    if(!this.selected && this.selected_old){
      fieldHeightSlider.hide();
      fieldContentInput.hide();
    }
    
    if(this.selected){
      this.h = fieldHeightSlider.value() + 30;
      this.content = fieldContentInput.value();
    }
    
    if(this.selected && mouseIsPressed){
      if(mouseOnCanvas()){
        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
      }
      

      let connectionCandidates = [];
      for(let i = 0; i < fields.length; i++){
        if(fields[i] != this){
          for(let j = 0; j < fields[i].connectors.length; j++){
            if(dist(this.x, this.y, fields[i].connectors[j].x, fields[i].connectors[j].y) < 20){
              connectionCandidates.push(fields[i].connectors[j]);
            }
          }
        }
      }
      if(connectionCandidates.length >= 1){
        let maxSize = 20;
        let biggestConnectorIndex = -1;
        for(let i = 0; i < connectionCandidates.length; i++){
          if(connectionCandidates[i].w >= maxSize){
            maxSize = connectionCandidates[i].w;
            biggestConnectorIndex = i;
          }
        }
        if(biggestConnectorIndex >= 0){
          this.connected = connectionCandidates[biggestConnectorIndex];
        }
      }
      else{
        this.connected = false;
        this.w = 200;
      }
    }
    
    
    if(this.selected){
      if(keyIsPressed && keyCode === DELETE){
        killField(this);
      }
    }
    if(this.connected != false){
      this.x = this.connected.x;
      this.y = this.connected.y;
      this.w = this.connected.w;
    }
    
    
    
    strokeWeight(2);
    if(this.selected){
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
    
    noFill();
    rect(this.x, this.y, this.w, this.h);
    
    stroke(0);
    line(this.connectors[1].x, this.connectors[1].y, this.connectors[1].x, this.connectors[1].y + 10);
    line(this.connectors[1].x, this.connectors[1].y, this.connectors[1].x + 10, this.connectors[1].y);
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.content, this.x + this.w/2, this.y + this.h - 15);
    

    this.connectors[0].x = this.x;
    this.connectors[0].y = this.y + this.h;
    this.connectors[0].w = this.w;
    this.connectors[1].x = this.x + this.w * 0.1;
    this.connectors[1].y = this.y;
    this.connectors[1].w = this.w * 0.9;
  
    this.selected_old = this.selected;
  }
}


//  ----------------  FIXED ITERATION LOOP
class FixedLoop{
  constructor(_content, _x, _y, _w, _h){
    this.type = "fixedloop";
    this.content = _content;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.selected = false;
    this.selected_old = false;
    this.connected = false;
    
    this.connectors = [new Connector(this.x, this.y + this.h, this.w), new Connector(this.x + this.w * 0.1, this.y + 30, this.w * 0.9)];
  }
  
  display(){
    if(this.selected && !this.selected_old){
      fieldHeightSlider.value(this.h - 60);
      fieldContentInput.value(this.content);
      fieldHeightSlider.show();
      fieldContentInput.show();
    }
    if(!this.selected && this.selected_old){
      fieldHeightSlider.hide();
      fieldContentInput.hide();
    }
    
    if(this.selected){
      this.h = fieldHeightSlider.value() + 60;
      this.content = fieldContentInput.value();
    }
    
    if(this.selected && mouseIsPressed){
      if(mouseOnCanvas()){
        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
      }
      

      let connectionCandidates = [];
      for(let i = 0; i < fields.length; i++){
        if(fields[i] != this){
          for(let j = 0; j < fields[i].connectors.length; j++){
            if(dist(this.x, this.y, fields[i].connectors[j].x, fields[i].connectors[j].y) < 20){
              connectionCandidates.push(fields[i].connectors[j]);
            }
          }
        }
      }
      if(connectionCandidates.length >= 1){
        let maxSize = 20;
        let biggestConnectorIndex = -1;
        for(let i = 0; i < connectionCandidates.length; i++){
          if(connectionCandidates[i].w >= maxSize){
            maxSize = connectionCandidates[i].w;
            biggestConnectorIndex = i;
          }
        }
        if(biggestConnectorIndex >= 0){
          this.connected = connectionCandidates[biggestConnectorIndex];
        }
      }
      else{
        this.connected = false;
        this.w = 200;
      }
    }
    
    
    if(this.selected){
      if(keyIsPressed && keyCode === DELETE){
        killField(this);
      }
    }
    if(this.connected != false){
      this.x = this.connected.x;
      this.y = this.connected.y;
      this.w = this.connected.w;
    }
    
    
    
    strokeWeight(2);
    if(this.selected){
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
    
    noFill();
    rect(this.x, this.y, this.w, this.h);
    
    stroke(0);
    line(this.connectors[1].x, this.connectors[1].y, this.connectors[1].x, this.connectors[1].y + 10);
    line(this.connectors[1].x, this.connectors[1].y, this.connectors[1].x + 10, this.connectors[1].y);
    line(this.connectors[1].x, this.y + this.h - 30, this.connectors[1].x, this.y + this.h - 40);
    line(this.connectors[1].x, this.y + this.h - 30, this.connectors[1].x + 10, this.y + this.h - 30);
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.content, this.x + this.w/2, this.y + 15);
    

    this.connectors[0].x = this.x;
    this.connectors[0].y = this.y + this.h;
    this.connectors[0].w = this.w;
    this.connectors[1].x = this.x + this.w * 0.1;
    this.connectors[1].y = this.y + 30;
    this.connectors[1].w = this.w * 0.9;
    
    this.selected_old = this.selected;
  }
}


//  ----------------  SUBROUTINE
class Subroutine{
  constructor(_content, _x, _y, _w, _h){
    this.type = "subroutine";
    this.content = _content;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.selected = false;
    this.selected_old = false;
    this.connected = false;
    
    this.connectors = [new Connector(this.x, this.y + this.h, this.w)];
  }
  
  display(){
    if(this.selected && !this.selected_old){
      fieldHeightSlider.value(this.h);
      fieldContentInput.value(this.content);
      fieldHeightSlider.show();
      fieldContentInput.show();
    }
    if(!this.selected && this.selected_old){
      fieldHeightSlider.hide();
      fieldContentInput.hide();
    }
    
    if(this.selected){
      this.h = fieldHeightSlider.value();
      this.content = fieldContentInput.value();
    }
    
    if(this.selected && mouseIsPressed){
      if(mouseOnCanvas()){
        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
      }
      

      let connectionCandidates = [];
      for(let i = 0; i < fields.length; i++){
        if(fields[i] != this){
          for(let j = 0; j < fields[i].connectors.length; j++){
            if(dist(this.x, this.y, fields[i].connectors[j].x, fields[i].connectors[j].y) < 20){
              connectionCandidates.push(fields[i].connectors[j]);
            }
          }
        }
      }
      if(connectionCandidates.length >= 1){
        let maxSize = 20;
        let biggestConnectorIndex = -1;
        for(let i = 0; i < connectionCandidates.length; i++){
          if(connectionCandidates[i].w >= maxSize){
            maxSize = connectionCandidates[i].w;
            biggestConnectorIndex = i;
          }
        }
        if(biggestConnectorIndex >= 0){
          this.connected = connectionCandidates[biggestConnectorIndex];
        }
      }
      else{
        this.connected = false;
        this.w = 200;
      }
    }
    
    
    if(this.selected){
      if(keyIsPressed && keyCode === DELETE){
        killField(this);
      }
    }
    
    if(this.connected != false){
      this.x = this.connected.x;
      this.y = this.connected.y;
      this.w = this.connected.w;
    }
    
    
    
    strokeWeight(2);
    if(this.selected){
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
    
    fill("rgba(255,255,255,0.8)");
    rect(this.x, this.y, this.w, this.h);
    
    stroke(0);
    line(this.x + 10, this.y, this.x + 10, this.y + this.h);
    line(this.x + this.w - 10, this.y, this.x + this.w - 10, this.y + this.h);
    
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.content, this.x + this.w/2, this.y + this.h/2);
    
    for(let i = 0; i < this.connectors.length; i++){
      this.connectors[i].x = this.x;
      this.connectors[i].y = this.y + this.h;
      this.connectors[i].w = this.w;
    }
    
    this.selected_old = this.selected;
  }
}


// ------------- UTILITY CLASSES
class Connector{
  constructor(_x, _y, _w){
    this.x = _x;
    this.y = _y;
    this.w = _w;
  }
}

class HiddenField{
  constructor(_x, _y, _w, _h){
    this.type = "hidden";
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    
    this.connectors = [new Connector(this.x, this.y + this.h, this.w)];
  }
  
  display(){
    this.w = widthSlider.value() - 40;
    
    
    this.connectors[0].w = this.w;
    
    strokeWeight(2);
    stroke(0);
    line(this.x, this.y + this.h, this.x + 20, this.y + this.h);
    line(this.x, this.y + this.h, this.x, this.y + this.h + 20);

  }
}


// -------------------------------------------------- FUNCTIONS --------------------------------------------------

//updates window with based on slider
function updateCanvasSize(){
  maxY = 100;
  for(let i = 0; i < fields.length; i++){
    let tempY = fields[i].y + fields[i].h;
    if(tempY > maxY){
      maxY = tempY;
    }
  }
  if(maxY > 380){
    resizeCanvas(widthSlider.value(), maxY + 20);
  }
  else{
    resizeCanvas(widthSlider.value(), 400);
  }
}


//updates size of elements when window is resized
function windowResized(){
  widthSlider.size(windowWidth - 20);
}

function mouseOnCanvas(){
  return (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height);
}

//
function mousePressed(){
  if(mouseOnCanvas()){
    let selectionCandidates = [];
    for(let i = 0; i < fields.length; i++){
      fields[i].selected = false;
    }
    for(let i = 0; i < fields.length; i++){
      if(mouseX > fields[i].x && mouseX < fields[i].x + fields[i].w && mouseY > fields[i].y && mouseY < fields[i].y + fields[i].h){
        selectionCandidates.push(fields[i]);
      }
    }
    if(selectionCandidates.length > 0){
      let smallestFieldIndex = -1;
      let minSize = Infinity;
      for(let i = 0; i < selectionCandidates.length; i++){
        let sizeOfThis = selectionCandidates[i].w * selectionCandidates[i].h;
        if(sizeOfThis < minSize){
          minSize = sizeOfThis;
          smallestFieldIndex = i;
        }
      }
      if(smallestFieldIndex >= 0){
        selectionCandidates[smallestFieldIndex].selected = true;
        fields.push(fields.splice(fields.indexOf(selectionCandidates[smallestFieldIndex]), 1)[0]);
      }
      else{
        console.error("Error: No field smaller than Infinity found!");
      }
    }
    
  }
}

// ---- BUTTON EVENTS ----
//create new Process based on button press
function newProcess(){
  let randomizedProcessText = random(["Prozess", "Eingabe Zahl", "Ausgabe Zeichen", "C = A + B", "Hier Text einfügen"]);
  fields.push(new Process(randomizedProcessText, 100, maxY + 10, 200, 30));
}

//create new If based on button press
function newIf(){
  fields.push(new If("Abzweigungsbedingung", 100, maxY + 10, 200, 90));
}

//create new CF Loop based on button press
function newCheckFirstLoop(){
  fields.push(new CheckFirstLoop("Abbruchsbedingung", 100, maxY + 10, 200, 60));
}

//create new CL Loop based on button press
function newCheckLastLoop(){
  fields.push(new CheckLastLoop("Abbruchsbedingung", 100, maxY + 10, 200, 60));
}

//create new F Loop based on button press
function newFixedLoop(){
  fields.push(new FixedLoop("Abbruchsbedingung", 100, maxY + 10, 200, 90));
}

//create new Subroutine based on button press
function newSubroutine(){
  fields.push(new Subroutine("Unterprogramm", 100, maxY + 10, 200, 60));
}



//kill specific field
function killField(field){
  let index = fields.indexOf(field);
  if (index > -1) {
    if(fields[index].hasOwnProperty("inputElements")){
      for(let i = 0; i < field.inputElements.length; i++){
        field.inputElements[i].remove();
      }
    }
    fields.splice(index, 1);
    fieldHeightSlider.hide();
    fieldContentInput.hide();
    fieldTextArea.hide();
  }
}


//draw Title
function drawTitle(content, x, y, fontSize){
  textAlign(CENTER, CENTER);
  noStroke();
  fill(0);
  textSize(fontSize);
  textStyle(BOLD);
  text(content.trim(), x, y);
  textStyle(NORMAL);
}

//save as Image
function saveDiagram(){
  noStroke();
  fill("rgb(93,93,93)");
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  text("Erstellt mit Nick's NSD Generator " + version, width - 2, height - 2);
  save(titleInput.value() + ".png");
}

function getLocalStorageKeys(){
  let originalKeys = Object.keys(localStorage);
  let keys = [];
  if(originalKeys.length == 0){
    return keys;
  }
  else{
    for(let i = 0; i < originalKeys.length; i++){
      if(!originalKeys[i].endsWith("p5TypeID")){
        keys.push(originalKeys[i]);
      }
    }
  }
  return keys.sort();
}

function saveToStorage(){
  let saveName = saveNameInput.value().trim();
  if(saveName.endsWith("p5TypeID")){
    alert("Speicherstandnamen dürfen nicht mit 'p5TypeID' enden. Wähle etwas anderes.");
    return;
  }
  if(saveName == ""){
    alert("Speicherstandnamen dürfen nicht leer sein. Wähle etwas anderes.");
    return;
  }
  if(getLocalStorageKeys().includes(saveName)){
    if(!confirm("Der Speicherstand '" + saveName + "' existiert bereits.\nMöchtest du den Speicherstand überschreiben?")){
      return;
    }
  }
  fields.unshift(widthSlider.value());
  fields.unshift(titleInput.value());
  let stringifiedSafeState = JSON.stringify(fields);
  storeItem(saveName, stringifiedSafeState);
  fields.shift();
  fields.shift();
}

function loadFromStorage(){
  let saveName = saveNameInput.value().trim();
  if(saveName.endsWith("p5TypeID")){
    alert("Diesen Wert solltest du nicht laden ;)");
    return;
  }
  if(saveName == ""){
    let saveStatesString = "";
    let tempkeys = getLocalStorageKeys()
    for(let i = 0; i < tempkeys.length; i++){
      saveStatesString += "\n - " + tempkeys[i];
    }
    alert("Speicherstandnamen dürfen nicht leer sein. Wähle etwas anderes.\nDie Verfügbaren Speicherstände sind: " + saveStatesString);
    return;
  }
  if(!getLocalStorageKeys().includes(saveName)){
    alert("Dieser Speicherstand existiert nicht.");
    return;
  }
  let stringifiedSafeState = getItem(saveName);
  let parsedSafeState = JSON.parse(stringifiedSafeState);
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
}

function autosave(){
  fields.unshift(widthSlider.value());
  fields.unshift(titleInput.value());
  let stringifiedSafeState = JSON.stringify(fields);
  storeItem("NSD3-autosave-reservedname", stringifiedSafeState);
  fields.shift();
  fields.shift();
}

function autoload(){
  if(getLocalStorageKeys().includes("NSD3-autosave-reservedname")){
    let stringifiedSafeState = getItem("NSD3-autosave-reservedname");
    let parsedSafeState = JSON.parse(stringifiedSafeState);
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
  }
}


function parseObject(inputObject){
  let obj;
  switch(inputObject.type){
    case "process":
      obj = new Process(inputObject.content, inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      return obj;
    case "if":
      obj = new If(inputObject.content, inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      obj.options = inputObject.options;
      obj.subfieldspacing = inputObject.subfieldspacing;
      return obj;
    case "checkfirstloop":
      obj = new CheckFirstLoop(inputObject.content, inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      return obj;
    case "checklastloop":
      obj = new CheckLastLoop(inputObject.content, inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      return obj;
    case "fixedloop":
      obj = new FixedLoop(inputObject.content, inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      return obj;
    case "subroutine":
      obj = new Subroutine(inputObject.content, inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      return obj;
    case "hidden":
      obj = new HiddenField(inputObject.x, inputObject.y, inputObject.w, inputObject.h);
      return obj;
    default:
      console.log("NO VALID TYPE FOUND!");
      return null;
  }
}

function deleteEverything(){
  if(confirm("Willst du wirklich alles löschen?")){
    if(confirm("Bist du dir ganz sicher, dass du das gesamte Diagramm löschen willst?")){
      if(frameCount % 100 == 0){
        if(!confirm("Wirklich wirklich ganz sicher?")){
          return;
        }
      }
      fields = [];
      fields.push(new HiddenField(20, 0, width - 40, 50));
      titleInput.value("Nassi-Shneidermann Diagramm");
    }
  }
}
