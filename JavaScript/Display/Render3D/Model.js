function Model(positionVector, rotationVector, isUnitModel, unitID) {
	this.totalVerticies = 0;
	this.vertexArray = [];
	this.modelMatrix = identityMatrix4();
	this.x = positionVector[0];
	this.y = positionVector[1];
	this.z = positionVector[2];

	this.orbitVector = [0,0,0];
	this.rotationVector = rotationVector;

	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, this.rotationVector[0], [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, this.rotationVector[1], [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, this.rotationVector[2], [0,0,1]);

	this.modelMatrix = multiplyMatrix4(rotationMatrix, this.modelMatrix, this.modelMatrix);
	this.modelMatrix = translateMatrix4(this.modelMatrix, this.x, this.y, this.z);

	this.normalMatrix = emptyMatrix3();
	this.normalMatrix = mat4toInverseMat3(this.modelMatrix, this.normalMatrix);
	this.normalMatrix = mat3transpose(this.normalMatrix);

	if (isUnitModel) {
		this.isUnitModel = true;
		this.unitID = unitID;
	} else {
		this.isUnitModel = false;
	}
}

Model.prototype.update = function() {
	//this.updateRotation();
	//this.updateOrbit();
}

Model.prototype.setPosition = function(x, y, z) {
	this.modelMatrix = translateMatrix4(this.modelMatrix, -this.x, -this.y, -this.z);
	this.x = x;
	this.y = y;
	this.z = z;
	this.modelMatrix = translateMatrix4(this.modelMatrix, this.x, this.y, this.z);
}

Model.prototype.updateRotation = function() {
	this.modelMatrix = translateMatrix4(this.modelMatrix, -this.x, -this.y, -this.z);
	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.rotationVector[0]), [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.rotationVector[1]), [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.rotationVector[2]), [0,0,1]);
	this.modelMatrix = multiplyMatrix4(rotationMatrix, this.modelMatrix, this.modelMatrix);

	this.modelMatrix = translateMatrix4(this.modelMatrix, this.x, this.y, this.z);
}

Model.prototype.updateOrbit = function() {
	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.orbitVector[0]), [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.orbitVector[1]), [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.orbitVector[2]), [0,0,1]);
	this.modelMatrix = multiplyMatrix4(rotationMatrix, this.modelMatrix, this.modelMatrix);
	this.x = this.modelMatrix[12];
	this.y = this.modelMatrix[13];
	this.z = this.modelMatrix[14];
}

Model.prototype.addCube = function(position, colour, scale) {
	var shape = new CubeMesh();
	var x,y,z;
	for (var i=0; i<shape.vertex.length; i++) {
		x = shape.vertex[i][0]*scale + position[0];
		y = shape.vertex[i][1]*scale + position[1];
		z = shape.vertex[i][2]*scale + position[2];
		this.vertexArray.push(x,y,z);
		this.vertexArray.push(colour[0],colour[1],colour[2]);
		this.vertexArray.push(shape.normal[i][0],shape.normal[i][1],shape.normal[i][2]);
		this.totalVerticies++;
	}
}

Model.prototype.addSphere = function(longitudeBands, latitudeBands, radius) {
	var colour = [0.1,0.1,1];
	var vertexPositons = [];
	for (var latNum=0; latNum <= latitudeBands; latNum++) {
		var theta = latNum * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNum=0; longNum <= longitudeBands; longNum++) {
			var phi = longNum * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = sinPhi * sinTheta;
			var y = cosTheta;
			var z = cosPhi * sinTheta;
			vertexPositons.push([x*radius, y*radius, z*radius]);
		}
	}

	for (var latNum=0; latNum < latitudeBands; latNum++) {
		for (var longNum=0; longNum < longitudeBands; longNum++) {
			var a = latNum * (longitudeBands+1) + longNum;
			var b = a + longitudeBands +1;

			var pos = [];
			pos[0] = vertexPositons[a];
			pos[1] = vertexPositons[b];
			pos[2] = vertexPositons[a+1];
			pos[3] = vertexPositons[b+1];


			this.addQuad(pos, colour, true);
		}
	}
}

