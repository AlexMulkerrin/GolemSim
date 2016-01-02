function Scene(simulation) {
	this.targetSim = simulation;

	this.model = [];
}

Scene.prototype.createModels = function() {
	this.createChunk();
	this.createUnitModels();
}

Scene.prototype.createUnitModels = function() {
	var unit = this.targetSim.unit;
	var halfWidth = this.targetSim.terrain.width/2;
	var halfHeight = this.targetSim.terrain.height/2;
	var halfDepth = this.targetSim.terrain.depth/2;

	var index = this.model.length;

	for (var i=0; i<unit.length; i++) {
		var x = unit[i].x-halfWidth;
		var y = unit[i].y-halfHeight;
		var z = unit[i].z-halfDepth;
		var colour = [Math.random(), Math.random(), Math.random()]//[0.5,0.5,1];
		this.model[index] = new Model([x,y,z],[0,0,0],true,i);
		this.model[index].addCube([0,0,0],colour, 0.4);
		//this.model[index].addCube([0,1,0],[0.95,0.80,0.3], 0.5);
		index++;
	}
}

Scene.prototype.createChunk = function() {
	var indexOffset = 0;
	this.model[indexOffset] = new Model([0,0,0],[0,0,0]);
	var terrain = this.targetSim.terrain;
	//var colour = [Math.random(),Math.random(),Math.random()];
	for (var i=0; i<terrain.width; i++) {
		for (var j=0; j<terrain.height; j++) {
			for (var k=0; k<terrain.depth; k++) {
				if (terrain.block[i][j][k].visible) {
					if (terrain.block[i][j][k].type == blockID.sand) {
						var colour = [0.95,0.80,0.3];
						var pos = [i-terrain.width/2, j-terrain.height/2, k-terrain.depth/2]
						this.model[0].addVisibleSidesCube(pos, colour, 0.5, terrain.block[i][j][k].sideVisible);

					}// else if (terrain.block[i][j][k].type == blockID.golem) {
					//	var colour = [0.5,0.5,1];
					//	var pos = [i-terrain.width/2, j-terrain.height/2, k-terrain.depth/2]
					//	this.model[0].addCube(pos, colour, 0.4);

					//}
				}
			}
		}
	}
}

Scene.prototype.refreshChunk = function() {
	this.model[0].clearVertexArray();
	var terrain = this.targetSim.terrain;
	//var colour = [Math.random(),Math.random(),Math.random()];
	for (var i=0; i<terrain.width; i++) {
		for (var j=0; j<terrain.height; j++) {
			for (var k=0; k<terrain.depth; k++) {
				if (terrain.block[i][j][k].visible) {
					if (terrain.block[i][j][k].type == blockID.sand) {
						var colour = [0.95,0.80,0.3];
						var pos = [i-terrain.width/2, j-terrain.height/2, k-terrain.depth/2]
						this.model[0].addVisibleSidesCube(pos, colour, 0.5, terrain.block[i][j][k].sideVisible);

					}
				}
			}
		}
	}
}

Scene.prototype.update = function() {
	var unit = this.targetSim.unit;
	var halfWidth = this.targetSim.terrain.width/2;
	var halfHeight = this.targetSim.terrain.height/2;
	var halfDepth = this.targetSim.terrain.depth/2;




	for (var i=0; i<this.model.length; i++) {
		if (this.model[i].isUnitModel) {
			var id = this.model[i].unitID;
			if (unit[id].x !== unit[id].oldX || unit[id].y !== unit[id].oldY || unit[id].z !== unit[id].oldZ ) {
				var smooth = this.smoothMovement(unit[id]);

				var x = smooth[0]-halfWidth;
				var y = smooth[1]-halfHeight;
				var z = smooth[2]-halfDepth;
				this.model[i].setPosition(x,y,z);
			}
		}
	}
}

Scene.prototype.smoothMovement = function(unit) {
	var fraction = 1- this.targetSim.framesTillUpdate/this.targetSim.framesPerTick;
	if (unit.y !== unit.oldY) {
		// do vertical movement first
		if (unit.y>unit.oldY) {
			// going up!
			if (fraction<0.5) {
				return this.linearInterpolation(
					[unit.oldX, unit.oldY, unit.oldZ],
					[unit.oldX, unit.y, unit.oldZ],
					fraction*2
				);
			} else {
				return this.linearInterpolation(
					[unit.oldX, unit.y, unit.oldZ],
					[unit.x, unit.y, unit.z],
					(fraction-0.5)*2
				);
			}
		} else {
			if (fraction<0.5) {
				return this.linearInterpolation(
					[unit.oldX, unit.oldY, unit.oldZ],
					[unit.x, unit.oldY, unit.z],
					fraction*2
				);

			} else {
				return this.linearInterpolation(
					[unit.x, unit.oldY, unit.z],
					[unit.x, unit.y, unit.z],
					(fraction-0.5)*2
				);
			}
		}
	} else {
		// move horizontally and wait
		if (fraction>0.5) {
			return [unit.x, unit.y, unit.z];
		} else {
			return this.linearInterpolation(
				[unit.oldX, unit.oldY, unit.oldZ],
				[unit.x, unit.y, unit.z],
				fraction*2
			);
		}

	}
}

Scene.prototype.linearInterpolation = function(oldPos, newPos, t) {
	var nx = oldPos[0] + t * (newPos[0] - oldPos[0]);
	var ny = oldPos[1] + t * (newPos[1] - oldPos[1]);
	var nz = oldPos[2] + t * (newPos[2] - oldPos[2])
	return [nx, ny, nz];
}
