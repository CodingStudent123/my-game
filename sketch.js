//physics engine library files
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

//variable declarations
var engine;
var world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;
var mute_btn;

var score = 0;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;

var star_img;
var star, star2;

var blower;

var empty_star, one_star, two_stars;

//loading images, sounds, & animations
function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  
  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  star_img = loadImage("star.png");

  empty_star = loadAnimation("empty.png");
  one_star = loadAnimation("one_star.png");
  two_stars = loadAnimation("stars.png");

  //variable animations
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

//setting the world
function setup() 
{
  //canvas & framerate
  createCanvas(500,700);
  frameRate(80);

  //background song
  bk_song.play();
  bk_song.setVolume(0.5);

  //creating engine & world for the game
  engine = Engine.create();
  world = engine.world;

  //btn 1
  button = createImg('cut_btn.png');
  button.position(180,90);
  button.size(50,50);
  button.mouseClicked(drop);

   //btn 2
   button2 = createImg('cut_btn.png');
   button2.position(390,90);
   button2.size(50,50);
   button2.mouseClicked(drop2);
 
   //creating 2 ropes using a class Rope
   rope = new Rope(7,{x:200,y:90});
   rope2 = new Rope(7,{x:400,y:90});

   //creating a mute button
   mute_btn = createImg('mute.png');
   mute_btn.position(width-50,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
  
  //creating a blower
  blower = createImg('baloon2.png');
  blower.position(260,370);
  blower.size(120,120);
  blower.mouseClicked(airblow);

  //creating ground & frame delays
  ground = new Ground(250,height,width,20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  //creating bunny
  bunny = createSprite(120,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  //creating stars
  star_display = createSprite(50, 20, 30, 30);
  star_display.scale = 0.2;
  star_display.addAnimation("empty", empty_star);
  star_display.addAnimation("one", one_star);
  star_display.addAnimation("two", two_stars);
  star_display.changeAnimation("empty");

  star = createSprite(320, 50, 20, 20);
  star.addImage(star_img);
  star.scale = 0.02;
  star2 = createSprite(50, 370, 20, 20);
  star2.addImage(star_img);
  star2.scale = 0.02;
  
  //creating fruit
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  //creating fruit constraints
  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw()  
{
  //creating background & adding an image to the background
  background(51);
  image(bg_img,0,0,width,height);

  //displaying score
  text("score: " + score, 200, 50);
  text.scale = 0.6;

  push();
  imageMode(CENTER);

  //checking that the fruit is not null
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  //displaying ropes
  rope.show();
  rope2.show();

  //updating the engine & displaying the ground
  Engine.update(engine);
  ground.show();

  //creating & displaying all of the sprites & images
  drawSprites();

  //checking collison between fruit and bunny
  if(collide(fruit,bunny)==true)
  {
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
    score = score + 20;
  }

  //giving condition for missing the fruit
  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;
    score = score - 50;
   }

   //checking collision between fruit and 1st star
   if(collide(fruit, star, 20)==true) {
     star.visible = false;
     star_display.changeAnimation("one");
     score = score + 5;
   }

   //checking collision between fruit and 2nd star
   if(collide(fruit, star2, 20)==true) {
    star2.visible = false;
    star_display.changeAnimation("two");
    score = score + 10;
  }
  
}

//user-defined function to check that the fruit dropped
function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function drop2()
{
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

//user-defined function to detect collison
function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}

//user-defined function for muting the sound
function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}

//user-defined function for blowing air
function airblow() {
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0, y:-0.03});
  air.play();
}