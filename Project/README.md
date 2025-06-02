# CG 2024/2025

## Group T08G01
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Tiago Teixeira   | 202208511 | up202208511@up.pt  |
| Yuka Sakai       | 202300600 | up202300600@up.pt  |

# Project - Forest Fire
### Objective
- To build an animated scene with a firefighter building, a moving helicopter and a forest on fire.

## 1. Environment Preparations
### 1.1. Terrain
We start by applying a texture to the source code `MyPlane.js` object, so that it can become a grassy terrain.

In the init() function on `MyScene`, we define our first texture:
```js
this.materials = {
      'grass1': new CGFappearance(this), // MyPlane Texture
};
this.materials.grass1.setAmbient(0.1, 0.1, 0.1, 1);
this.materials.grass1.setDiffuse(0.9, 0.9, 0.9, 1);
this.materials.grass1.setSpecular(0.1, 0.1, 0.1, 1);
this.materials.grass1.setShininess(50.0);
this.materials.grass1.loadTexture('textures/grass1.jpg');
this.materials.grass1.setTextureWrap('REPEAT', 'REPEAT');
```
Lastly, in the display function, we apply the texture to the Plane object:
```js
this.materials.grass1.apply();
this.pushMatrix();
this.scale(400, 1, 400);
this.rotate(-Math.PI / 2, 1, 0, 0);
this.plane.display();
this.popMatrix();
```
### 1.2. The Sky
Start by creating `MySphere.js`. \
This will eventually work as a Sky Sphere, an object that is visible only from within. Its center must align with the origin of the scene and its stacks and slices must be variable (you can check the code [here](MySphere.js)).

Just like our grassy terrain, we will create a new texture and map it to the Sphere:
```js
this.materials = {
    'grass1': new CGFappearance(this), // MyPlane Texture
    'sky': new CGFappearance(this)     // Sky-Sphere Texture
};
this.materials.sky.setAmbient(0.1, 0.1, 0.1, 1);
this.materials.sky.setDiffuse(0.9, 0.9, 0.9, 1);
this.materials.sky.setSpecular(0.1, 0.1, 0.1, 1);
this.materials.sky.setShininess(50.0);
this.materials.sky.loadTexture('textures/earth.jpg');
this.materials.sky.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
this.materials.sky.apply();
this.pushMatrix();
this.scale(200, 200, 200); 
this.sphere.display();
this.popMatrix();
```
The Scene currently looks like this:

<div align="center">
  <img src="screenshots/EnvironmentPreparation.png" alt="EnvironmentPreparation" width="800"/><br>
  <em>Image 1: Environment Preparation</em>
  <br>
  <br>
</div>

Obviously, its currently only visible from the outside, which is not what we want. So, we can create a new object `MyPanorama.js` that will turn this Sphere into a Sky Sphere.

For this to change, we will have to modify the code so that Scene no longer calls the sphere, and instead the Panorama will do it and apply some changes to the object.

```js
constructor(scene, texture) {
    super(scene);
    this.scene = scene;
    this.texture = texture;

    this.sphere = new MySphere(scene, 32, 16, true);
    // Material with only emissive component
    this.material = new CGFappearance(scene);
    this.material.setEmission(1.0, 1.0, 1.0, 1.0);
    this.material.setTexture(this.texture);
    this.material.setTextureWrap('REPEAT', 'REPEAT');
}

display() {
    this.scene.pushMatrix();

    this.scene.translate(this.scene.camera.position[0], 
    this.scene.camera.position[1], 
    this.scene.camera.position[2]);
    this.scene.pushMatrix();
    const scaleFactor = 800;
    this.scene.scale(scaleFactor, scaleFactor, scaleFactor);
    this.material.apply();
    this.sphere.display();
    this.scene.popMatrix();
}
```

In the constructor of `MyPanorama` we are defining a new sphere object and applying a texture to it. In the display() we are aligning the sphere with the camera's position, giving the idea that the sphere will always be in the infinite and "unreachable". We can change its size and manipulate the camera's FoV to achieve a better result:

```js
initCameras() {
this.camera = new CGFcamera(
    1.0, // FoV in radians
    0.1,
    1000,
    vec3.fromValues(200, 200, 200),
    vec3.fromValues(0, 0, 0)
);
}
```

This will provide the following result:

<div align="center">
  <img src="screenshots/project-t8g1-1.png" alt="project-t8g1-1" width="800"/><br>
  <em>Image 2: View from Above</em>
  <br>
  <br>
</div>


<div align="center">
  <img src="screenshots/FieldView.png" alt="FieldView" width="800"/><br>
  <em>Image 3: View from The Ground</em>
  <br>
  <br>
</div>

## 2. Fire-fighters Building
The firefighter building is made up of three connected modules (1 centralentral and 2 laterals) containing windows and a main door, over which there is a "BOMBEIROS" sign. The number of windows are configurable from 0 to 6 alongside the number of floors, which goes from 0 to 6 and the central module has one more floor than the other two and a heliport in the ceiling.

The `MyBuilding`, when called to `MyScene` has 5 arguments:
```js
 this.building = new MyBuilding( this,
    this.buildingSize, // Total width of the building with lateral modules 70% of the central
    this.floorNumber,  // Number of floors
    this.windowNumber, //Number of windows per floor
    this.windowTextures[this.selectedWindowTexture],  // Window type (texture)
    this.doorTextures[this.selectedDoorTexture], // Door type (new optional)
    this.wallTextures[this.selectedWallTexture], // Wall texture (new optional)
    this.buildingColor // Color of the building
    )
```
All of these variables can be manually changed while the scene is loaded, by using our interface controls, from scrollers to dropwdown options. Which in the textures you can choose between the options of `Normal`, `Minecraft`, and `Abandoned` textures, while the `color` of the building can be `White`, `Black`, `Red`, `Green`, `Blue`, `Cyan`, `Magenta`, or `Yellow`.

### 2.1 Representation of windows
**MyWindow**, used also to make the main door and the board, has dimensions of **0.2 x 0.4** to simplify when displayed. It's size depends on the `mod_central`, which takes **building size** as input in `build_size` to calculate the compensation of the module sizes (more about this in the next section):

```js
this.window_scale = this.mod_central * 0.5;
```

#### Display
For the display, we divided the avaliable space on the wall by the given **window number**+1 and skip the first position, so the window distribuition will be horizontally equidistant:

```js
this.w_range_center = this.mod_central - 2*this.dist_wall_window; // Range where window can be displayed
(...)
let wind_space_centerMod = (this.w_range_center / (this.wind_numb + 1)); // Divide the space between
let initial_x_central    = -this.mod_central/2 + this.dist_wall_window;  // Gap on the side

for (let j = 1; j <= this.wind_numb; j++) { // skip first position
    let x_central = initial_x_central + j * wind_space_centerMod; // Recalculate position to be displayed
    ...
    this.scene.translate(x_central, this.dist_wall_window + roofs, this.avoid_collision);
    this.scene.scale(this.window_scale, this.window_scale, this.window_scale);
    this.window.display();
}
```

