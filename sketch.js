let canvas; 
// let ball_x, ball_y; 
let background_colour = 167
let n = 100
let dt = 1/n 
let r = 10
let nb_ppl = 9; 
let ball_x = []
let ball_y = []
let vx = []
let vy = []
let isInfected = []
let isInfectedColour = []
let vel_bound = 300; 
let infected_count = 1; 
let susceptible_count = nb_ppl-1; 
let crit_distance = 10;    // the distance to potentially gett infected 
let infected_colour; 
let susceptible_colour; 
let countOnPage
let fr = 35; 
let r_0; 
// let r_0 = 4;
let prob = .5
let selectedPopSize
let proximityArray = []


function handleLoad() {
  countOnPage = document.getElementById("totals"); 
  textContent = "Number of infected individuals: " + infected_count; 
  countOnPage.textContent = textContent; 

  // let reset = document.getElementById("reset-button"); 
  // reset.addEventListener('click', resetSimulation()) ; 
}

function resetSimulation() {
  return function () {
    console.log("hello from reset")
    for (let i = 0; i < nb_ppl; i++) {
      if (i != 0) {
        uninfect(i)
      }
    }
    // reset everything back to its default value
    nb_ppl = 20; 
    infected_count = 1; 
  }
}


function changeCount(n) {
  return function () {
    nb_ppl = n
    selectedPopSize.textContent = "Selected population size: " + str(n); 
    // increase the speed if n=49
    if (n==49) {
      vel_bound = 500; 
      fr = 50; 
    }
  }
}


// a function to center the canvas for p5.js
function centerCanvas() {
  let x = (windowWidth - width) / 2; 
  let y = (windowHeight - height) / 2; 
  canvas.position(x,y)
}

function setup() {
  // make the canvas
  canvas = createCanvas(700, 600); 
  // center the canvas
  // centerCanvas();  
  // set the background colour
  background(background_colour); 

  // set the parent to be the div simulator-div
  canvas.parent('simulator-div'); 
  
  // now make an array of particles representing individuals
  for (let i = 0; i < nb_ppl; i++) {
    x_coord = random(0, width)
    y_coord = random(0, height)
    ball_x.push(x_coord); 
    ball_y.push(y_coord); 
    vx.push(random(-vel_bound, vel_bound)); 
    vy.push(random(-vel_bound, vel_bound));
  }

  // for (let i = 0; i < Math.sqrt(nb_ppl); i++) {
  //   for (let j = 0; j < Math.sqrt(nb_ppl); j++) {
  //     // add the locations

  //     // automatic spacing
  //     let grid_size = width/Math.sqrt(nb_ppl)
  //     ball_x.push(grid_size*i + 50); 
  //     ball_y.push(grid_size*j + 50);  

  //     // add the velocities
  //     vx.push(random(-vel_bound, vel_bound)); 
  //     vy.push(random(-vel_bound, vel_bound));
  //   }
  // }

  for (let i = 0; i < nb_ppl; i++) {
    // start all of them infected except for the first one 
    if (i === 0) {
      infected_colour = color(255,0,0)
      isInfectedColour.push(infected_colour) // change the colour
      isInfected.push("infected")    // keep track of which indices are infected 
    } else {
      susceptible_colour = color(0, 0, 225)
      isInfectedColour.push(susceptible_colour)
      isInfected.push("susceptible")
    }
  }
  frameRate(fr)
  let slider = document.getElementById("myRange"); 
  let output = document.getElementById("value")
  output.innerHTML = (slider.value)/100; //display the default value
  // give the default value to prob 
  prob = (slider.value)/100; 
  slider.oninput = function () {
    // update prob
    prob = (this.value)/100; 
    output.innerHTML = (this.value)/100; 
  }

  let popSlider = document.getElementById("popRange"); 
  let popOutput = document.getElementById("popValue"); 
  
  popOutput.innerHTML = popSlider.value
  nb_ppl = popSlider.value 
  popSlider.oninput = function () {
    nb_ppl = popSlider.value 
    popOutput.innerHTML = popSlider.value  
    setup() 
  }

  // <input type="range" min="0" max="40" value="20", id="popRange"></p>Selected population size: <span id="popvalue"></span>
}

function draw() {
  background(167) 
  stroke(50)
  fill(100)
  drawBalls(nb_ppl)
}

