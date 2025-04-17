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
    
    setNormalViz(displayNormals) {
        if (displayNormals) {
            this.enableNormalViz();
        } else {
            this.disableNormalViz();
        }
    }
    
    initBuffers() {
        this.vertices = [
            // Front face
            -0.5, -0.5,  0.5,  // 0
             0.5, -0.5,  0.5,  // 1
             0.5,  0.5,  0.5,  // 2
            -0.5,  0.5,  0.5,  // 3

            // Back face
            -0.5, -0.5, -0.5,  // 4
            -0.5,  0.5, -0.5,  // 5
             0.5,  0.5, -0.5,  // 6
             0.5, -0.5, -0.5,  // 7

            // Left face
            -0.5, -0.5, -0.5,  // 8
            -0.5, -0.5,  0.5,  // 9
            -0.5,  0.5,  0.5,  // 10
            -0.5,  0.5, -0.5,  // 11

            // Right face
             0.5, -0.5, -0.5,  // 12
             0.5,  0.5, -0.5,  // 13
             0.5,  0.5,  0.5,  // 14
             0.5, -0.5,  0.5,  // 15

            // Top face
            -0.5,  0.5, -0.5,  // 16
            -0.5,  0.5,  0.5,  // 17
             0.5,  0.5,  0.5,  // 18
             0.5,  0.5, -0.5,  // 19

            // Bottom face
            -0.5, -0.5, -0.5,  // 20
             0.5, -0.5, -0.5,  // 21
             0.5, -0.5,  0.5,  // 22
            -0.5, -0.5,  0.5   // 23
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,  0, 2, 3,  // Front
            4, 5, 6,  4, 6, 7,  // Back
            8, 9, 10,  8, 10, 11,  // Left
            12, 13, 14,  12, 14, 15,  // Right
            16, 17, 18,  16, 18, 19,  // Top
            20, 21, 22,  20, 22, 23   // Bottom
        ];

        // Normals (one per vertex, aligned with each face)
        this.normals = [
            // Front
            0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
            // Back
            0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
            // Left
            -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0,
            // Right
            1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
            // Top
            0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,
            // Bottom
            0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

