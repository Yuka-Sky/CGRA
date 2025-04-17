import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
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
                var nextAng = (slice + 1) * alphaAng;

                var x1 = Math.cos(ang);
                var y1 = Math.sin(ang);
                var x2 = Math.cos(nextAng);
                var y2 = Math.sin(nextAng);

                // Adicionar vértices
                this.vertices.push(x1, y1, z);
                this.vertices.push(x2, y2, z);

                // Normais para cada lado
                let nx = Math.cos((slice + 0.5) * alphaAng);
                let ny = Math.sin((slice + 0.5) * alphaAng);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);

                if (stack < this.stacks) {
                    let curr = stack * this.slices * 2 + slice * 2;
                    let next = (stack + 1) * this.slices * 2 + slice * 2;

                    this.indices.push(curr, next + 1, next);
                    this.indices.push(curr, curr + 1, next + 1);
                }
                
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

  
