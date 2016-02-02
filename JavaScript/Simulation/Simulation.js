function Simulation(width, height, depth) {
	this.terrain = new Terrain(width, height, depth);

	this.unit = [];
	this.createGolems(10);

	this.terrain.getTotals();

	this.tick = 0;
	this.framesPerTick = 30;
	this.framesTillUpdate = this.framesPerTick;
}

Simulation.prototype.createGolems = function (num) {
	for (var i=0; i<num; i++) {
		var x = random(this.terrain.width);
		var z = random(this.terrain.depth);
		var y = this.terrain.elevation[x][z]-1;

		this.terrain.block[x][y][z].type = blockID.golem;
		this.terrain.elevation[x][z] -=1;
		this.terrain.checkVisible();
		this.unit.push(new Agent(x,y,z));
	}
}

function Agent(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.oldX = x;
	this.oldY = y;
	this.oldZ = z;
	
	this.colour = [Math.random(), Math.random(), Math.random()];
}

Simulation.prototype.update = function () {
	if (this.framesTillUpdate<1) {
		
		for (var i=0; i<this.unit.length; i++) {
			this.updateUnit(this.unit[i]);
		}
		
		//this.terrain.createHeightMap();
		this.terrain.checkVisible();
		
		this.tick++;
		this.framesTillUpdate = this.framesPerTick;
	} else {
		this.framesTillUpdate--;
	}
}

Simulation.prototype.updateUnit = function (unit) {
	var direc = [[1,0],[-1,0],[0,1],[0,-1]];
	var choice = 1;//random(4);
	var nx = (unit.x+direc[choice][0]);
	var nz = (unit.z+direc[choice][1]);
	unit.oldX = unit.x;
	unit.oldY = unit.y;
	unit.oldZ = unit.z;

	if (nx>=0 && nx<this.terrain.width && nz>=0 && nz<this.terrain.depth
		&& this.terrain.elevation[nx][nz] <= this.terrain.elevation[unit.x][unit.z]+1
		&& this.terrain.elevation[nx][nz] >= this.terrain.elevation[unit.x][unit.z]-1 ) {
		var ny = this.terrain.elevation[nx][nz];
		
		if (this.terrain.block[nx][ny][nz].type === blockID.air) {
			this.terrain.block[unit.x][unit.y][unit.z].type = blockID.air;
			unit.x = nx;
			unit.y = ny;
			unit.z = nz;
			this.terrain.block[unit.x][unit.y][unit.z].type = blockID.golem;
		}
	}

	// paint block below!
	if (unit.oldY-1>0) {
		this.terrain.block[unit.oldX][unit.oldY-1][unit.oldZ].colour = unit.colour;
	//	this.terrain.elevation[unit.x][unit.z] -= 1;
	}

	
}

function random(integer) {
	return Math.floor(Math.random()*integer);
}