With a placement that depends on the transactions given by arguments:
```js
this.dist_wall_window = this.central_ref / 40; // Gap between the side of the wall with the window
this.avoid_collision  = (this.central_ref / 2) + 0.05; // To avoid collision with the module wall
```
> It is 40 because that space represents 10% of the wall's height, which is 1/4 of the `central_ref` (which is 100/2.4), therefore, central_ref/4 * 10% = central_ref/40.

For better understanding and view, the scheme below shows how this structure works:

<div align="center">
  <img src="screenshots/WindowDisplay.png" alt="WindowDisplay" width="800"/><br>
  <em>Image 4: Window's Space Distribution</em>
  <br>
  <br>
</div>

### 2.2 Representation of the building
The building was structured by displaying:
- The R/C floor in Central Module using `MyFloor` with `central_ref` scaling in axis Z and Y (which are constant) and `mod_central` scaling for Z, with textured `door` and `board`,  both using `MyWindow`;
- For-loop for each floor in every Module with `MyFloor` with `central_ref`, `mod_central`, `lateral_ref`, and `mod_lateral` scaling;
- Inside the previous loop, we also display windows inside another for-loop with `MyWindow`; 
- The roof, defined by `MyRoof`, is rotated -90° in the X axis so that it faces up and translates the same height of the given module, with which the central one has a helipad using `MyCylinder`;
Where **MyFloor** consists in calling `MyWall`, which has dimensions of **1 x 0.25**, 4 times for each side.

To deal with the size compensation of the building for given `build_size`, we used the formula below to make a compensation of the module's total length, where the laterals are 70% of the central's size:

$x + 0.7*x + 0.7*x = build\_size$  ➛  $2.4*x = build\_size$ \
Therefore, $x = build\_size $

where x is the central module size.

Furthermore, we will take that value as the main base to calculate the other variables:

```js
this.central_ref      = 100 / 2.4;              // Main reference for Y and Z
this.mod_central      = build_size / 2.4;       // Central width for X
this.lateral_ref      = this.central_ref * 0.7; // Lateral reference for Y and Z
this.mod_lateral      = this.mod_central * 0.7; // Lateral width for X
this.mob_height       = this.central_ref / 4;   // Height is the same for all modules
this.mob_lat_position = (this.mod_central + this.mod_lateral) / 2; // Lateral transaction for the smaller modules
```

#### Display
The display of the floors is done inside a for-loop, with the side modules being defined to always be one floor lower than the central module.
Additionally, at each increment, we display the floors over the previous one so that the building grows upwards. This is noticeable through each translation applied to the each floor.
```js
for (let i = 1; i <= this.scene.floorNumber; i++) {
    let floors = i * this.mob_height;

    // Central Andares
    his.scene.translate(0, floors, 0); // Floor over floor
    this.scene.scale(this.mod_central, this.central_ref, this.central_ref);
    this.floor.display();
    // lateral
    this.scene.translate((+ or -)this.mob_lat_position, floors - this.mob_height, 0); // floor over floor but making sure that the tallest is always lower than the central module
    this.scene.scale(this.mod_lateral, this.central_ref, this.lateral_ref); // the height of lateral building will always be the same as the central 
    this.floor.display();
}
```

The full image of the Firefighters building in the mixed textures:

<div align="center">
  <img src="screenshots/project-t8g1-2.png" alt="project-t8g1-2" width="800"/><br>
  <em>Image 5: Building with applied textures</em>
  <br>
  <br>
</div>

## 3. Trees and forest
### 3.1. & 3.2. - Modeling a tree and Parameterization
To achieve a realistic-looking forest, we must first create a tree object. So, we will define a new class `MyTree` that shall take as parameters the following:
- **Foliage Color**: Ideally tones of green, yellow or orange, in RGB representation.
- **Tree Height**: How tall the tree should be (Trunk height is 55% of this value).
- **Trunk Radius**: To define how big the trunk will be.
- **Tilt Angle and Axis**: So that the tree can have a natural lean to a particular side.

With these variables in mind, we can build a tree object using a set of pyramids (hexagonal, for this particular situation) to make the foliage, and a cone for the trunk. \
Along with this, inside the `MyTree`'s constructor, we also make sure to add a foliage "layer count", in other words, the amount of pyramids, according to the respective height of the tree:
```js
let foliageLayersCount = Math.max(3, Math.round(treeHeight / 3));
this.foliageLayers = [];
let totalHeight = 0;
for (let i = 0; i < foliageLayersCount; i++) {
    let layerHeight = (foliageHeight * 1.5) / foliageLayersCount; 
    let layerRadius = baseRadius * (1 - i * 0.12);
    this.foliageLayers.push(new MyHexPyramid(scene, layerRadius, layerHeight));
    totalHeight += layerHeight * 0.8;
}
```
> The taller the tree, the more layers the foliage will have.

Having the assembly done, we can apply a tilt to the tree:
```js
// Tilt tree
if (this.tiltAxis === 'X') {
    this.scene.rotate(this.tiltAngle * Math.PI / 180, 1, 0, 0);
} else {
    this.scene.rotate(this.tiltAngle * Math.PI / 180, 0, 0, 1);
}
```

And test how it looks by constructing a few in `MyScene`:
```js
this.trees = [
    new MyTree(this, 0, 'X', 1, 10, [0.1, 0.5, 0.1]),    // Slight tilt, small tree
    new MyTree(this, -5, 'X', 0.8, 12, [0.3, 0.6, 0.3]), // Leaning slightly backward
    new MyTree(this, 10, 'Z', 1.2, 15, [0.2, 0.7, 0.2]), // Taller tree, more tilt
    new MyTree(this, 15, 'Z', 1.5, 18, [0.1, 0.8, 0.1]), // Very tall tree
    new MyTree(this, 7, 'X', 1, 13, [0.2, 0.6, 0.2]),    // Medium-sized tree
    new MyTree(this, -5, 'Z', 1.5, 20, [0.2, 0.4, 0.2])  // Giant tree
];
```
And displaying them somewhere, with some space inbetween:
```js
this.pushMatrix();
this.translate(-5, 0, -45);
for (let i = 0; i < this.trees.length; i++) {
    this.pushMatrix();
    this.translate(i * 4, 0, (i % 2) * 4);  // Spreading them out
    this.trees[i].display();
    this.popMatrix();
}
this.popMatrix();

this.pushMatrix(); // Same group, but with a different translation and rotation
this.translate(-5, 0, -65); 
for (let i = 0; i < this.trees.length; i++) {
    this.pushMatrix();
    this.translate((i % 2) * 4, 0, i * 3);
    this.trees[i].display();
    this.popMatrix();
}
this.popMatrix();
```

