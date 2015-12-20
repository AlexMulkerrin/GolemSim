function loadProgram() {
	var program = new Program("golemCanvas");
}

function Program(canvasName) {
	this.refreshDelay = 50;
	this.canvasName = canvasName;

	this.simulation = new Simulation(16,16,16);
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
