import {CGFobject} from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,	//0
            2, 0, 0,	//1
            1, 1, 0,	//2
            3, 1, 0,    //3

            0, 0, 0,	//4
            2, 0, 0,	//5
            1, 1, 0,	//6
            3, 1, 0		//7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            2, 1, 3,
            6, 5, 4,
            7, 5, 6
        ];

        // Normals (front face +Z, back face -Z)
        this.normals = [
            0, 0, 1,  // 0
            0, 0, 1,  // 1
            0, 0, 1,  // 2
            0, 0, 1,  // 3
            0, 0, -1, // 4 (back)
            0, 0, -1, // 5 (back)
            0, 0, -1, // 6 (back)
            0, 0, -1  // 7 (back)
        ];

        this.texCoords = [
			1, 1,
            0.5, 1,
            0.75, 0.75,
            0.25, 0.75,
            
            0.25, 0.75,
            0.75, 0.75,
            0.5, 1,
            1, 1
		];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