This result in something like this:

<div align="center">
  <img src="screenshots/trees.png" alt="trees" width="800"/><br>
  <em>Image 6: Tree Object</em>
  <br>
  <br>
</div>

### 3.3. Forest creation
We will create a new object `MyForest` that will be responsible for assembling a `A x B` matrix of trees.

> Note: Tree constructor parameters must be randomized and their position in this matrix must have a slight offset to achieve a more "realistic" look.

Inside `MyForest`'s constructor, we will populate the matrix with random-attribute trees, under respective intervals:
```js
this.forest = [];
for (let i = 0; i < this.lines; i++){
    let temp = [];
    // Creation of a tree
    for (let j = 0; j < this.columns; j++){

        // TILT ANGLE
        // Goes from -15 to 15
        let tiltAngle = Math.floor(Math.random() * (15 - (-15)) + (-15));
        // TILT AXIS
        // 50% chance of being either 'X' or 'Z'
        let tiltAxis = (Math.floor(Math.random() * 10) > 5) ? 'X' : 'Z';
        // TRUNK RADIUS
        // Goes from 0.7 to 1.5
        let trunkRadius = (Math.random() * (1.5 - 0.7) + 0.7);
        // HEIGHT
        // radius * 13
        let treeHeight = trunkRadius * 13;
        // COLOR
        // R: goes from 0.0 to 0.6
        // G: R + 0.4
        // B: R - random from [-0.1 ; 0.1]
        let R = Math.random() * 0.6;
        let B = (Math.random() * (0.1 + 0.1) -0.1);
        let foliageColor = [R, R + 0.4, R-B];

        temp.push(new MyTree(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, foliageColor));            
    }
    this.forest.push(temp);
}
```

<div align="center">
  <img src="screenshots/forest.png" alt="forest" width="800"/><br>
  <em>Image 7: Forest without Offsets</em>
  <br>
  <br>
</div>

Next, we add an offset to the tree positions so that they don't look like they follow parallel lines. \
For this, we can add two new values - X offset and Z offset - inside the `temp` array that makes up each line of the matrix. In other words, each tree in the matrix will now be represented as a dictionary composed of a **tree object**, an **offset** on **X** and another on **Z**.
```js
temp.push({
    tree: new MyTree(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, foliageColor),
    offsetX: Math.floor(Math.random() * (2 + 2) - 2),
    offsetZ: Math.floor(Math.random() * (2 + 2) - 2)
});   
```

Then, we apply these to the translations of each tree in the display function:
```js
display() {
    for (let i = 0; i < this.lines; i++)
        for (let j = 0; j < this.columns; j++){
            this.scene.pushMatrix();
            this.scene.translate(i * 6.5 + this.forest[i][j].offsetX, 0, j * 6.5 + this.forest[i][j].offsetZ); // apply current calculated offsets to X and Z
            this.forest[i][j].tree.display(); // current tree object
            this.scene.popMatrix();
    }
}
```

We will get the following result:

<div align="center">
  <img src="screenshots/forestOffset.png" alt="forestOffset" width="800"/><br>
  <em>Image 8: Forest with Offsets</em>
  <br>
  <br>
</div>

Along with the changes above, we modified the matrix pushes, so that according to a given probability, trees may not be "planted" at a certain position, once again aiming for a more realistic approach.

```js
let probability1 = Math.random(); // probability of having a tree
let probability2 = Math.random(); // probability of filling with empty space

if (probability1 <= this.quantityPerc){
    temp.push({
    tree: new MyTree(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, foliageColor, trunkTexture, foliageTexture),
    offsetX: Math.floor(Math.random() * (2 + 2) - 2),
    offsetZ: Math.floor(Math.random() * (2 + 2) - 2)
    });   
} else if (probability2 <= this.quantityPerc) {
    temp.push(null); // Add null for positions without trees
}
```

### 3.4 Textures on trees
We start by defining some textures in `MyScene`:
```js
// Trunk Textures
this.trunkTextures = {
    "Default": new CGFtexture(this, "textures/trunk.jpg"),
    "Birch": new CGFtexture(this, "textures/birch_trunk.jpg"),
    "Pine": new CGFtexture(this, "textures/pine_trunk.jpg")
};

// Foliage Textures
this.foliageTextures = {
    "Default": new CGFtexture(this, "textures/foliage.jpg"),
    "Dark Leaves": new CGFtexture(this, "textures/dark_foliage.jpg"),
    "Autumn": new CGFtexture(this, "textures/autumn_foliage.jpg")
};

this.selectedTrunk = "Default";
this.selectedFoliage = "Default";
```
And creating a function that can update the textures at any moment:
```js
updateForests() {
    // Recreate forests with new textures
    this.forest1_1 = new MyForest(this, 15, 7, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);
    this.forest1_2 = new MyForest(this, 13, 6, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);

    this.forest2_1 = new MyForest(this, 12, 7, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);
    this.forest2_2 = new MyForest(this, 7, 3, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);
    this.forest2_3 = new MyForest(this, 8, 2, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);

    this.forest3_1 = new MyForest(this, 25, 18, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);
    this.forest3_2 = new MyForest(this, 10, 12, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);
    this.forest3_3 = new MyForest(this, 8, 5, this.trunkTextures[this.selectedTrunk], this.foliageTextures[this.selectedFoliage]);
  }
```
Then, we can make some slight modifications to `MyForest` and `MyTree` so that they can accept textures and apply them, **if** we send them to the constructors.

In `MyForest`, we just have to pass these to the tree constructor when we populate each line of the matrix:
```js
temp.push({                                                                          //     Trunk         Foliage
    tree: new MyTree(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, foliageColor, trunkTexture, foliageTexture),
    offsetX: Math.floor(Math.random() * (2 + 2) - 2),
    offsetZ: Math.floor(Math.random() * (2 + 2) - 2)
});    
```

And in `MyTree`, we apply the textures to the materials if they were received in the contructor:
```js
    constructor(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, foliageColor, trunkTexture, foliageTexture) {
        
        (...)

        this.trunkMaterial = new CGFappearance(scene);
        this.trunkMaterial.setAmbient(0.4, 0.4, 0.4, 1);
        this.trunkMaterial.setDiffuse(0.8, 0.8, 0.8, 1);
        this.trunkMaterial.setSpecular(0.5, 0.5, 0.5, 1);
        if (trunkTexture) this.trunkMaterial.setTexture(trunkTexture);

        this.foliageMaterial = new CGFappearance(scene);
        this.foliageMaterial.setAmbient(...foliageColor, 1);
        this.foliageMaterial.setDiffuse(...foliageColor, 1);
        this.foliageMaterial.setSpecular(0.5, 0.5, 0.5, 1);
        if (foliageTexture) this.foliageMaterial.setTexture(foliageTexture);
    }
```

