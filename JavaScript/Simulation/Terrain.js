const blockID = { air:0, sand:1, golem:2};

function Terrain(width, height, depth) {
	this.width = width;
	this.height = height;
	this.depth = depth;
	this.groundLevel = this.height/2;

	this.elevation = [];
	this.initialiseFlatElevation();

	this.block = [];
	this.initialiseEmptyBlocks();

	this.createBumpyTerrain();
	this.checkVisible();

	this.totals = [];

}

Terrain.prototype.initialiseFlatElevation = function () {
	for (var i = 0; i<this.width; i++) {
		this.elevation[i] = [];
		for ( var k=0; k<this.depth; k++) {
			this.elevation[i][k] = this.groundLevel;
		}
	}
}

Terrain.prototype.initialiseEmptyBlocks = function () {
	for (var i = 0; i<this.width; i++) {
		this.block[i] = [];
		for ( var j=0; j<this.height; j++) {
			this.block[i][j] = [];
			for ( var k=0; k<this.depth; k++) {
				this.block[i][j][k] = new Block();
			}
		}
	}
}

Terrain.prototype.createBumpyTerrain = function () {
	for (var i = 0; i<this.width; i++) {
		for ( var k=0; k<this.depth; k++) {
			//this.elevation[i][k] += Math.floor(Math.random()*2);
			for ( var j=0; j<this.elevation[i][k]; j++) {
				this.block[i][j][k].type  = blockID.sand;
			}

		}
	}
}

Terrain.prototype.getVolume = function() {
	return this.width*this.height*this.depth;
}

Terrain.prototype.getTotals = function() {
	this.totals = [];
	var blockNames = Object.keys(blockID);
	for (var i = 0; i < blockNames.length; i++) {
		this.totals[i] = new Total(blockNames[i],0);
	}
	for (var i=0; i<this.width; i++) {
		for (var k=0; k<this.depth; k++) {
			for (var j=0; j<this.height; j++) {
				var id = this.block[i][j][k].type;
				this.totals[id].num++;
			}
		}
	}
	var allTotal=this.getVolume();
	for (var i=0; i<blockNames.length; i++) {
		var percent = this.totals[i].num/allTotal * 100
		this.totals[i].percent = percent.toFixed(2);
	}
}

Terrain.prototype.checkVisible = function() {
	var adj = [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];
	for (var i=0; i<this.width; i++) {
		for (var k=0; k<this.depth; k++) {
			for (var j=0; j<this.height; j++) {
				if (this.block[i][j][k].type !== blockID.air) {
					for (var e=0; e<adj.length; e++) {
						var x = i + adj[e][0];
						var y = j + adj[e][1];
						var z = k + adj[e][2];
						if (x>=0 && x<this.width && y>=0 && y<this.height && z>=0 && z<this.depth) {
							if (this.block[x][y][z].type == blockID.air || this.block[x][y][z].type == blockID.golem) {
								this.block[i][j][k].visible = true;
								this.block[i][j][k].sideVisible[e] = true;
							}
						} else {
							this.block[i][j][k].visible = true;
							this.block[i][j][k].sideVisible[e] = true;
						}
					}
				}
			}
		}
	}
}

function Block() {
	this.type = blockID.air;
	this.visible = false;
	this.sideVisible = [false,false,false,false,false,false];
}

function Total(name, num) {
	this.name=name;
	this.num = num;
	this.percent = 0;
}
