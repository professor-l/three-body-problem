let c = new BodyCollection();
c.addBody(-8, 3);
c.addBody(11, -14);
c.addBody(-32, 19);

let b = c.bodies;

let a = new Animator(c, "draw");