We can easily notice the change in the realism of the Scene:

<div align="center">
  <img src="screenshots/project-t8g1-3.png" alt="project-t8g1-3" width="800"/><br>
  <em>Image 9: Realistic Trees</em>
  <br>
  <br>
</div>

## 4. Helicopter
The helicopter was made in the folder `Helicopter` which, in short, you can divide the files into **Helicopter**, **Bucket** and Objects which compose it. When in flight, it has a bucket of water hanging down to put out fires and the vehicle can be controlled with the keyboard according to the following subsections.

### 4.1 Modeling
The Helicopter was firstly sketched as the image shows:

<div align="center">
  <img src="screenshots/heli-base.png" alt="heli-base" width="800"/><br>
  <em>Image 10: Base for helicopter</em>
  <br>
  <br>
</div>

To acheive the plan, the modeling was divided in sections:
- `MyHeliTail`: It invokes `MyETriangle`, `MyLTriangle`, `MyParallelogram`, and `MyQuad` with no scaling except for the last one for simpler handling between rotation and translation.

<div align="center">
  <img src="screenshots/heliTail2.png" alt="heliTail2" width="800"/><br>
  <em>Image 11: Sketch and process</em>
  <br>
  <br>
  <img src="screenshots/heliTail1.png" alt="heliTail1" width="800"/><br>
  <em>Image 12: Tail bbasis for helicopter</em>
  <br>
  <br>
</div>

- `MyHeliBody`: Use `MyCylinder` for the landing gear and center pin, `MyQuad` for cabine, and `MyQuarterCylinder` for the front shape. Then, `MyHeliTail` is scaled and positioned to fit the back:

<div align="center">
  <img src="screenshots/heliBody.png" alt="heliBody" width="800"/><br>
  <em>Image 13: Body of helicopter</em>
  <br>
  <br>
</div>

- `MyHeliHelice` and `MyHeliBackHelice`: Both are builded centered in the origin, using `MyCylinder` for basis and `MyCube` for the helices, so the rotation can be applied correctly:

<div align="center">
  <img src="screenshots/helices.png" alt="helices" width="800"/><br>
  <em>Image 14: Helicopter's helices</em>
  <br>
  <br>
</div>

- `MyBucket`: Structured with `MyTrapezoide` and `MyQuad` for the bucket base with `MyCylinder` and `MySphere` for structure support, was painted in both sides so it can still be seen from the inside.
- `MyLineBucket`: Calls the previous object scaled to 50% alongside `MyCylinder` and `MySphere` to build the "cables" which will hold the bucket to the helicopter

<div align="center">
  <img src="screenshots/bucket.png" alt="bucket" width="800"/><br>
  <em>Image 15: Bucket</em>
  <br>
  <br>
</div>

- `MyHeli`: Finally, combines `MyHeliBody`, `MyHeliHelice`, `MyHeliBackHelice`, and `MyBucket` to ajust the size for 10 un and cyncronize the movement:

<div align="center">
  <img src="screenshots/project-t8g1-4.png" alt="helicopter" width="800"/><br>
  <em>Image 16: Final Helicopter</em>
  <br>
  <br>
</div>

### 4.2 Animation
The behaviour of the helicopter should attend:
- Move at axis X and Z (fixed altitude for Y) and rotate in axis Y
- Tilt forward and backward in X when accelerate and brake
- Bucket released after taking off from helipad and collected when descending to helipad

The animation is made by updating the position of how and where the elements are displayed on the scene using the function `update(time)`. The ones avaliable inside `MyHeliHelice` and `MyHeliBackHelice` is used for it's rotation, while the one in `MyHeli` moves the whole object based on it's control. All of them are related to the same function in `MyScene` which updates the **time** variable synchronizing the movement.  

> MyScene.js
```js
update(t) {
  (...)
  // Calculate actual elapsed time since last frame
  const elapsed = t - this.lastT;
  this.lastT = t;
  
  // Convert to seconds and ensure it's a reasonable value (clamped between 10ms and 100ms)
  this.deltaTime = Math.max(0.01, Math.min(0.1, elapsed / 1000));
  
  // Apply speed factor to the deltaTime for helicopter movement
  const scaledDeltaTime = this.deltaTime * this.speedFactor;
  
  // Update helicopter position and rotation with scaled time
  if (this.helicopter) {
    this.helicopter.update(scaledDeltaTime);
  }
  
  // Call checkKeys to process user input
  this.checkKeys();
}
```
> MyHeliHelice.js and MyHeliBackHelice.js
```js
update(time) {
  this.heliceRotation += this.rotationSpeed * Math.abs(time);
  
  // Keep the angle within 2π to avoid large values over time
  if (this.heliceRotation > Math.PI * 2) {
    this.heliceRotation -= Math.PI * 2;
  }
} 
```

For the `acceleration` we updated the velocity vector to increment if it is a positive value and decrementif negative. The change is applied on the display
```js
accelerate(v) {
  if (this.currentState === this.states.FLYING) {
    if (v > 0) { // acceleration
      this.velocity += v;
      if (this.velocity > this.maxVelocity) {
        this.velocity = this.maxVelocity;
      }
    } else if (v < 0) { //break
      if (this.velocity > 0) {
        this.velocity = Math.max(0, this.velocity + v); // Stop the velocity at 0
      }
    }
  } else {
    console.log("Cannot accelerate.");
  }
}
```

For the turn the same logic is applied to update the variables:
```js
turn(v) {
  if (this.currentState === this.states.FLYING) {
    this.yy += v;
      
    // Normalize angle to keep it in the range [0, 2π] - AI based
    this.yy = this.yy % (2 * Math.PI);
    if (this.yy < 0) this.yy += 2 * Math.PI;
      
    // Update direction
    this.direction[0] = Math.sin(this.yy);
    this.direction[2] = Math.cos(this.yy);
  } else {
    console.log("Cannot turn.");
  }
}
```

And in the end, for every update changes the variables values applied in the display:
```js
this.scene.translate(this.x, this.y, this.z);  // Position
this.scene.rotate(this.yy, 0, 1, 0);           // Orientation
this.scene.rotate(this.inclinAngle, 1, 0, 0);  // Inclination
```

### 4.3 Control
The control was divided by pressing the next keys to:
- **W**: Accelerate forward - calls `accelerate()`
- **S**: Brake - calls `accelerate()`
- **A**: Turn left - calls `turn()`
- **D**: Turn right- calls `turn()`
- **L**: To return to helipad or pick up water - calls `land()`
- **P**: Lifting - calls `takeOff()`
- **R**: Restart initial position - calls `reset()`
- **O**: Release water - calls `releaseWater()` and `extinguishFire()`

