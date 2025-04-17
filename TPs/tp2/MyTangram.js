import {CGFobject} from '../lib/CGF.js';
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
    }
    
    display(){
        // Create Tangram Pieces
        this.d = new MyDiamond(this.scene);
        this.t = new MyTriangle(this.scene);
        this.s1 = new MyTriangleSmall(this.scene);
        this.s2 = new MyTriangleSmall(this.scene);
        this.b1 = new MyTriangleBig(this.scene);
        this.b2 = new MyTriangleBig(this.scene);
        this.p = new MyParallelogram(this.scene);

        // Display Tangram
        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.d.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.415,3,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.t.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-1,0);
        this.s1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.65,-1,0);
        this.scene.rotate(Math.PI,0,0,1);
        this.s2.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-1,1,0);
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.b1.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-2.415,0.75,0);
        this.scene.rotate(-Math.PI*3/4,0,0,1);
        this.b2.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0.65,-2,0);
        this.scene.rotate(Math.PI,0,1,0);
        this.p.display();
        this.scene.popMatrix();
    }

    
}

