function Camera() {
	this.projectionMatrix = getProjectionMatrix4(40, window.innerWidth/window.innerHeight, 1, 1000);
	this.modelMatrix = identityMatrix4();
	this.viewMatrix = identityMatrix4();

	this.x = 0;
	this.y = -2;
	this.z = -5;

	this.velRotX = 0;
	this.velRotY = 2;
	this.velRotZ = 0;

	this.viewMatrix = translateMatrix4(this.viewMatrix, this.x, this.y, this.z);
	this.normalMatrix = emptyMatrix3();
	this.normalMatrix = mat4toInverseMat3(this.viewMatrix, this.normalMatrix);
	this.normalMatrix = mat3transpose(this.normalMatrix);

	this.isIntro = false;
}

Camera.prototype.update = function() {
	if (this.isIntro) {
		var dz = -this.viewMatrix[14]/40;
		this.viewMatrix = translateMatrix4(this.viewMatrix, 0, 0, dz);
		if (this.viewMatrix[14] > -50) {
			this.viewMatrix[14] = -50;
			this.isIntro = false;
		}
	}

	this.updateOrbit();

	this.normalMatrix = emptyMatrix3();
	this.normalMatrix = mat4toInverseMat3(this.viewMatrix, this.normalMatrix);
	this.normalMatrix = mat3transpose(this.normalMatrix);
}

Camera.prototype.updateOrbit = function() {
	//this.viewMatrix = identityMatrix4();
	this.viewMatrix = translateMatrix4(this.viewMatrix, -this.x, -this.y, -this.z);
	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.velRotX/5), [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.velRotY/5), [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.velRotZ/5), [0,0,1]);
	this.viewMatrix = multiplyMatrix4(rotationMatrix, this.viewMatrix, this.viewMatrix);

	this.viewMatrix = translateMatrix4(this.viewMatrix, this.x, this.y, this.z);
}

Camera.prototype.moveOrbit = function(deltaX, deltaY, deltaZ) {
	this.viewMatrix = translateMatrix4(this.viewMatrix, -this.x, -this.y, -this.z);
	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(deltaX/5), [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(deltaY/5), [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(deltaZ/5), [0,0,1]);
	this.viewMatrix = multiplyMatrix4(rotationMatrix, this.viewMatrix, this.viewMatrix);
	this.viewMatrix = translateMatrix4(this.viewMatrix, this.x, this.y, this.z);
}

Camera.prototype.setOrbitVelocity = function(deltaX, deltaY, deltaZ) {
	this.velRotX = deltaX;
	this.velRotY = deltaY;
	this.velRotZ = deltaZ;
}

Camera.prototype.lowerOrbit = function() {
	this.viewMatrix = translateMatrix4(this.viewMatrix, -this.x, -this.y, -this.z);
	this.z += -this.z/10;
	if (this.z > -20) this.z = -20;
	this.viewMatrix = translateMatrix4(this.viewMatrix, this.x, this.y, this.z);
}

Camera.prototype.raiseOrbit = function() {
	this.viewMatrix = translateMatrix4(this.viewMatrix, -this.x, -this.y, -this.z);
	this.z += this.z/10;
	if (this.z < -450) this.z = -450;
	this.viewMatrix = translateMatrix4(this.viewMatrix, this.x, this.y, this.z);
}

Camera.prototype.getCoordBelow = function() {
	var x = this.modelMatrix[0];
	var y = this.modelMatrix[5];
	var z = this.modelMatrix[10];
	var r = Math.sqrt(x*x + y*y + z*z);

	var theta = Math.acos(z/r)
	var phi = Math.atan2(y,x);

	return [theta, phi];
}
