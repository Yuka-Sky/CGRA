import {CGFobject} from '../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js'; 
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyParallelogram } from "./MyParallelogram.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        // Create Tangram Pieces
        this.d = new MyDiamond(this.scene);
        this.t = new MyTriangle(this.scene);
        this.s1 = new MyTriangleSmall(this.scene, 'blue');
        this.s2 = new MyTriangleSmall(this.scene, 'red');
        this.b1 = new MyTriangleBig(this.scene, 'blue');
        this.b2 = new MyTriangleBig(this.scene, 'orange');
        this.p = new MyParallelogram(this.scene);
        
        // Materials for each piece (high specular)
        this.materials = {
            'diamond': new CGFappearance(this.scene),
            'triangle': new CGFappearance(this.scene),
            'smallTriangle1': new CGFappearance(this.scene),
            'smallTriangle2': new CGFappearance(this.scene),
            'bigTriangle1': new CGFappearance(this.scene),
            'bigTriangle2': new CGFappearance(this.scene),
            'parallelogram': new CGFappearance(this.scene),
            'tangramMaterial': new CGFappearance(this.scene)
        };
        
        // Material for Diamond
        this.materials.diamond.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.diamond.setDiffuse(0.0, 1.0, 0.0, 1.0); // Green
        this.materials.diamond.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.diamond.setShininess(50.0);  // High shininess

        // Material for Triangle
        this.materials.triangle.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.triangle.setDiffuse(1.0, 0.0, 1.0, 1.0); // Pink
        this.materials.triangle.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.triangle.setShininess(50.0);

        // Material for Small Triangle 1
        this.materials.smallTriangle1.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.smallTriangle1.setDiffuse(1.0, 0.0, 0.0, 1.0); // Red
        this.materials.smallTriangle1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.smallTriangle1.setShininess(50.0);

        // Material for Small Triangle 2
        this.materials.smallTriangle2.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.smallTriangle2.setDiffuse(0.5, 0.0, 1.0, 1.0); // Purple
        this.materials.smallTriangle2.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.smallTriangle2.setShininess(50.0);

        // Material for Big Triangle 1
        this.materials.bigTriangle1.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.bigTriangle1.setDiffuse(1.0, 0.5, 0.0, 1.0); // Orange 
        this.materials.bigTriangle1.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.bigTriangle1.setShininess(50.0);

        // Material for Big Triangle 2
        this.materials.bigTriangle2.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.bigTriangle2.setDiffuse(0.0, 0.0, 1.0, 1.0); // Blue
        this.materials.bigTriangle2.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.bigTriangle2.setShininess(50.0);

        // Material for Parallelogram
        this.materials.parallelogram.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.materials.parallelogram.setDiffuse(1.0, 1.0, 0.0, 1.0); // Yellow 
        this.materials.parallelogram.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materials.parallelogram.setShininess(50.0);

        // Material for Tangram Pieces
        this.materials.tangramMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.materials.tangramMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materials.tangramMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.materials.tangramMaterial.setShininess(50.0);
        this.materials.tangramMaterial.loadTexture('images/tangram.png');
        this.materials.tangramMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        // Apply materials and display Tangram
        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(1, 0, 0);
        this.d.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(0.415, 3, 0);
        this.scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.t.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(0, -1, 0);
        this.s1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(0.65, -1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.s2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(-1, 1, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.b1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(-2.415, 0.75, 0);
        this.scene.rotate(-Math.PI * 3 / 4, 0, 0, 1);
        this.b2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materials.tangramMaterial.apply();
        this.scene.translate(0.65, -2, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.p.display();
        this.scene.popMatrix();
    }
}