Model.prototype.addPyramid = function(pos, colour) {
	this.addFlatTriangle([pos[0], pos[1], pos[4]], colour);
	this.addFlatTriangle([pos[1], pos[3], pos[4]], colour);
	this.addFlatTriangle([pos[3], pos[2], pos[4]], colour);
	this.addFlatTriangle([pos[2], pos[0], pos[4]], colour);
}

Model.prototype.addQuad = function(pos, colour, isFlippedDiagonal) {
	if (isFlippedDiagonal) {
		this.addFlatTriangle([pos[0], pos[1], pos[3]], colour);
		this.addFlatTriangle([pos[2], pos[0], pos[3]], colour);
	} else {
		this.addFlatTriangle([pos[0], pos[1], pos[2]], colour);
		this.addFlatTriangle([pos[1], pos[3], pos[2]], colour);
	}
}

Model.prototype.addTriangle = function(pos, norm, colour) {
	//newNorm = CalculateNormal(pos[0], pos[1], pos[2]);

	for (var i=0; i<pos.length; i++) {
		this.vertexArray.push(pos[i][0],pos[i][1],pos[i][2]);
		this.vertexArray.push(colour[i][0],colour[i][1],colour[i][2]);
		this.vertexArray.push(norm[i][0],norm[i][1],norm[i][2]);
		//this.vertexArray.push(newNorm[0],newNorm[1],newNorm[2]);

		this.totalVerticies++;
	}

}

Model.prototype.addFlatTriangle = function(pos, colour) {
	newNorm = CalculateNormal(pos[0], pos[1], pos[2]);

	for (var i=0; i<pos.length; i++) {
		this.vertexArray.push(pos[i][0],pos[i][1],pos[i][2]);
		this.vertexArray.push(colour[0],colour[1],colour[2]);
		this.vertexArray.push(newNorm[0],newNorm[1],newNorm[2]);

		this.totalVerticies++;
	}
}

function CalculateNormal(v1,v2,v3) {
	var e31=[v3[0]-v1[0],v3[1]-v1[1],v3[2]-v1[2]];
	var e32=[v3[0]-v2[0],v3[1]-v2[1],v3[2]-v2[2]];
	var cross = [e31[1]*e32[2]-e31[2]*e32[1],
				-1*(e31[0]*e32[2]-e31[2]*e32[0]),
				e31[0]*e32[1]-e31[1]*e32[0]];
	var mag = Math.sqrt(cross[0]*cross[0]+cross[1]*cross[1]+cross[2]*cross[2]);
	cross[0]/=mag;
	cross[1]/=mag;
	cross[2]/=mag;

	return cross;
}

function CubeMesh() {
	// corner verticies
	var c=[	[1,-1,1], [-1,1,1],		[1,1,1],	[-1,-1,1],
			[1,1,-1], [-1,1,-1],	[1,-1,-1],	[-1,-1,-1]];
	this.vertex =	[	c[0],	c[1],	c[2],
						c[3],	c[1],	c[0],
						c[4],	c[5],	c[6],
						c[7],	c[6],	c[5],

						c[2],	c[4],	c[0],
						c[4],	c[6],	c[0],
						c[5],	c[1],	c[7],
						c[3],	c[7],	c[1],

						c[4],	c[2],	c[1],
						c[5],	c[4],	c[1],
						c[7],	c[0],	c[6],
						c[0],	c[7],	c[3]];
	// array of face normals
	var d = [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];
	this.normal=[ d[0], d[0], d[0],
				d[0], d[0], d[0],
				d[1], d[1], d[1],
				d[1], d[1], d[1],

				d[2], d[2], d[2],
				d[2], d[2], d[2],
				d[3], d[3], d[3],
				d[3], d[3], d[3],

				d[4], d[4], d[4],
				d[4], d[4], d[4],
				d[5], d[5], d[5],
				d[5], d[5], d[5]];
}
