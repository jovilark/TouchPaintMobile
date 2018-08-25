//ICS4U culminating task
//Johnathan Clark
//
//Drawing tool with adjustable brush sizes, color sampler, eraser, pencil,
//transparency and user friendly interface.

function setup() {
  //Declaring all variables that will be used in the program,
  //creating objects, declaring canvas size, color mode, and
  //pre-loading images.
  createCanvas(displayWidth, displayHeight);
  selectionBar = new SelectionBar(0, displayHeight - 50)
  isDrawing = false;
  selectionBar.colorSelector.sampledColor = "rgba(0,0,0,1)"
  drawColor = (selectionBar.colorSelector.sampledColor);
  tipSize = 10;
  a = 1;
  changeWeight = false;
  weightChange = 0;
  colorImg = loadImage("assets/colorPicker.jpg");
  background("white");
  isChangingAlpha = false;
  colorMode = (RGB, 255, 255, 255, 1);
	
	//Introduction, instructions for user which can be drawn over
	textSize(20);
	text("ISU Drawing Tool Instructions:", 100, 100);
	text("A: Click and drag slider to adjust opacity of sampled color", 100, 200);
	text("S: Click and drag circle to adjust brush stroke size", 100, 250);
	text("C: Click color palette to pick a color", 100, 300);
	text("P: Click to draw with selected options", 100, 350);
	text("E: Click to erase with selected brush size", 100, 400);
	text('Begin by picking a color and drawing anywhere!', 250, 450);
	textSize(15);
}

