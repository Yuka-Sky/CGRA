import {CGFobject} from '../lib/CGF.js';
/**
 * MyQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            //  x   y  z
            -0.5, 0.5, 0,   //0 A
            -0.5, -0.5, 0,	//1 B
            0.5, -0.5, 0,	//2 C
            0.5, 0.5, 0		//3 D
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            0, 2, 3
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

  