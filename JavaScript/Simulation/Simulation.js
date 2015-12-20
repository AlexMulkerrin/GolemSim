function Simulation(width, height, depth) {
	this.terrain = new Terrain(width, height, depth);

	this.unit = [];
	this.createGolem();

	this.terrain.getTotals();
}

Simulation.prototype.createGolem = function () {
	var x = random(this.terrain.width);
	var z = random(this.terrain.depth);
	var y = this.terrain.elevation[x][z]-1;

	this.terrain.block[x][y][z].type = blockID.golem;
	this.unit.push(new Agent(x,y,z));
};

function Agent(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

function random(integer) {
	return Math.floor(Math.random()*integer);
}
