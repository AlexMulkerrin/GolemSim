function loadProgram() {
	var program = new Program("golemCanvas");
}

function Program(canvasName) {
	this.refreshDelay = 50;
	this.canvasName = canvasName;

	this.simulation = new Simulation(16,16,16);

	this.loadJSON("ColtCoyoteHuts.json")

	this.display = new Display(this.canvasName, this.simulation);
	this.control = new Control(this.canvasName, this.simulation, this.display);
	this.display.linkControl(this.control);

	this.display.update();
	var t = this;
	setInterval(function(){t.update();}, t.refreshDelay);
}

Program.prototype.update = function() {
	this.simulation.update();
	this.display.update();
	this.control.mouse.isReleased = false;
}

Program.prototype.loadJSON = function(name) {
	var request = new XMLHttpRequest();
	request.open("GET",name);
	request.overrideMimeType("application/json");
	var t = this;
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			console.log();
			var loadedText = request.responseText;
			var resultJSON = JSON.parse(loadedText);
			t.simulation.terrain.readJSON(resultJSON);
			//t.control.view.sliceHeight = 0;
			//t.display.updatePalette();
		}
	};
	request.send();
}