function draw() {
  //Display the UI
  selectionBar.display()
  
  //Always check which button has power
  selectionBar.powerSelected()

  //If drawing is flagged to be true, draw a line from the
  //previous mouse location to current mouse location each
  //frame, and an ellipse on the cursor if eraser is true
  if (isDrawing == true) {
    stroke(drawColor);
    fill(drawColor);
    strokeWeight(tipSize);
    if (selectionBar.powerOnFor == "pencil") {
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
    if (selectionBar.powerOnFor == "eraser") {
      stroke("white")
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
    fill("white");
    noStroke();
  }

  //If strokeWeight is flagged to change, change based on
  //how far the mouse is being dragged in Y.
  if (changeWeight == true) {
    weightChange = (mouseY - pmouseY)
    tipSize = tipSize - (weightChange / 6);
    if (tipSize > 150) {
      tipSize = 150;
    } else if (tipSize < 3) {
      tipSize = 3;
    }
  }

  //If alpha is flagged to change, change based on movement
  //in the mouse X.
  if (isChangingAlpha == true) {
    alphaChange = (mouseX - pmouseX) / 600;
    a = a + alphaChange
    if (a < 0.005) {
      a = 0.005;
    } else if (a > 1) {
      a = 1;
    }
  }
}

function touchReleased() {
  //Disable drawing on mouse release
  isDrawing = false;
  
  //Disable strokeWeight adjustment on mouse release
  if (changeWeight == true) {
    changeWeight = false;
  }
  
  //Disable alpha adjustment on mouse release and draw new alpha
  //value to brush preview
  if (isChangingAlpha == true) {
    isChangingAlpha = false;
    shorten(selectionBar.colorSelector.sampledColor);
    append(selectionBar.colorSelector.sampledColor, a);
    var array = ["rgba(", selectionBar.colorSelector.sampledColor, ")"]
    var separator = '';
    drawColor = join(array, separator);
  }
}

//Class definition for SelectionBar
function SelectionBar(xArg, yArg) {
  
  //Define passed X and Y arguments
  this.x = xArg;
  this.y = yArg;
  
	//Define variables
  this.powerOnFor = "none";
  this.canDraw = false;
	
  //Define original button colors
  this.pencilOn = "lightgray";
  this.eraserOn = "white";
  this.colorSelectorOn = "pink";
  this.tipSliderOn = "beige";
  this.alphaSliderOn = "lightgreen";
  
	//Create each button and tool
  this.colorSelector = new ColorSelector(this.x + 400, this.y - 260);
  this.colorSelectorButton = new Button("C", this.colorSelectorOn, this.x + 90, this.y + 20, 20, 15)
  this.pencilButton = new Button("P", this.pencilOn, this.x + 30, this.y + 20, 20, 15)
  this.eraserButton = new Button("E", this.eraserOn, this.x + 60, this.y + 20, 20, 15)
  this.tipSlider = new TipSlider(this.x + 325, this.y - 35);
  this.tipSliderButton = new Button("S", this.tipSliderOn, this.x + 120, this.y + 20, 20, 15);
  this.alphaSlider = new AlphaSlider(this.x, this.y - 40);
  this.alphaSliderButton = new Button("A", this.alphaSliderOn, this.x + 150, this.y + 20, 20, 15);

  //If button is pressed, then turn power on for the button and
  //if wanted, turn on or off the ability to draw.
  this.touchStarted = function() {
    if (this.pencilButton.touchStarted() == true) {
      if (this.powerOnFor == "pencil") {
        this.powerOnFor = "none";
        this.canDraw = false;
      } else {
        this.powerOnFor = "pencil";
        this.canDraw = true;

      }
    }
    if (this.eraserButton.touchStarted() == true) {
      if (this.powerOnFor == "eraser") {
        this.powerOnFor = "none";
        this.canDraw = false;
      } else {
        this.powerOnFor = "eraser";
        this.canDraw = true;
      }
    }
    if (this.colorSelectorButton.touchStarted() == true) {
      if (this.powerOnFor == "colorSelector") {
        this.powerOnFor = "none";
        this.canDraw = false;
        this.colorSelector.colorBeingSelected = false;
      } else {
        this.powerOnFor = "colorSelector";
        this.canDraw = false;
        this.colorSelector.colorBeingSelected = true;
      }
    }
    if (this.colorSelector.touchStarted() == true) {
      if (this.powerOnFor == "colorSelector") {
        //Sample RGBA from the color selector and replace the alpha value
        //with the one from the alpha slider.
        this.colorSelector.sampleColor()
        var array = ["rgba(", this.colorSelector.sampledColor, ")"]
        var separator = '';
        drawColor = join(array, separator);
      }
    }
    //Interact with the tip slider if the power is on for it
    if (this.tipSlider.touchStarted() == true && this.powerOnFor == "tipSlider") {
      changeWeight = true;
    }
    //Enable interaction with tip slider when the slider button is pressed
    if (this.tipSliderButton.touchStarted() == true) {
      if (this.powerOnFor == "tipSlider") {
        this.powerOnFor = "none";
        this.canDraw = false;
        this.tipSlider.strokeBeingChanged = false;
      } else {
        this.powerOnFor = "tipSlider";
        this.canDraw = false;
        this.tipSlider.strokeBeingChanged = true;
      }
    }
    //If alpha button is on, change alpha when alpha slider pressed
    if (this.alphaSlider.touchStarted() == true && this.powerOnFor == "alphaSlider") {
      isChangingAlpha = true;
    }
    //Enable interaction with the alpha slider when button is pressed
    if (this.alphaSliderButton.touchStarted() == true) {
      if (this.powerOnFor == "alphaSlider") {
        this.powerOnFor = "none";
      } else {
        this.powerOnFor = "alphaSlider";
      }
    }
  }

  //Draw the entire UI and declare the button colors.
  this.display = function() {
    strokeWeight(2);
    stroke("black")
    fill("white")
    rect(this.x, this.y, 250, 40);
    rect(this.x + 250, this.y - 110, 150, 150);
    fill("gray");
    rect(this.x + 250, this.y - 35, 150, 75);
    noStroke()
    fill("white")

    this.pencilButton.color = this.pencilOn
    this.eraserButton.color = this.eraserOn
    this.colorSelectorButton.color = this.colorSelectorOn
    this.tipSliderButton.color = this.tipSliderOn
    this.alphaSliderButton.color = this.alphaSliderOn

    this.colorSelector.display()
    this.tipSlider.display()
    this.alphaSlider.display()

    this.pencilButton.display()
    this.eraserButton.display()
    this.colorSelectorButton.display()
    this.tipSliderButton.display()
    this.alphaSliderButton.display()
  }

  //Change the color of the buttons based on which button is pressed
  this.powerSelected = function() {
    if (this.powerOnFor == "pencil") {
      this.pencilOn = "red";
    } else {
      this.pencilOn = "lightgray"
    }

    if (this.powerOnFor == "eraser") {
      this.eraserOn = "red";
    } else {
      this.eraserOn = "white"
    }

    if (this.powerOnFor == "colorSelector") {
      this.colorSelectorOn = "red";
    } else {
      this.colorSelectorOn = "pink";
    }
    if (this.powerOnFor == "tipSlider") {
      this.tipSliderOn = "red";
    } else {
      this.tipSliderOn = "beige";
    }
    if (this.powerOnFor == "alphaSlider") {
      this.alphaSliderOn = "red";
    } else {
      this.alphaSliderOn = "lightgreen";
    }
  }
}

function Button(textArg, colorArg, xArg, yArg, wArg, hArg) {
  this.text = textArg;
  this.color = colorArg || "black"
  this.x = xArg;
  this.y = yArg;
  this.w = wArg;
  this.h = hArg;

  this.display = function() {
    fill(this.color);
    stroke("black");
    ellipse(this.x, this.y, 25, 15);
    noFill();
    text(this.text, this.x - 3, this.y + 5);
    noStroke();
  }

  this.touchStarted = function() {
    if (mouseX >= (this.x - this.w / 2) && mouseX <= (this.x + this.w / 2) && mouseY >= (this.y - this.h / 2) && mouseY <= (this.y + this.h / 2)) {
      return true;
    } else {
      return false;
    }
  }
}

//Class for the color selector
function ColorSelector(xArg, yArg) {
  
  //Pass X and Y arguments
  this.x = xArg;
  this.y = yArg;

  //No stroke for the selector
  noStroke();

  //Display the color selector image
  this.display = function() {
    rect(this.x, this.y, 300, 300);
    image(colorImg, this.x, this.y);
  }

  //Method to sample color when a color is clicked
  this.sampleColor = function() {
    this.testedColor = get(mouseX, mouseY);
    this.sampledColor = get(mouseX, mouseY);
    shorten(selectionBar.colorSelector.testedColor);
    shorten(selectionBar.colorSelector.sampledColor);
    append(selectionBar.colorSelector.sampledColor, a);
  }

  this.touchStarted = function() {
    if (mouseX >= (this.x) && mouseX <= (this.x + 300) && mouseY >= (this.y) && mouseY <= (this.y + 300)) {
      return true;
    } else {
      return false;
    }
  }
}

//Class for the tip slider
function TipSlider(xArg, yArg) {
  
  //Pass X and Y arguments
  this.x = xArg;
  this.y = yArg;

  //By default, stroke is not being changed
  this.strokeBeingChanged = false;

  //Draw the tip slider
  this.display = function() {
    strokeWeight(tipSize);
    stroke(drawColor);
    ellipse(this.x, this.y, 0, 0);
    strokeWeight(1);
  }

  this.touchStarted = function() {
    if (mouseX >= (this.x - tipSize / 2 - 5) && mouseX <= (this.x + tipSize / 2 + 5) && mouseY >= (this.y - tipSize / 2 - 5) && mouseY <= (this.y + tipSize / 2 + 5)) {
      return true;
    } else {
      return false;
    }
  }
}

//Class for the alpha slider
function AlphaSlider(xArg, yArg) {
  
  //Pass X and Y arguments
  this.x = xArg;
  this.y = yArg;

  //Draw the alpha slider
  this.display = function() {
    fill("white");
    stroke("black");
    strokeWeight(2);
    rect(this.x, this.y, 250, 40);
    rect(this.x + 15, this.y + 15, 220, 10);
    
    //
    for (i = 0; i < 220; i++) {
      var array = ["rgba(", selectionBar.colorSelector.testedColor, ',', (i/220), ")"]
      var separator = '';
      sliderColor = join(array, separator);
      stroke(sliderColor);
      line((this.x + 15 + i), this.y + 15, (this.x + 15 + i), this.y + 25);
    }
    
    stroke("black");
    noFill();
    rect(this.x, this.y, 250, 40);
    rect(this.x + 15, this.y + 15, 220, 10);
    line((this.x + 15) + (a * 220), this.y + 10, (this.x + 15) + (a * 220), this.y + 30);
    strokeWeight(1);
  }

  this.touchStarted = function() {
    if (mouseX >= (this.x) && mouseX <= (this.x + 250) && mouseY >= (this.y) && mouseY <= (this.y + 40)) {
      return true;
    } else {
      return false;
    }
  }
}

function touchStarted() {
  selectionBar.touchStarted();
  if (selectionBar.canDraw == true) {
    isDrawing = true;
  }
}