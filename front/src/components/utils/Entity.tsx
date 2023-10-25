// import React from 'react';
// import { Scaled } from './Scaled';
import type Size from './Size';
import Location from './Location';
// import type Area from './Area';
// import type Racket from './Racket';

class Entity {
  location: Location;
  // size: Size;
  // x: number;
  // y: number;
  // velocity: Size;

  constructor(size: Size) {
    this.location = new Location(size);
    // this.size = size;
    // this.x = 400;
    // this.y = 400;
    // this.velocity = new Size(0, 0);
  }

  getLocation(): Location {
    return this.location;
  }

  // getSize(): Size {
  //   return this.size;
  // }

  // getVelocity(): Size {
  //   return this.velocity;
  // }

  // getX(): number {
  //   return this.x;
  // }

  // getY(): number {
  //   return this.y;
  // }

  // setVelocitySize(velocity: Size): void {
  //   this.velocity = velocity;
  // }

  // setVelocity(x: number, y: number): void {
  //   this.velocity = new Size(x, y);
  // }

  // move(x: number, y: number): void {
  //       // Obtenez les coordonnées actuelles de la balle
  //       const currentX = this.getLocation().getX();
  //       const currentY = this.getLocation().getY();

  //       // Obtenez les composantes de vitesse actuelles de la balle
  //       const velocityX = x;
  //       const velocityY = y;

  //       // Calculez les nouvelles coordonnées en ajoutant les composantes de vitesse
  //       const newX = currentX + velocityX;
  //       const newY = currentY + velocityY;

  //       // Mettez à jour la position de la balle
  //       this.getLocation().setXY(newX, newY);
  //     }

  // checkCollisionWith(area: Area, racket: Racket): boolean {
  //   // Vérifier la collision de la balle avec une raquette
  //   if (!this || !racket) return false;

  //   const ballX = this.getLocation()?.getX() || 0;
  //   const ballY = this.getLocation()?.getY() || 0;
  //   const racketSize = area.racketSize();

  //   const racketX = racket.getLocation()?.getX() || 0;
  //   const racketY = racket.getLocation()?.getY() || 0;

  //   if (
  //     ballX < racketX + racketSize.getWidth() &&
  //     ballX + area.getSize().getWidth() > racketX &&
  //     ballY < racketY + racketSize.getHeight() &&
  //     ballY + area.getSize().getHeight() > racketY
  //   ) {
  //     return true; // Collision
  //   }

  //   return false; // Pas de collision
  // }

  // bounceOffRacket(racket: Racket): void {
  //   // Calculate the angle of the bounce based on where it hit the racket
  //   const ballY = this.getLocation().getY();
  //   const racketY = racket.getLocation().getY();
  //   const relativeIntersectY = racketY + 10 / 2 - ballY;
  //   const normalizedRelativeIntersectY = relativeIntersectY / 10 / 2;
  //   const bounceAngle = normalizedRelativeIntersectY * (Math.PI / 4); // Adjust this angle as needed

  //   // Calculate new velocity components (X and Y) based on the angle
  //   const speed = this.getVelocity(); // You need to implement getSpeed method in Entity
  //   const newVelocityX = speed.getHeight() * Math.cos(bounceAngle);
  //   const newVelocityY = speed.getWidth() * -Math.sin(bounceAngle);

  //   // Update the velocity
  //   this.setVelocity(newVelocityX, newVelocityY);
  // }

  // isOutOfCanvas(area: Area, width: number): boolean {
  //   // Check if the ball is out of the canvas
  //   const ballX = this.getLocation().getX();
  //   const ballSize = area.getSize().getWidth();

  //   return ballX < 0 || ballX + ballSize > width;
  // }

  // launchRandom(player: Racket): void {
  //   // Launch the ball randomly towards the player (left)
  //   // You can set a random direction and speed
  // }
}

export default Entity;