function drawBalls(nb_ppl) {
  for (let i = 0; i < nb_ppl; i++) {
    // fill in the colours
    fill(isInfectedColour[i])
    // draw the person
    ellipse(ball_x[i], ball_y[i], r, r)

    // DEBUGGING THINGS

    // draw a larger circle outside with radius = crit_distance
    // noFill()
    // ellipse(ball_x[i], ball_y[i], r+crit_distance)
    // let ballNno = i  
    // text(ballNno, ball_x[i], ball_y[i])

    // update all of the positions
    ball_x[i] = ball_x[i] + vx[i]*dt; 
    ball_y[i] = ball_y[i] + vy[i]*dt;

    // check if its out of check_if_out_of_bounds
    check_if_out_of_bounds(ball_x[i], ball_y[i], r, vx[i], vy[i], i)

    main()  
    }
  }

function main() {

  for (let i = 0; i < nb_ppl; i++) {
    for (let j = 0; j < nb_ppl; j++ ) {
      // sample from a bernoulli distribution
      if (i != j) {
        willInfect(i, j, dist(ball_x[i], ball_y[i], ball_x[j], ball_y[j]))
      }
    } 
  }
  // infectProcedure(proximityArray)
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


// a function to sample from a bernoulli distribution
function bernoulli(p) { 
  // generate a random number 
  let random = Math.random(0, 1)
  if (random <= p) {
    // console.log('bernoulli false')
    return false; 
  } else {
    // console.log('bernoulli true')
    return true; 
  }
}

// a function to infect someone
function willInfect(i, j, dist) {
  // check if (1) they can infect e/o and (2) if they are within the critical distance
  if ( (i != j) && (dist < (crit_distance + r/2))) {
    // let str = "CD"
    // text(str, ball_x[i], ball_y[i])
    if ((can_infect(i,j) == true)) {
      // check if the euclidean distance is greater 
      // let eucDist = eucDist(ball_x[i], ball_y[i], ball_x[j], ball_y[j]); 
      const upper_limit = crit_distance + r/2 + 0.5; 
      const lower_limit = crit_distance + r/2 - 0.5; 
      let isInInterval = (dist > lower_limit && dist < upper_limit)
      if (isInInterval) {
        if (bernoulli(prob)) {
          infect_other(i,j)  
          console.log("bernoulli hi")        
        } else {
          console.log("berloosli")
        }
      }
    }
  }
}



function infectProcedure(proximityArray) {
  let newArray = []
  if (proximityArray == [[0,0]]) {
    return
  }
  console.log(proximityArray)
  for (let i = 1; i < proximityArray.length; i++) {
    indexZero = proximityArray[1][0]
    indexOne = proximityArray[1][1]
    eucDist = dist(ball_x[indexZero], ball_y[indexZero], ball_x[indexOne], ball_y[indexOne])
    if (eucDist > (crit_distance + r/2)) {
      if (bernoulli(prob)) {
        console.log('berwinlli')
        infect_other(indexZero,indexOne)
      } else {
        console.log('berloselli')
      } 
    } else {
      newArray.push(proximityArray[i])
    }
  }
  proximityArray = newArray
}


// check if one party can infect the other
function can_infect(i, j) {
  // check if ball i can infect ball j. We need one of them to be infected and one to be susceptible. 
  let condition = isInfected[i] === "infected" && isInfected[j] === "susceptible"; 
  if (condition) {
    // console.log("hello")
    return true; 
  } else {
    return false; 
  }
}

// a function to infect 
function infect_other(i,j) {
  // change the colour of both of them to infected colour
  // console.log(`Got infected! ${i}, ${j}`)
  infected_count++; 
  susceptible_count--; 
  infected_colour = color(255,0,0)
  isInfectedColour[i] = infected_colour
  isInfectedColour[j] = infected_colour
  isInfected[i] = "infected"
  isInfected[j] = "infected"


  // update the drawing
  fill(infected_colour)
  // draw the person
  ellipse(ball_x[i], ball_y[i], r, r)

  // update the count:
  textContent = "Number of infected individuals: " + infected_count; 
  countOnPage.textContent = textContent;   
}

// a function to uninfect a blob at index i
function uninfect(i) {
  isInfected[i] = "susceptible"
  isInfectedColour[i] = susceptible_colour
}

// a function for resetting all blobs
window.addEventListener('load', handleLoad)