Which in each call functions related to it and changes the state machine:

<div align="center">
  <img src="screenshots/StateMachineHeli.png" alt="state machine" width="800"/><br>
  <em>Image 17: State machine</em>
  <br>
  <br>
</div>

The final result then:

<div align="center">
  <img src="screenshots/project-t8g1-5.gif" alt="project-t8g1-5" width="800"/><br>
  <em>Image 18: Manouvers</em>
  <br>
  <br>
</div>

## 5. Water and Fire
### MyFire
In this section, we will focus on creating a fire object, composed of flames (represented by triangles). It should be parameterized and accept different widths, heights, and texture. \
In addition to these arguments, we decided to pass two more: lines and columns, such that we could follow a similar approach to the forest, making a n*m matrix, where each item is a flame:

```js
this.fire = []; // n*m matrix
for (let i = 0; i < this.lines; i++){
    let temp = [];
    for (let j = 0; j < this.columns; j++){
                
        // Width
        // if width < 5 : [5,10]
        // else [width-5,width+5]
        let tempWidth = this.width < 5 ? Math.floor(Math.random() * (10 - (5)) + (5)) : Math.floor(Math.random() * (this.width+5 - (this.width-5)) + (this.width-5));

        // Height
        // if height < 5 : [3,17]
        // else [height-7,height+7]
        let tempHeight = this.height < 5 ? Math.floor(Math.random() * (14 - (3)) + (3)) : Math.floor(Math.random() * (this.height+14 - (this.height-7)) + (this.height-7));

        temp.push({
            flame: new MyFlame(scene, tempWidth, tempHeight, this.flameMaterial),
            // we can also save values for offsets and rotation to later be used on display
            offsetX: Math.floor(Math.random() * (2 + 2) - 2),
            offsetZ: Math.floor(Math.random() * (2 + 2) - 2),
            rotation: Math.random() * Math.PI * 2
        });            
    }
    this.fire.push(temp);
}
```

Each flame is a perpendicular intersection of two triangles that get subdivided into sections to simplify the animations later on (**sinusoidal waves**).

<div align="center">
  <img src="screenshots/flame.png" alt="flame" width="800"/><br>
  <em>Image 19: Flame Blueprint</em>
  <br>
  <br>
</div>

For this, we use a function that deals with each subdivision level and an auxiliar to create the triangles in that level.

```js
createSubdividedFlame(isXYPlane) {
  const baseWidth = this.width;
  const baseHeight = this.height;
  
  const levelHeight = baseHeight / this.subdivisions;
  
  for (let level = 0; level < this.subdivisions; level++) {
      // current level's y-position and width
      const y = level * levelHeight;
      const nextY = (level + 1) * levelHeight;
      
      const currentWidth = baseWidth * (1 - level / this.subdivisions);
      const nextWidth = baseWidth * (1 - (level + 1) / this.subdivisions); // as we go up, the width decreases
      
      // front and back facing triangles for this level
      this.createLevelTriangles(
          isXYPlane, 
          y, nextY, 
          currentWidth, nextWidth,
          level, this.subdivisions
      );
  }
}
```

The auxiliar function `createLevelTriangles(isXYPlane, y, nextY, currentWidth, nextWidth, level, totalLevels)` is responsible for defining every subsection in both the XY triangle and YZ triangle, by drawing every individual portion (with essentially more triangles).

By mapping the texture coordinates in the flames, we can finally pass a texture to MyFire and get the result shown below:

<div align="center">
  <img src="screenshots/fire.png" alt="fire" width="800"/><br>
  <em>Image 20: Fire</em>
  <br>
  <br>
</div>

> The subdivisions aren't noticeable yet, but they will be important once we add shaders.

### MyLake
For the lake, we made a simple 2D figure and applied a texture to it. \
We decided to go with a heart-shaped lake:

<div align="center">
  <img src="screenshots/lakeBlueprint.png" alt="lake" width="800"/><br>
  <em>Image 21: Lake Blueprint</em>
  <br>
  <br>
</div>

Made up of 7 triangles that follow the coordinates shown above. We can apply a water texture to it and have our lake done!

<div align="center">
  <img src="screenshots/lake.png" alt="lake" width="800"/><br>
  <em>Image 22: Lake</em>
  <br>
  <br>
</div>

### Helicopter's Water Grabber and Releaser
To apply functionality to the bucket, we had to create two condition-based and two action-based functions (grab and release).

First, `isOverLake()` and `isOverFire()`. These two follow similar ideas: whenever the helicopter hovers over the object, return true. They will allow the helicopter to collect or release water, under the condition of the respective function.

Since our lake is heart-shaped (and so not exactly basic), we decided to delimit the landing area using the same triangles that were defined for itself. In `isOverLake()`, we collect the helicopter's location according to the lakes original position and dimensions:

```js
// lake transformations made in MyScene
const lakeCenterX = -110;
const lakeCenterZ = 115;
const lakeScale = 8.5;
const lakeRotZAngle = -Math.PI / 4;

// helicopter position to lake's local coordinates
const relativeX = this.x - lakeCenterX;
const relativeZ = this.z - lakeCenterZ;

// inverse rotation (to undo the -PI/4 rotation)
const cosZ = Math.cos(-lakeRotZAngle);
const sinZ = Math.sin(-lakeRotZAngle);
const rotatedX = relativeX * cosZ - relativeZ * sinZ;
const rotatedZ = relativeX * sinZ + relativeZ * cosZ;

// scale down to match lake's original dimensions
const localX = rotatedX / lakeScale;
const localZ = rotatedZ / lakeScale;
```

And checked if that location happened to be inside one of the triangles areas, using barycentric coordinates:

```js
function pointInTriangle(px, pz, v0, v1, v2) {
  const x0 = v0[0], z0 = v0[1];
  const x1 = v1[0], z1 = v1[1];
  const x2 = v2[0], z2 = v2[1];
  
  const denom = (z1 - z2) * (x0 - x2) + (x2 - x1) * (z0 - z2);
  if (Math.abs(denom) < 1e-10) return false;
  
  const a = ((z1 - z2) * (px - x2) + (x2 - x1) * (pz - z2)) / denom;
  const b = ((z2 - z0) * (px - x2) + (x0 - x2) * (pz - z2)) / denom;
  const c = 1 - a - b;
  
  return a >= 0 && b >= 0 && c >= 0;
}

for (let triangle of triangles) {
  const v0 = vertices[triangle[0]];
  const v1 = vertices[triangle[1]];
  const v2 = vertices[triangle[2]];
  
  if (pointInTriangle(localX, localZ, v0, v1, v2)) {
      return true;
  }
}
```

If this condition was met, the helicopter could land on the lake, and fill its bucket with water:

