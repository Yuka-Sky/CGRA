# Use of AI
Quotes and explains why, where, and how this tool was used to support the development.
> For sections that are not listed here, it may be implied that AI wasn't used.

#### Helicopter - Animation and Control
- Inside the `update(t)` in `MyScene.js` AI was used to obtain the value of `delta_t`:
- ```js
    // Static variable to keep track of the last update time
    if (!this.lastT) {
        this.lastT = t;
        return;
    }

    // Calculate actual elapsed time since last frame
    const elapsed = t - this.lastT;
    this.lastT = t;

    // Convert to seconds and ensure it's a reasonable value (clamped between 10ms and 100ms)
    this.delta_t = Math.max(0.01, Math.min(0.1, elapsed / 1000));
    ```

#### `update(t)` and other functions from `MyHeli.js`
At first, we wrote the conditions for this function using if and else conditions, however we quickly noticed this idea was becoming complex and "ugly code". So, we asked AI for suggestions. \
We were advised to use a state-machine to simplify the conditions, separating in **IDLE**, **LIFTING**, **FLYING**, and **LANDING**.
> **COLLECTED** and **RETURNING** were later added following the given logic, but without AI

#### Other Suggestions and Uses

To use a list for direction of displacement instead of declaring variable one by one: 

```js
this.direction = [Math.sin(this.yy), 0, Math.cos(this.yy)]; //[x, y, z]
by
this.x += this.direction[0] * this.velocity * t;
this.y += this.direction[1] * this.velocity * t;
this.z += this.direction[2] * this.velocity * t;
``` 

To obtain the current helicopter coordinates (x and z) for distance calculation when in **RETURNING** state and be able detect the helipad:

```js
case this.states.LANDING:
    ...
    // Landing at helipad
    else if (Math.abs(this.x) < 5 && Math.abs(this.z + 140) < 5) {
        if (this.y <= this.initialY) {
            ...
        }
    } 
...
case this.states.RETURNING:
    this.x += this.direction[0] * this.velocity * t;
    this.z += this.direction[2] * this.velocity * t;
    ...
    if (distance < 5) {
        ...
        this.x = targetX;
        this.z = targetZ;
        ...
    }
```

`turn(t)` - used in angle normalization:

```js
this.yy = this.yy % (2 * Math.PI);
if (this.yy < 0) this.yy += 2 * Math.PI;
```

`updateInclination()` - used to make a smoother animation:
```js
if (this.inclinAngle !== inclination) {
    // Calculate step size for this frame
    const step = this.inclinSpeed * t;
    
    if (Math.abs(this.inclinAngle - inclination) < step) {
        this.inclinAngle = inclination;
    } else if (this.inclinAngle < inclination) {
        this.inclinAngle += step;
    } else {
        this.inclinAngle -= step;
    }
}
```


`isOverLake()` - we were having difficulty defining the valid landing area (the lake), due to being a rather complex shape to track with coordinates. AI assisted us in making an auxiliary function to check whenever a point is inside a triangle using barycentric coordinates:

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
```

`returnToHelipad()` - to reach the helipad through the shortest path (hypotenuse), we needed to calculate a rotation angle to apply on the helicopter. We tried ourselves but kept getting results that would lead to the helicopter going past the helipad instead of aligning properly. We got a simpler solution with AI:

```js
if (distance > 0.1) {
    // Normalize and set direction
    this.direction[0] = dx / distance;
    this.direction[2] = dz / distance;
    this.velocity = 40;
    
    // Calculate angle for rotation (yy)
    this.yy = Math.atan2(this.direction[0], this.direction[2]);
} 
```

> The functions `land()` and `releaseWater()` were also polished by AI, but made by us

## Shaders
In this section, the use of AI was simply to fix minor issues in the animations.

### Flame
In `flame.vert`, we were creating the sinusoidal waves in a rather "abrupt" way. AI suggested an approach that was a lot smoother:

```js
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
```