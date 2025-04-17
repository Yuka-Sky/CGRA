import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            //  x   y  z
            -0.5, 0.5, -0.5,  // 0 A
            -0.5, 0.5, 0.5,   // 1 B
            0.5, 0.5, 0.5,    // 2 C
            0.5, 0.5, -0.5,   // 3 D
            -0.5, -0.5, -0.5, // 4 E
            -0.5, -0.5, 0.5,  // 5 F
            0.5, -0.5, 0.5,   // 6 G
            0.5, -0.5, -0.5   // 7 H
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0,1,2, 0,2,3, // face 1
            0,4,5, 0,5,1, // face 2
            1,5,6, 1,6,2, // face 3
            2,6,7, 2,7,3, // face 4
            3,7,4, 3,4,0, // face 5
            5,4,7, 5,7,6  // face 6
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

