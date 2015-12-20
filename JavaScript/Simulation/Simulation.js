function Simulation(width, height, depth) {
	this.terrain = new Terrain(width, height, depth);

	this.unit = [];
	this.createGolem();

	this.terrain.getTotals();

	this.tick = 0;
	this.framesPerTick = 30;
	this.framesTillUpdate = this.framesPerTick;
}

Simulation.prototype.createGolem = function () {
	var x = random(this.terrain.width);
	var z = random(this.terrain.depth);
	var y = this.terrain.elevation[x][z]-1;

	this.terrain.block[x][y][z].type = blockID.golem;
	this.terrain.elevation[x][z] -=1;
	this.terrain.checkVisible();
	this.unit.push(new Agent(x,y,z));
};

function Agent(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.oldX = x;
	this.oldY = y;
	this.oldZ = z;
}

Simulation.prototype.update = function () {
	if (this.framesTillUpdate<1) {
		var direc = [[1,0],[-1,0],[0,1],[0,-1]];
		for (var i=0; i<this.unit.length; i++) {
			var choice = random(4);
			var nx = (this.unit[i].x+direc[choice][0]);
			var nz = (this.unit[i].z+direc[choice][1]);
			this.unit[i].oldX = this.unit[i].x;
			this.unit[i].oldY = this.unit[i].y;
			this.unit[i].oldZ = this.unit[i].z;
			
			if (nx>=0 && nx<this.terrain.width && nz>=0 && nz<this.terrain.depth) {
				var ny = this.terrain.elevation[nx][nz];

				this.terrain.block[this.unit[i].x,this.unit[i].y,this.unit[i].z].type = blockID.air;
				this.unit[i].x = nx;
				this.unit[i].y = ny;
				this.unit[i].z = nz;
				this.terrain.block[this.unit[i].x,this.unit[i].y,this.unit[i].z].type = blockID.golem;
			}
		}
		this.tick++;
		this.framesTillUpdate = this.framesPerTick;
	} else {
		this.framesTillUpdate--;
	}
}

function random(integer) {
	return Math.floor(Math.random()*integer);
}
