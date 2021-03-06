const blockID = { air:0, sand:1, golem:2};
const materialID = {gas:0, liquid:0, solid:1};

function Terrain(width, height, depth) {
	this.width = width;
	this.height = height;
	this.depth = depth;
	this.groundLevel = this.height/2;

	this.elevation = [];
	this.initialiseFlatElevation();

	this.block = [];
	this.initialiseEmptyBlocks();

	this.createHeightMap();
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
	this.block = [];
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

Terrain.prototype.createHeightMap = function () {
	this.initialiseEmptyBlocks();
	var random = new PseudorandomGenerator();
	this.seed = Math.floor(Math.random()*9000);//13;
	random.setSeed(this.seed);
	this.raiseLand(random);
	this.selectBlock(random);

	for (var i = 0; i<this.width; i++) {
		for ( var k=0; k<this.depth; k++) {
			//this.elevation[i][k] += Math.floor(Math.random()*2);
			for ( var j=0; j<this.elevation[i][k]; j++) {
				this.block[i][j][k].type  = blockID.sand;
			}

		}
	}
}
Terrain.prototype.raiseLand = function(random) {
	var noise = new OctaveNoise(2, random);
	for (var i = 0; i<this.width; i++) {
		for ( var k=0; k<this.depth; k++) {
			var elev = noise.compute(i*0.05,k*0.05)*8;
			this.elevation[i][k] = Math.floor(elev)+this.groundLevel;

		}
	}
}

Terrain.prototype.readJSON = function(JSONtext) {
	this.width = JSONtext.width;
	this.height = JSONtext.height;
	this.depth = JSONtext.depth;
	this.initialiseEmptyBlocks();

	this.palette = JSONtext.palette;
	this.readRunLengthEncoding(JSONtext["RunLengthEncoded blocks"]);
	this.checkVisible();
}
Terrain.prototype.readRunLengthEncoding = function(JSONtext) {
	var x=0; y=0; z=0;
	//var result = create3DArray(this.width, this.height, this.depth,0);
	var currentCount ="";
	var runLength = 0;
	var currentID = 2;
	var currentChar= "";
	for (var i=0; i<JSONtext.length; i++) {
		currentChar = JSONtext.charAt(i);
		if (isNaN(parseInt(currentChar)) ) {

			currentID = getIDfromSymbol(currentChar);
			runLength = parseInt(currentCount);
			if (isNaN(runLength)) runLength = 1;
			for (var j=0; j<runLength; j++) {
				var material = this.palette[currentID].material;
				this.block[x][y][z].type = materialID[material];
				this.block[x][y][z].colour = toColourVector(this.palette[currentID].colour);
				//result[x][y][z] = currentID;
				z++;
				if (z === this.depth) {
					z=0;
					y++;
					if (y === this.height) {
						y=0;
						x++;
					}
				}
			}
			currentCount = "";
		} else {
			currentCount += currentChar;
		}
	}
	//return result;
}
function create3DArray(width, height, depth, initialValue) {
	result = [];
	for (var i=0; i<width; i++) {
		result[i] = [];
		for (var j=0; j<height; j++) {
				result[i][j] = [];
			for (var k=0; k<depth; k++) {
				result[i][j][k] = initialValue;
			}
		}
	}
	return result;
}
function getIDfromSymbol(symbol) {
	switch (symbol) {
		case "A":
			return 0;
		case "B":
			return 1;
		case "C":
			return 2;
		case "D":
			return 3;
		case "E":
			return 4;
		case "F":
			return 5;
		case "G":
			return 6;
		case "H":
			return 7;
	}
}
function toColourVector(colour) {
	var components=[], string;
	for (var i=0; i<3; i++) {
		// "#rrggbb"
		string = colour[1+i*2]+colour[2+i*2];
		components[i]=parseInt(string,16);
		components[i] = components[i]/256;
	}
	return components;
}

Terrain.prototype.selectBlock = function(random) {
	for (var i = 0; i<this.width; i++) {
		for ( var k=0; k<this.depth; k++) {
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
				this.block[i][j][k].visible = false;
				this.block[i][j][k].sideVisible = [false,false,false,false,false,false];
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
	this.colour = [0.95,0.80,0.3];//[Math.random(), Math.random(), Math.random()];
	this.visible = false;
	this.sideVisible = [false,false,false,false,false,false];
}

function Total(name, num) {
	this.name=name;
	this.num = num;
	this.percent = 0;
}
