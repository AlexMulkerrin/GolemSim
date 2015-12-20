function identityMatrix4() {
	return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
}

function translateMatrix4(matrix, tx, ty, tz) {
	var newMat = matrix.slice(0);
	newMat[12] += tx;
	newMat[13] += ty;
	newMat[14] += tz;
	return newMat;
}

function rotateY(m,angle) {
	var c=Math.cos(angle);
	var s=Math.sin(angle);
	var mv0=m[0], mv4=m[4], mv8=m[8];
	m[0]=m[0]*c-m[2]*s;
	m[4]=m[4]*c-m[6]*s;
	m[8]=m[8]*c-m[10]*s;

	m[2]=m[2]*c+mv0*s;
	m[6]=m[6]*c+mv4*s;
	m[10]=m[10]*c+mv8*s;

	return m;
}

function rotateMatrix4(a,b,c,d){
	var e=c[0],g=c[1];
	c=c[2];
	var f=Math.sqrt(e*e+g*g+c*c);
	if(!f)return null;
	if(f!=1){f=1/f;
	e*=f;
	g*=f;
	c*=f}var h=Math.sin(b),i=Math.cos(b),j=1-i;
	b=a[0];
	f=a[1];
	var k=a[2],l=a[3],o=a[4],m=a[5],n=a[6],p=a[7],r=a[8],s=a[9],A=a[10],B=a[11],t=e*e*j+i,u=g*e*j+c*h,v=c*e*j-g*h,w=e*g*j-c*h,x=g*g*j+i,y=c*g*j+e*h,z=e*c*j+g*h;
	e=g*c*j-e*h;
	g=c*c*j+i;
	if(d){if(a!=d){d[12]=a[12];
	d[13]=a[13];
	d[14]=a[14];
	d[15]=a[15]}}else d=a;
	d[0]=b*t+o*u+r*v;
	d[1]=f*t+m*u+s*v;
	d[2]=k*t+n*u+A*v;
	d[3]=l*t+p*u+B*
	v;
	d[4]=b*w+o*x+r*y;
	d[5]=f*w+m*x+s*y;
	d[6]=k*w+n*x+A*y;
	d[7]=l*w+p*x+B*y;
	d[8]=b*z+o*e+r*g;
	d[9]=f*z+m*e+s*g;
	d[10]=k*z+n*e+A*g;
	d[11]=l*z+p*e+B*g;
	return d
}

function multiplyMatrix4(a,b,c){
	c||(c=a);
	var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],o=a[9],m=a[10],n=a[11],p=a[12],r=a[13],s=a[14];
	a=a[15];
	var A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14];
	b=b[15];
	c[0]=A*d+B*h+t*l+u*p;
	c[1]=A*e+B*i+t*o+u*r;
	c[2]=A*g+B*j+t*m+u*s;
	c[3]=A*f+B*k+t*n+u*a;
	c[4]=v*d+w*h+x*l+y*p;
	c[5]=v*e+w*i+x*o+y*r;
	c[6]=v*g+w*j+x*m+y*s;
	c[7]=v*f+w*k+x*n+y*a;
	c[8]=z*d+C*h+D*l+E*p;
	c[9]=z*e+C*i+D*o+E*r;
	c[10]=z*
	g+C*j+D*m+E*s;
	c[11]=z*f+C*k+D*n+E*a;
	c[12]=q*d+F*h+G*l+b*p;
	c[13]=q*e+F*i+G*o+b*r;
	c[14]=q*g+F*j+G*m+b*s;
	c[15]=q*f+F*k+G*n+b*a;
	return c
};

function emptyMatrix3() {
	return [0, 0, 0,
			0, 0, 0,
			0, 0, 0
		];
}

function mat4toInverseMat3(a,b){
	var c = a[0],
	d = a[1],
	e = a[2],
	g = a[4],
	f = a[5],
	h = a[6],
	i = a[8],
	j = a[9],
	k = a[10],
	l = k*f-h*j,o = -k*g+h*i,m = j*g-f*i,n = c*l+d*o+e*m;
	if(!n) return null;
	n = 1/n;
	b[0] = l*n;
	b[1] = (-k*d+e*j)*n;
	b[2] = (h*d-e*f)*n;
	b[3] = o*n;
	b[4] = (k*c-e*i)*n;
	b[5] = (-h*c+e*g)*n;
	b[6] = m*n;
	b[7] = (-j*c+d*i)*n;
	b[8] = (f*c-d*g)*n;
	return b;
}

function mat3transpose(a,b){
	if(!b||a === b){
		var c = a[1],d = a[2],e = a[5];
		a[1] = a[3];
		a[2] = a[6];
		a[3] = c;
		a[5] = a[7];
		a[6] = d;
		a[7] = e;
		return a;
	}
	b[0] = a[0];
	b[1] = a[3];
	b[2] = a[6];
	b[3] = a[1];
	b[4] = a[4];
	b[5] = a[7];
	b[6] = a[2];
	b[7] = a[5];
	b[8] = a[8];
	return b;
}

function getProjectionMatrix4(angle, a, minZ, maxZ) {
	var tan = Math.tan(degToRad(0.5*angle));
	var A = -(maxZ+minZ)/(maxZ - minZ);
	var B = (-2*maxZ*minZ)/(maxZ-minZ);

	return [
			0.5/tan,	0,			0,	0,
			0,			0.5*a/tan,	0, 	0,
			0,			0,			A,	-1,
			0,			0,			B,	0
	];
}

function degToRad(angle) {
	return(angle*Math.PI/180);
}

function scalarMultiplyVector3(scaler, vector) {
	return [scaler*vector[0],
			scaler*vector[1],
			scaler*vector[2],

];
}
