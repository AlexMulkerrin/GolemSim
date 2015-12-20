function Display(canvasName, simulation) {
	this.targetSim = simulation;

	this.canvas = document.getElementById(canvasName);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");

	this.render3D = new Render3D(this.targetSim);
}

Display.prototype.linkControl = function(control) {
	this.targetControl = control
}

Display.prototype.update = function() {
	this.clearCanvas();
	this.render3D.update();
	this.ctx.drawImage(this.render3D.canvas,0,0);

	this.drawStatistics();

}

Display.prototype.drawStatistics = function() {
	this.ctx.fillStyle = "#000000";
	this.ctx.fillText("Dimensions: "+
	this.targetSim.terrain.width+", "+
	this.targetSim.terrain.height+", "+
	this.targetSim.terrain.depth,5,12);
	this.ctx.fillText("Contents: "+this.targetSim.terrain.getVolume()+" blocks", 5,24);
	var tot = this.targetSim.terrain.totals;
	var y=3;
	for (var i=0; i<tot.length; i++) {
		this.ctx.fillText(tot[i].name+": "+tot[i].num+" ("+tot[i].percent+"%)", 5,y*12);
		y++;
	}
}

Display.prototype.clearCanvas = function() {
	this.ctx.fillStyle = "#eeeeff";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
