let canvas; 
// let ball_x, ball_y; 
let background_colour = 167
let n = 100
let dt = 1/n 
let r = 10
let nb_ppl = 25
let ball_x = []
let ball_y = []
let vx = []
let vy = []
let isInfected = []
let infected = "red"
let susceptible = "blue"
let recovered = "green"
let vel_bound = 100
let infected_count = 1; 
let susceptible_count = nb_ppl-1; 
let crit_distance = 1;    // the distance to potentially gett infected 




// a function to center the canvas for p5.js
function centerCanvas() {
  let x = (windowWidth - width) / 2; 
  let y = (windowHeight - height) / 2; 
  canvas.position(x,y)
}

function setup() {
  // make the canvas
  canvas = createCanvas(500, 500); 
  // center the canvas
  centerCanvas();  
  // set the background colour
  background(background_colour); 

  // set the parent to be the div simulator-div
  canvas.parent('simulator-div'); 
  
  // now make an array of particles representing individuals
  for (let i = 0; i < Math.sqrt(nb_ppl); i++) {
    for (let j = 0; j < Math.sqrt(nb_ppl); j++) {
      // add the locations
      ball_x.push(100*i + 50); 
      ball_y.push(100*j + 50);  

      // add the velocities
      vx.push(random(-vel_bound, vel_bound)); 
      vy.push(random(-vel_bound, vel_bound));
    }
  }

  for (let i = 0; i < nb_ppl; i++) {
    // start all of them infected except for the first one 
    if (i === 0) {
      let infected_colour = color(255,0,0)
      isInfected.push(infected_colour)
    } else {
      let susceptible_colour = color(0, 0, 225)
      isInfected.push(susceptible_colour)
    }
  }


  // ball_x = width / 2; 
  // ball_y = width / 2; 
  // v_x = 100
  // v_y = 50
}

// a function to automatically re-size to fill the window whenever the window is re-sized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}

function draw() {
  background(167) 
  stroke(50)
  fill(100)

  // draw the balls on the screen
  for (let i = 0; i < nb_ppl; i++) {
    // fill in the colours
    fill(isInfected[i])
    // draw the person
    ellipse(ball_x[i], ball_y[i], r, r)

    // update all of the positions
    ball_x[i] = ball_x[i] + vx[i]*dt; 
    ball_y[i] = ball_y[i] + vy[i]*dt;

    // check if its out of check_if_out_of_bounds
    check_if_out_of_bounds(ball_x[i], ball_y[i], r, vx[i], vy[i], i)
  }

  // ellipse(ball_x, ball_y, r, r)

  // ball_x = ball_x + v_x*dt
  // ball_y = ball_y + v_y*dt 
}

function check_if_out_of_bounds(ball_x, ball_y, r, v_x, v_y, i) {
  if (ball_x + r/2 >= width && v_x >= 0) {            // bounce off of the right side 
    vx[i] *= -1
  } else if (ball_x -r/2 <= 0 && v_x <= 0 ) {        // bounce off of the left side 
    vx[i]*= -1 
  } else if (ball_y -r/2 <= 0 && v_y <= 0) {         // bounce off of the top side 
    vy[i]*= -1
  } else if (ball_y + r/2>= height && v_y >= 0) {    // bounce off of the bottom side 
    vy[i] *= -1
  }
}


let r_0 = 4; 
let prob = r_0/nb_ppl; 
let are_you_sick = bernoulli(prob)

// a function to sample from a bernoulli distribution
function bernoulli(p) { 
  // generate a random number 
  let random = Math.random(0, 1)
  if (random <= p) {
    return false; 
  } else {
    return true; 
  }
}

// a function to infect someone
function infect(i, j, dist) {
  // first compute the distance between them 
  x1 = balls_x[i]
  y1 = balls_y[i]
  x2 = balls_x[j]
  y2 = balls_y[j]
  
  // compute the distance
  dist = dist_in_r2(x1, x2, y1, y2)
  // if the distance is less than the critical distance, sample from the bernoulli and then infect if true
  if (dist < crit_distance) {
    // sample from the bernouli 
  }
}

function dist_in_r2(x1, x2,y1, y2) {
  return Math.sqrt((x1+x2)^2+(y1+y2)^2)
}

// check if one party can infect the other
function can_infect(i, j) {
  // check if ball i can infect ball j. We need one of them to be infected and one to be susceptible. 
  if (isInfected[i] === "red" && isInfected[j] == "green") {
    console.log("can infect")
  }
}