```js
fillWaterBucket() {
  this.hasWater = true;
  if (this.bucket) {
      this.bucket.setWaterStatus(true);
  }
  this.currentState = this.states.COLLECTED;
  this.displayBucket = true;
  console.log("Water collected.");
}
```

In the same logic, `isOverFire()` checks if the helicopter (with its bucket **full**), is over any of the fires, so that it can release the water and extinguish it.

As the flames follow a n*m matrix, the target areas were a lot easier to define as they are essentially square-shaped:

```js
 // total coverage area ~ 14x14 units
const fireSize = 14;
const fireRadius = fireSize / 2;

for (let i = 0; i < fires.length; i++) {
  const fire = fires[i];

  // helicopter position relative to fire center
  let relativeX = this.x - fire.x;
  let relativeZ = this.z - fire.z;
  
  const distance = Math.sqrt(relativeX * relativeX + relativeZ * relativeZ);
  if (distance < 20) {
      console.log(`Close to Fire ${i+1}!`);
  }
  
  // inverse rotation to account for fire rotation
  if (fire.rotation !== 0) {
      let cosRot = Math.cos(-fire.rotation);
      let sinRot = Math.sin(-fire.rotation);
      let rotatedX = relativeX * cosRot - relativeZ * sinRot;
      let rotatedZ = relativeX * sinRot + relativeZ * cosRot;
      relativeX = rotatedX;
      relativeZ = rotatedZ;
  }
  
  // check if helicopter is within fire bounds (rectangular area)
  if (Math.abs(relativeX) <= fireRadius && Math.abs(relativeZ) <= fireRadius) {
      if (this.y <= 120) { // allow fire detection at cruising altitude
          console.log(`Over Fire!`);
          return true;
      }
  }
}
```

#### Extinguishing the Fire Functionality:

**If** over a fire, we can **empty** the bucket and let the water **fall**.

We started by creating a function to release water and a new object that will simulate the water falling (`MyDrop`):

```js
releaseWater() {
  if (this.hasWater) {
      
      if (this.bucket) {
          this.bucket.setWaterStatus(false);
      }
      if (this.drop) {
          this.drop.startFalling(this.x, this.y, this.z);
      }
      this.hasWater = false;
      
      console.log("Water released.");
      return true;
  } else {
      console.log("No water in bucket.");
      return false;
  }
}
```

Inside `MyDrop`, we will apply a simple falling animation at a fixed speed of 40 units:

```js
// Start the falling animation from the helicopter's position
startFalling(heliX, heliY, heliZ) {
  this.falling = true;
  this.positionY = heliY - 15; // Start from bottom of the bucket
  this.startY = this.positionY;
  this.heliX = heliX;
  this.heliZ = heliZ;
  console.log(`Water drop released from position (${heliX}, ${this.positionY}, ${heliZ})`);
}

update(time) {
  if (!this.falling) return;
  this.positionY -= this.fallingSpeed * time;
  
  if (this.positionY < -3) {
    this.falling = false;
    console.log("Water drop has reached the ground");
  }
}
```

Finally, we can update the `checkKeys()` in `MyScene` for 'L' and 'O' presses:

```js
// Down or Return to Helipad 
if (this.gui.isKeyPressed("KeyL")) {
  if (!this.helicopter.hasWater && !this.helicopter.isOverLake()){
    this.helicopter.land();
    text += " L ";
    keysPressed = true;
  } else if (this.helicopter.isOverLake()) {
    this.helicopter.land();
    text += " L ";
    keysPressed = true;
  }    }

// Release water over fire
if (this.gui.isKeyPressed("KeyO")) {
  if (this.helicopter.hasWater && this.helicopter.isOverFire()) {
    this.helicopter.releaseWater();
    this.extinguishFire();
    text += " O ";
    keysPressed = true;
  }
}
```

And develop a function that will hide the display of the fires, whenever water "falls" on them. In other words, when the helicopter is over it, with a bucket full of water, and the user presses 'O'. The target areas were exactly calculated as in `isOverFire` so that we could understand which fire would be extinguished, only this time, instead of returning `true`, we wait for the water drops to reach the plane, and turn the fire's display to `false`, succesfully extinguishing it!

```js
// check if helicopter is within fire bounds
if (Math.abs(relativeX) <= fireRadius && Math.abs(relativeZ) <= fireRadius) {
  if (this.helicopter.y <= 120) {

    const dropHeight = this.helicopter.y - 15;
    const dropFallTime = dropHeight / 40;
    const delayMs = Math.max(dropFallTime * 1000, 1500);
    
    setTimeout(() => {
      this[fire.displayFlag] = false;
      console.log(`${fire.displayFlag} extinguished by water!`);
    }, delayMs);
    
    return;
  }
}
```

Result:

<div align="center">
  <img src="screenshots/project-t8g1-6.png" alt="project-t8g1-6" width="800"/><br>
  <em>Image 23: Heli, Fire, and Water</em>
  <br>
  <br>
</div>

## 6. Shaders and Animations
In this part, we worked on adding smooth animations to the scene elements.

