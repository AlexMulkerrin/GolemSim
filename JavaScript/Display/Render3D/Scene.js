function Scene(simulation) {
	this.targetSim = simulation;

	this.model = [];
	this.nextIndex = 0;
}

Scene.prototype.createModels = function() {
	this.createChunk();
}

Scene.prototype.createChunk = function() {
	var indexOffset = 0;
	this.model[indexOffset] = new Model([0,0,0],[0,0,0]);
	var terrain = this.targetSim.terrain;
	for (var i=0; i<terrain.width; i++) {
		for (var j=0; j<terrain.height; j++) {
			for (var k=0; k<terrain.depth; k++) {
				if (terrain.block[i][j][k].visible) {
					if (terrain.block[i][j][k].type == blockID.sand) {
						var colour = [0.9,0.8,0];
						var pos = [i-terrain.width/2, j-terrain.height/2, k-terrain.depth/2]
						this.model[0].addCube(pos, colour, 0.4);

					} else if (terrain.block[i][j][k].type == blockID.golem) {
						var colour = [0.5,0.5,1];
						var pos = [i-terrain.width/2, j-terrain.height/2, k-terrain.depth/2]
						this.model[0].addCube(pos, colour, 0.4);

					}
				}
			}
		}
	}
}
