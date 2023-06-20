# Welcome to the Document about HomeFudge

[Arthur Erlich](https://github.com/ArthurErlich/PRIMA) [![wakatime](https://wakatime.com/badge/github/ArthurErlich/PRIMA.svg)](https://wakatime.com/badge/github/ArthurErlich/PRIMA)

## Table of Contents

- [Welcome to the Document about HomeFudge](#welcome-to-the-document-about-homefudge)
  - [Table of Contents](#table-of-contents)
  - [Why this document?](#why-this-document)
  - [Idea](#idea)
    - [The Destroyer:](#the-destroyer)
    - [Some Math:](#some-math)
  - [Astroid Spawning fo worst-case scenario](#astroid-spawning-fo-worst-case-scenario)

## Why this document?

I will use that document to write down information about the HomeFudge project. I will use it to write down ideas and to keep track of the progress. I will also use it to write down the math I will use for the project and some code snippets i will later use in the project.

## Idea

The basic idea of the Game Prototype is to have a Destroyer equipped with:

- One Gatling Turret for PD
- Two missile launchers
- Two beam weapons

The ideal case for the Game Prototype would be to have two Destroyers in a battle with each other using Fudge's Network ability for two players and an AI variant of the battle. The worst-case scenario is to have the Gatling Turret player-controlled to destroy incoming asteroids.

### The Destroyer:

![Back](assets/20230430_142556_image.png)
![Front](assets/20230430_142709_image.png)

### Some Math:

[Shooting a Moving Target (gamedeveloper.com)](https://www.gamedeveloper.com/programming/shooting-a-moving-target)
I found a got a solution for the problem of shooting a moving targe will be used for aiming the Gatling Turret.

```csharp
// Find the relative position and velocities
Vector3 relativePosition = target.position - gun.position;
Vector3 relativeVelocity = target.velocity - gun.velocity;

// Calculate the time a bullet will collide
// if it's possible to hit the target.
float deltaTime = AimAhead(relativePosition, relativeVelocity, bulletSpeed);

// If the time is negative, then we didn't get a solution.
if(deltaTime > 0f){
  // Aim at the point where the target will be at the time of the collision.
  Vector3 aimPoint = target.position + target.velocity*deltaTime;

  // fire at aimPoint!!!
}

// relativePosition: relative position
// relativeVelocity: relative velocity
// bulletSpeed: Speed of the bullet (muzzle velocity)
// returns: Delta time when the projectile will hit, or -1 if impossible
float AimAhead(Vector3 relativePosition, Vector3 relativeVelocity, float bulletSpeed){
  // Quadratic equation coefficients a*t^2 + b*t + c = 0
  float a = Vector3.Dot(relativeVelocity, relativeVelocity) - muzzleV*bulletSpeed;
  float b = 2f*Vector3.Dot(relativeVelocity, relativePosition);
  float c = Vector3.Dot(relativePosition, relativePosition);

  float desc = b*b - 4f*a*c;

  // If the discriminant is negative, then there is no solution
  if(det > 0f){
    return 2f*c/(Mathf.Sqrt(desc) - b);
  } else {
    return -1f;
  }
}
```

Before I found that solution, I started doing my own math, which I will keep here for reference:
![](assets/20230430_170605_image.png)
doesn't it look beautiful?

## Astroid Spawning fo worst-case scenario

There wil be multipy types of diffrent astroid each with diffrent healtpoints and spawning location. Astroid are randomly spawnend in front of the ship. To spawn diffrent astroids with diffrent wights I wll use that codeSnippet:

```typescript
//EXAMPLE of the astroid array and the whights of the astroids
let astroid:string[] = ["large","medium","small"];
let weights:number[] = [1,1,1];

//Weighted Random algorithm
//The Weihts must be sorted from smallest to largest
function weightedRandom(astroid:string[],weights:number[]):string{
  let cumulativeWeights :number[] = new Array();
  let maxCumulativeWeight:number = 0;
  let randomNumber = 0;

  //Error Checking
  if (astroid.length !== weights.length){
    throw new Error("Items and weights must be of the same size!");
  } 
  if (!astroid.length) {
    throw new Error('Items must not be empty');
  }
  // Preparing the cumulative weights array.
  for (let i:number = 0; i < weights.length; i++){
    //if cumulativeWeights[i-1] == udifed or null, it will put 1 there instand // [i-1] || 0 \\!
    cumulativeWeights[i] = (weights[i] + (cumulativeWeights[i-1]||0));
  }
  //getting the random number in reange of the cumulativeWeights array
  maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length-1];
  randomNumber = (maxCumulativeWeight * Math.random());

  //picking the astroid
  for(let i:number = 0; i < astroid.length; i++){
    if(cumulativeWeights[i] >= randomNumber){
      return astroid[i];
    }
  }
  return "null";
}
```

Test with 1000 [iterations](https://www.typescriptlang.org/play?#code/LAKANgpgLgBAhgZygJwPYEsAmAuJz0B2A5gNoC6MAvDCQERhzJES0A0tAthJugK4dtaCDnDBhaZANyhIsAO4R0RABZQE2AvwBGEZOSo0AjKwBMrAMxTQM6DCgQkAGXRJcKQqQrUCEOTACCyMhwAJ4AFACU0iCgIoSR0QBmvAQAxlDoqAQwcQSR2ABuGJgA3qAwMImoyGGyMOga2roGAAyS9QA8hi09kugA1P0RZSAVFfZOLlAAdAAOvAjKYQpKqtwASnAEmKgcYYgoxawrKmoRUeUwAL6XdanKW6kOjRw6el40LaxfLVajldUYLVbA1NK9mtQ2ugOhMoM4kNNIMQoMo+oNhpcKuhEmFYfCoCR0GRKJR6IxmLQMf8xjB7o8HCRfoNojSbtSadjcQ44VNCcTSVwePxKSMaRU6WkGYYyMzMdc5WNOXjeUSSUIRGIRQraQ9JQgSCYZf0WWM2RUzbSsghUJBEagiGEJU8EBcQGzQAB6D0AdUUp24ME22128DARGq6BRHE9HoAKsoIDBfehVAgcgtYDoYNbkPZMJU0BxsxrIEg7KgYAwmNzQMk0hksjATmtMEGdnsDmgsG58MRyMc-amXm9yBEex5RZXbKl+LwGBkChBk6c08PdPpvL4AkFQglbrYRAAPADCs-n6EXy9Ua+QrRNdWCwY4ADkmrfIdFrP8vQBRIKA48E1SABrDxLmxIFO2KREIGRZQYAAQhJJtBzUGC4KpGkUTQPwfD8P80BqWgAEl7A4NMtnzZs1HTMss1QRI7ATbM4C4bN0AALwgBDKRNK4YHAxiwgQqCsHQogUQiGBJ3GZQcJgPCYAI6owgAclIiByNo2ACFQTNE002YoBCVTXXNS4vRgAAFZAIFmRgPCYxMZw4Oc4AXRNqIoncQmmS4qlvYFYFBN873qGAOhQ1Y0KRCTUXqdEZJgL0IJctyPKvNRCQAWmlKhqF4HhEgDQFNDEVh6nkdAxBgeZYEMJzbPqAgkEo5KPRodBcooAAfHqYBaGAAB0hoQuU0vPS9UP1IkDGWaa+RgfogQm9yLyXBauulPqWnOPiLI9ZgoAyYgnJgR92wU0LCHOiAtmYGAGLO1aMum+AfMuI9T1cyaNuigwXvWzL9UBqbooQcSUW6k0Lt2V9wXfIEvrPNawdOGAACoYAAWXc5RplhvY9q-CovVmdAQMclFE1EzB-JUuoQoRsL0Ai+A8Gg2KUXaAYhiSzlQb+ldFoAPmoQn4beTCxVsqBeGQbJab5E1zP+C1Zfl7JaDK8RojZIA)

`let astroid:string[] = ["large","medium","small"];`
`let weights:number[] = [1,2,3];`
`[LOG]: [184, 327, 489]`

-->

here is a way to find out how many Logical cpu cores the users has:
```typescript	
window.navigator.hardwareConcurrency/2;

```
by using we can use Threading in Java to make the game run faster/smoother!
```typescript	
const worker = new Worker('worker.js');
```
https://www.youtube.com/watch?v=pQPqhZRUz3U
https://vkguide.dev/docs/extra-chapter/multithreading/