### 6.2 Flame Waves
As mentioned in section 5 - [MyFire](#myfire), we had subdivided the flames into sections so that we could later on add more complex shaders. With these preparations already done, we can begin assembling the animation for the fire.

Inside `MyFire`, we define a new function `initShader()`, that will initialize a new shader in the scene:
```js
initShader() {
    this.flameShader = new CGFshader(this.scene.gl, "shaders/flame.vert", "shaders/flame.frag");
    this.flameShader.setUniformsValues({
        timeFactor: 0,
        flameIntensity: 0.7
    });
    
    this.startTime = performance.now();
}
```

- **flame.vert** is responsible for the wave effects in the subdivisions (this is done by following **sinusoidal functions**):
- ```js
  void main() {
    vec3 offset = vec3(0.0, 0.0, 0.0);
    
    // relative height (0 at base, 1 at top)
    float heightRatio = aVertexPosition.y / 10.0;
    
    if (aVertexPosition.y > 0.1) {
        // intensity based on height (stronger effect higher up)
        float intensity = flameIntensity * heightRatio * heightRatio;
        
        // side factor (stronger effect at the edges)
        float sideFactor = 1.0;
        if (abs(aVertexNormal.x) > 0.5) {
            // for the YZ plane triangle
            sideFactor = abs(aVertexPosition.z) / 5.0;
        } 
        else {
            // for the XY plane triangle
            sideFactor = abs(aVertexPosition.x) / 5.0;
        }
        
        // main oscillation with some randomness
        float waveX = sin(timeFactor * 2.0 + randomFactor + aVertexPosition.y * 0.3) * intensity;
        float waveZ = cos(timeFactor * 2.5 + randomFactor * 2.0 + aVertexPosition.y * 0.2) * intensity;
        
        // secondary, faster oscillation for more natural movement
        waveX += sin(timeFactor * 5.0 + randomFactor * 3.0 + aVertexPosition.y) * intensity * 0.3;
        waveZ += cos(timeFactor * 4.7 + randomFactor * 1.5 + aVertexPosition.y) * intensity * 0.2;
        
        // side-specific motion
        waveX += sin(timeFactor * 3.2 + aVertexPosition.y * 2.0) * sideFactor * intensity * 0.4;
        waveZ += cos(timeFactor * 2.8 + aVertexPosition.y * 1.5) * sideFactor * intensity * 0.4;
        
        float waveY = sin(timeFactor * 1.5 + randomFactor + aVertexPosition.y * 0.5) * intensity * 0.2;
        
        offset = vec3(waveX, waveY, waveZ);
    }
    
    // position with offset
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
    
    vTextureCoord = aTextureCoord;
  }
  ```

- **flame.frag** is responsible for color gradients and brightness:
- ```js
  void main() {
    vec2 disturbedTexCoords = vTextureCoord;
    disturbedTexCoords.x += sin(timeFactor * 4.0 + randomFactor) * 0.015;
    disturbedTexCoords.y += cos(timeFactor * 3.5 + randomFactor * 2.0) * 0.015;
    
    vec4 color = texture2D(uSampler, disturbedTexCoords);
    
    // color pulsing effect for more realism
    float pulseIntensity = 0.2;
    float pulse = 1.0 + pulseIntensity * sin(timeFactor * 3.0 + randomFactor);
    
    // pulsing to red and yellow channels for fire effect
    color.r *= pulse;
    color.g *= pulse * 0.85;
    
    float brightness = 1.0 + 0.15 * sin(timeFactor * 5.0 + randomFactor * 3.0);
    
    float yellowFactor = 1.0 - vTextureCoord.y; // More yellow at the bottom
    color.g *= mix(0.8, 1.2, yellowFactor);
    
    // variable alpha for better edge blending
    color.a *= mix(0.7, 1.0, sin(timeFactor * 2.5 + vTextureCoord.y * 6.28) * 0.5 + 0.5);
    
    color.rgb *= brightness;
    
    gl_FragColor = color;
  }
  ```

Then, we add another function to `MyFire`, that will update the fire at short cycles, to imitate the rapid movement of a flame:

```js
update(t) {
    const elapsedTime = (t - this.startTime) / 350.0;
    this.flameShader.setUniformsValues({
        timeFactor: elapsedTime
    });
  }
```

In parallel, we will call it in `MyScene`'s **update(t)** function, whenever fire is being displayed:

```js
update(t) {
  if ((this.displayFire) && this.fire) {
      this.fire.update(t);
  }

  (...)
}
```

The fire is now animated!

<div align="center">
  <img src="screenshots/project-t8g1-7.gif" alt="project-t8g1-7" width="800"/><br>
  <em>Image 24: Fire Animated</em>
  <br>
  <br>
</div>

### 6.3 Helipad Manouvers
In this section, we focused on animating the Helipad and adding 4 lights around it.

The helipad needs to alternate between H and UP whenever the Helicopter is lifting, and H and DOWN when its returning or landing. While this happens, the 4 lights must be pulsating (following **sinusoidal waves**).

So, most changes were made in `MyBuilding`, including the addition of two new objects: cylinders for disks and spheres for lights, and a function to initialize shaders and another to update them:

```js
initShaders() {
  /// Helipad
  this.helipadShader = new CGFshader(
      this.scene.gl, 
      "shaders/helipad.vert", 
      "shaders/helipad.frag"
  );
  
  this.helipadShader.setUniformsValues({
      timeFactor: 0.0,
      heliState: 0,
      uSamplerH: 0,   // H
      uSamplerUp: 1,  // UP
      uSamplerDown: 2 // DOWN
  });
  
  /// Lights
  this.lightShader = new CGFshader(
      this.scene.gl, 
      "shaders/light.vert", 
      "shaders/light.frag"
  );
  
  this.lightShader.setUniformsValues({
      timeFactor: 0.0,
      heliState: 0
  });
  
  this.startTime = performance.now();
}
```

```js
updateShaders(t) {
  const elapsedTime = (t / 1000.0) % 3600.0; // reset every hour to avoid precision issues
  
  this.helipadShader.setUniformsValues({ // responsible for H, UP, and DOWN
      timeFactor: elapsedTime
  });
  
  this.lightShader.setUniformsValues({ // responsible for light pulsations
      timeFactor: elapsedTime
  });
  
  if (this.scene.helicopter) {
      const heliState = this.scene.helicopter.currentState;
      let stateValue = 0;
      
      if (heliState === 'lifting') stateValue = 1;
      else if (heliState === 'landing') stateValue = 2;
      else if (heliState === 'returning') stateValue = 3;
      
      this.helipadShader.setUniformsValues({ heliState: stateValue });
      this.lightShader.setUniformsValues({ heliState: stateValue });
  }
}
```

> In order to know **when** we need to change shaders, we collect the helicopter's state from `MyScene`'s state machine: `const heliState = this.scene.helicopter.currentState;`. This way we know when it's `lifting`, `landing`, or `returning`. If it's doing anything else, then it remains with the default value: `let stateValue = 0`.

The activation of these is done in the display():

```js
/// Lights
// 1
this.scene.setActiveShader(this.lightShader); // HERE
this.scene.pushMatrix();
this.scene.translate(-this.helipad_r + 3, roof_height + this.mob_height, -this.helipad_r + 3);
this.scene.scale(0.65,0.65,0.65);
this.light.display();
this.scene.popMatrix();
// 2
this.scene.pushMatrix();
this.scene.translate(this.helipad_r - 3, roof_height + this.mob_height, -this.helipad_r + 3);
this.scene.scale(0.65,0.65,0.65);
this.light.display();
this.scene.popMatrix();
// 3
this.scene.pushMatrix();
this.scene.translate(-this.helipad_r + 3, roof_height + this.mob_height, this.helipad_r - 3);
this.scene.scale(0.65,0.65,0.65);
this.light.display();
this.scene.popMatrix();
// 4
this.scene.pushMatrix();
this.scene.translate(this.helipad_r - 3, roof_height + this.mob_height, this.helipad_r - 3);
this.scene.scale(0.65,0.65,0.65);
this.light.display();
this.scene.popMatrix();

/// Helipad
this.scene.setActiveShader(this.helipadShader); // AND HERE
this.scene.helipadTexture.bind(0);
this.scene.helipadUpTexture.bind(1);
this.scene.helipadDownTexture.bind(2);
this.scene.pushMatrix();
this.scene.translate(0, roof_height + this.mob_height, 0);
this.helipad.display();
this.scene.popMatrix();
```

#### About the Shaders:
We created 4 files: **.vert** and **.frag** for the Helipad, and the respective for the lights. \
The `.vert`'s are essentially the same for both cases:

```js
void main() {
    vTextureCoord = aTextureCoord;
    vTimeFactor = timeFactor;
    vHeliState = float(heliState);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
```

- `light.frag` focuses on pulsating lights (following **sinusoidal waves**) whenever the Helicopter is in states `lifting`, `landing`, or `returning`:
- ```js
  void main() {
    vec4 baseColor = vec4(0.2, 0.2, 0.2, 0.5);
    
    // lifting, landing, or returning
    float epsilon = 0.01;
    if (abs(vHeliState - 1.0) < epsilon || abs(vHeliState - 2.0) < epsilon || abs(vHeliState - 3.0) < epsilon) {
        float pulsePeriod = 0.8; // light pulse in seconds
        float sineValue = sin(vTimeFactor * 2.0 * 3.14159 / pulsePeriod);
        
        float intensity = 0.2 + 0.8 * (sineValue + 1.0) * 0.5;
        baseColor = vec4(intensity, intensity * 0.1, intensity * 0.1, 1.0); // red light
    } 
    
    // idle
    else {
        float idlePulsePeriod = 2.5;
        float sineValue = sin(vTimeFactor * 2.0 * 3.14159 / idlePulsePeriod);
        
        float pulseIntensity = 0.05 * (sineValue + 1.0) * 0.5;
        baseColor = vec4(0.8 + pulseIntensity, 0.8 + pulseIntensity, 0.8 + pulseIntensity, 1.0);
    }
    
    gl_FragColor = baseColor;
  }
  ```

- `helipad.frag` alternates the helipads texture between **UP** (when lifting), **DOWN** (when returning or landing), or **H** (for every other case):
- ```js
  void main() {
    vec4 texColor;
    
    // idle
    if (heliState == 0) {
        texColor = texture2D(uSamplerH, vTextureCoord);
    }

    // lifting
    else if (heliState == 1) {
        float period = 1.5; // seconds for one complete cycle
        float sineValue = sin(vTimeFactor * 2.0 * 3.14159 / period);
        
        float blendFactor = (sineValue + 1.0) * 0.5;
        
        vec4 baseTexture = texture2D(uSamplerH, vTextureCoord);
        vec4 altTexture = texture2D(uSamplerUp, vTextureCoord);
        texColor = mix(baseTexture, altTexture, blendFactor);
    }

    // landing or returning
    else if (heliState == 2 || heliState == 3) {
        float period = 1.5;
        float sineValue = sin(vTimeFactor * 2.0 * 3.14159 / period);
        
        float blendFactor = (sineValue + 1.0) * 0.5;
        
        vec4 baseTexture = texture2D(uSamplerH, vTextureCoord);
        vec4 altTexture = texture2D(uSamplerDown, vTextureCoord);
        texColor = mix(baseTexture, altTexture, blendFactor);
    }

    else {
        texColor = texture2D(uSamplerH, vTextureCoord);
    }
    
    gl_FragColor = texColor;
  }
  ```

## 7. Additional Developments
> **BEFORE WE BEGIN EXPLAINING THIS SECTION**: after finishing [section 6.3](#63-helipad-manouvers), we contacted our teacher and found out that we did more than what was asked for, leading to accidentally making **item B** from this section. However, since we had already finished **item A** before this, we would like to consider it for evaluation instead :)

### Item A: Animated Clouds to the Sky-Sphere
This item focuses on adding a texture over our panorama, simulating the movement of clouds. This is achieved through the use of shaders.

We started by adding two new functions to `MyPanorama`:

```js
initShader() {
  this.cloudShader = new CGFshader(this.scene.gl, 'shaders/skycloud.vert', 'shaders/skycloud.frag');
  this.cloudShader.setUniformsValues({
      uSampler2: 1,
      timeFactor: 0.0
  });
}

update(t) {
  if (this.lastTime === 0) {
      this.lastTime = t;
  }
  
  this.cloudShader.setUniformsValues({ 
      timeFactor: (t / 1000) % 1000
  }); 
}
```

These will initialize the cloud shaders and deal with the movement cycles. So, we applied them on in the `display()`:

```js
this.scene.pushMatrix();

// texture wrapping for cloud texture
this.cloudMaterial.apply();
this.cloudTexture.bind(1);

this.scene.pushMatrix();
const scaleFactor = 800;
this.scene.scale(scaleFactor, scaleFactor, scaleFactor);
this.material.apply();
this.sphere.display();
this.scene.popMatrix();
this.scene.popMatrix();
```

Finally, in `MyScene`, we just have to make sure that whenever the panorama is displayed we activate the shaders:

```js
if (this.displayPanorama){ 
  this.setActiveShader(this.panorama.cloudShader); // HERE
  this.panorama.display();
  this.setDefaultAppearance();
}  
```

And update the cloud animations at every moment:

```js
update(t) {
  (...)

  // Update panorama cloud animation
  if (this.displayPanorama && this.panorama) {
    this.panorama.update(t);
  }

  (...)
}
```

#### About the Shaders:
In one hand, `skycloud.vert` handles the positioning and texture coordinate calculation in the sphere.

```js
void main() {
  vTextureCoord = aTextureCoord; // original texture coordinates from the panorama
  
  // height calculation in the sphere (0 at bottom, 1 at top) to know where clouds will appear
  vHeight = normalize(aVertexPosition).y * 0.5 + 0.5;

  float speed = timeFactor * 0.005;

  // horizontal movement over time
  vCloudCoord = aTextureCoord + vec2(speed, 0.0);
  
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
```

While `skycloud.frag` blends the panorama background with animated clouds based on height and cloud density.

```js
void main() {
  vec4 panoramaColor = texture2D(uSampler, vTextureCoord); // panorama texture
  
  vec4 cloudSample = texture2D(uSampler2, vCloudCoord); // cloud layer
  
  float heightFactor = 0.0;
  if (vHeight > 0.45) { // clouds only appear above 45% of the sphere's height
      heightFactor = 4.0 * (vHeight - 0.45) * (1.0 - vHeight);
      heightFactor = max(0.0, heightFactor); 
  }
  
  // cloud value from grayscale
  float cloudValue = (cloudSample.r + cloudSample.g + cloudSample.b) / 3.0;
  cloudValue = smoothstep(0.3, 0.6, cloudValue);
  float cloudFactor = cloudValue * heightFactor * 2.0;
  
  vec3 cloudColor = vec3(1.3, 1.3, 1.3);
  
  // sky and clouds blend
  vec3 finalColor = mix(panoramaColor.rgb, cloudColor, cloudFactor);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
```

With these, we get this result in the Scene!

<div align="center">
  <img src="screenshots/project-t8g1-8.gif" alt="project-t8g1-8" width="800"/><br>
  <em>Image 25: Clouds in the Sky</em>
  <br>
  <br>
</div>
