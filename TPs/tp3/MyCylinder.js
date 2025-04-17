import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
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
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let alphaAng = (2 * Math.PI) / this.slices;
        let stackHeight = 1.0 / this.stacks;

        for (let stack = 0; stack <= this.stacks; stack++) {
            let z = stack * stackHeight;

            for (let slice = 0; slice < this.slices; slice++) {
                var ang = slice * alphaAng;

                var x = Math.cos(ang);
                var y = Math.sin(ang);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, 0);

                if (stack < this.stacks) {
                    let curr = stack * this.slices + slice;
                    let next = (stack + 1) * this.slices + slice;

                    let nextSlice = (slice + 1) % this.slices; // Conectar a última fatia com a primeira

                    let currNext = stack * this.slices + nextSlice;
                    let nextNext = (stack + 1) * this.slices + nextSlice;
                
                    this.indices.push(curr, nextNext, next);
                    this.indices.push(curr, currNext, nextNext);
                }
                
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

  
