import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends CGFobject {
    constructor(scene, color) {
        super(scene);
        if (color == 'blue')
            this.texCoords = [
                1, 0,
                0, 0,
                0.5, 0.5
            ];
        else
            this.texCoords = [
                1, 1,
                1, 0,
                0.5, 0.5
            ];

        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            -2, 0, 0,	//0
            2, 0, 0,	//1
            0, 2, 0	    //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2
        ];

        // Normals (pointing outward along +Z)
        this.normals = [
            0, 0, 1,  // 0
            0, 0, 1,  // 1
            0, 0, 1   // 2
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

