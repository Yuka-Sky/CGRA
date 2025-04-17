import {CGFobject, CGFtexture} from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";
/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, top, front, right, back, left, bottom) {
        super(scene);

        this.top = top instanceof CGFtexture ? top : new CGFtexture(scene, top);
        this.front = front instanceof CGFtexture ? front : new CGFtexture(scene, front);
        this.right = right instanceof CGFtexture ? right : new CGFtexture(scene, right);
        this.back = back instanceof CGFtexture ? back : new CGFtexture(scene, back);
        this.left = left instanceof CGFtexture ? left : new CGFtexture(scene, left);
        this.bottom = bottom instanceof CGFtexture ? bottom : new CGFtexture(scene, bottom);

        this.quads = {
            front: new MyQuad(scene),
            right: new MyQuad(scene),
            back: new MyQuad(scene),
            left: new MyQuad(scene),
            top: new MyQuad(scene),
            bottom: new MyQuad(scene),
        };
    }
    
    display(){
        const gl = this.scene.gl;
        const filter = this.scene.useNearestFiltering ? gl.NEAREST : gl.LINEAR;
    
        // Front Face (+Z)
        if (this.front){
            this.front.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        }
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.quads.front.display();
        this.scene.popMatrix();
    
        // Right Face (+X)
        if (this.right){
            this.right.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        }
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.quads.right.display();
        this.scene.popMatrix();
    
        // Back Face (-Z)
        if (this.back){
            this.back.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        }
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.quads.back.display();
        this.scene.popMatrix();
    
        // Left Face (-X)
        if (this.left){
            this.left.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        }
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.quads.left.display();
        this.scene.popMatrix();
    
        // Top Face (+Y)
        if (this.top){
            this.top.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        }
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.quads.top.display();
        this.scene.popMatrix();
    
        // Bottom Face (-Y)
        if (this.bottom){
            this.bottom.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        }
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.quads.bottom.display();
        this.scene.popMatrix();
    }    
}

