let game; // initializing the game variable

// Let's make game options to define gravities and velocities of the elements.
const gameOptions = {
    sealGravity: 30,
    sealSpeed: 350,
    fishSpeed: 400,
    gameSpeed: 200,
    groundDelay: 4000,
    currentScore: 0,  // variable for the score that updates every time the PlayGame scene starts
    highScore: 0, // variable for the best score that only opdates if the player gets better score
    norppasMovementCheck: 0, // variable that helps control the game with touch screen
    hatCatched: false, // variable to tell whether the hat is catched
    firstTimePlaying: true // for the instruction text
}

// Let's load the Phaser
window.onload = function() {

    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#4682B4",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 1000,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: [StartGame,PlayGame,GameOver]
    }

    game = new Phaser.Game(gameConfig)
    window.focus();
}
    
// The main manu scene
class StartGame extends Phaser.Scene {

    // Let's make a constructer
    constructor() {
        super("StartGame")
    }

    // Let's load the sources
    preload() {
        this.load.image("norppa","assets/norppa-Photoroom.png")
        this.load.image("saimaa","assets/saimaaMap.png")
        this.load.image("fish","assets/kala.png")
        this.load.image("wwf","assets/wwf.png")
    }

    // Let's create the elements
    create() {

        // Let's change the backround color for this scene to ligth grey.
        this.cameras.main.setBackgroundColor('d3d3d3')

        // Let's first create the title "Norppis" on the top of the screen and a picture of Saimaa to the backround
        this.saimaa = this.physics.add.sprite(250,65,"saimaa").setInteractive()
        this.saimaa.setAngle(-50)
        this.saimaa.setScale(1.5)

        this.title = this.add.text(game.config.width/2-300,30,"NORPPIS",{
            fontSize: "130px",
            fill: "#000000",
            fontFamily: "Roboto"})


        // Let's make a button to start the game.
        this.startGameButton = this.add.graphics();
        this.startGameButton.fillStyle(0x000000, 1); 
        this.startGameButton.lineStyle(10,0x000000,1);
        this.startGameButton.strokeRect(80, 700,300, 200);
        this.startGameButton.setInteractive(new Phaser.Geom.Rectangle(80, 700,300, 200), Phaser.Geom.Rectangle.Contains)
    
        this.startGameText = this.add.text(120,700,"Start Game",{
            fontSize: "80px",
            fill: "#000000",
            fontFamily: "Roboto"})
        this.startGameText.setWordWrapWidth(200);

        this.startGameButton.on("pointerdown",() => {
            gameOptions.currentScore = 0
            this.scene.start("PlayGame"); // Starting the game
        })


        // Let's make a button where you can go direclty to read about Saimaa ringed seal
        this.linkButton = this.add.graphics();
        this.linkButton.fillStyle(0x000000, 1); 
        this.linkButton.lineStyle(10,0x000000,1);
        this.linkButton.strokeRect(game.config.width-380, 700,300, 200);
        this.linkButton.setInteractive(new Phaser.Geom.Rectangle(game.config.width-380, 700,300, 200), Phaser.Geom.Rectangle.Contains)
    
        this.linkButton.on("pointerdown",() => {
            window.open('https://wwf.fi/en/saimaa-ringed-seal/');
        })

        this.linkText = this.add.text(430,735,"Read about Saimaannorppa",{
            fontSize: "40px",
            fill: "#000000",
            fontFamily: "Roboto"})
        this.linkText.setWordWrapWidth(200);

        this.wwfLogo = this.physics.add.image(600,770,"wwf")
        this.wwfLogo.setScale(0.2)


        // Let's make a Norppa to swim over the saimaa map for every 4 seconds
        this.norppaGroup = this.physics.add.group()

        this.norppaGroup.create(0,400,"norppa")
        this.norppaGroup.children.iterate( function(norppa) {
            norppa.setScale(0.2)
            norppa.setDepth(0)
            norppa.setAngle(-35)
            norppa.body.velocity.x = gameOptions.sealSpeed
            norppa.body.velocity.y = -gameOptions.sealSpeed
        })

        this.norppaLoop = this.time.addEvent({
            callback: this.moveNorppa,
            callbackScope: this,
            delay: 4000,
            loop: true
        })


         // Let's make instructions to the beginning of the game if it is the players first time playing.
         if (gameOptions.firstTimePlaying == true) {
            gameOptions.firstTimePlaying = false
            let instruction1 = "Watch out for fishing nets and rocks while eating fish!\n\n"
            let instruction2 = "Swim upwards = Press the upper half of the screen or the up arrow\n\nSwim downwards = Press the lower half of the screen or the down arrow"
            let instructions = instruction1+instruction2
            this.instructionText = this.add.text(200,250,instructions,{
                fontSize: "35px",
                fill: "#000000",
                fontFamily: "Roboto"})
            this.instructionText.setWordWrapWidth(550);
        } else {
            // If the player has already played let's show the current highscore.
            let scoreText = "Your Highscore: "+gameOptions.highScore
            this.scoreText = this.add.text(320,300,scoreText,{
                fontSize: "80px",
                fill: "#000000",
                fontFamily: "Roboto"})
            this.scoreText.setWordWrapWidth(300);
            this.fish = this.physics.add.image(540,530,"fish")
            this.fish.setScale(0.4)
        }
    }

 

    // function to make a new norppa to swim over the saimaa map
    moveNorppa() {
        this.norppaGroup.create(-50,400,"norppa")
        this.norppaGroup.children.iterate( function(norppa) {
            norppa.setScale(0.2)
            norppa.setAngle(-35)
            norppa.setDepth(0)
            norppa.body.velocity.x = gameOptions.sealSpeed
            norppa.body.velocity.y = -gameOptions.sealSpeed
        })
        
    }

    // There's nothing to upload in this scene

}   

// The scene where the game is played
class PlayGame extends Phaser.Scene {

    // Let's make a constructor
    constructor() {
        super("PlayGame")
    }

    // Let's load the needed data
    preload() {
        this.load.image("norppa","assets/norppa-Photoroom.png")
        this.load.image("kala","assets/kala-Photoroom.png")
        this.load.image("scoreFish","assets/kala.png")
        this.load.image("puble","assets/p.png")
        this.load.image("ground","assets/ground.jpg")
        this.load.image("verkko","assets/verkko.png")
        this.load.audio("norppaSound","assets/norppaSound.m4a")
        this.load.audio("norppaEats","assets/norppaEats.m4a")
        this.load.image("rock","assets/kivi.png")
        this.load.image("plant","assets/kasvi.png")
        this.load.image("teekkariHat","assets/lakki.png")
        this.load.audio("viiksekaita","assets/viiksekaitaSong.mp3")
    }

    // Let's create the elements
    create() {

        // Making of the cursor
        this.cursors = this.input.keyboard.createCursorKeys()


        // Making of the sounds
        this.viiksekaitaSong = this.sound.add("viiksekaita")
        this.viiksekaitaSong.play({loop: true})
        this.norppaSound = this.sound.add("norppaSound")
        this.norppaEats = this.sound.add("norppaEats")


        // Making of the norppa
        this.norppa = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "norppa")
        this.norppa.setDepth(2)
        this.norppa.setScale(0.2)
        this.norppa.body.gravity.y = gameOptions.sealGravity

        this.norppaSensor = this.physics.add.sprite(this.norppa.x+110, this.norppa.y+20, 'sensor');
        this.norppaSensor.setDepth(2)
        this.norppaSensor.setScale(0.8)
        this.norppaSensor.setVisible(false)
        this.norppaSensor.body.gravity.y = gameOptions.sealGravity

    
        // Making of the borders
        this.borderUp = this.physics.add.sprite(game.config.width/2,-397,"sensor")
        this.borderUp.setScale(25)
        this.borderUp.setVisible(false);
        this.borderUp.setImmovable(true)
        this.physics.add.collider(this.norppa,this.borderUp)

        this.borderDown = this.physics.add.sprite(game.config.width-400, game.config.height+311, "sensor")
        this.borderDown.setScale(25)
        this.borderDown.setImmovable(true)
        this.borderDown.setVisible(false)
        this.physics.add.collider(this.norppa,this.borderDown)


        // Making of the fishes
        this.fishGroup = this.physics.add.group()
        this.fishGroup.setDepth(0);
        for(let i = 0; i < 3; i++) {
            this.fishGroup.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height-200), "kala");
        }
        this.fishGroup.children.iterate(function (fish) {
            fish.setScale(0.1); 
            fish.body.velocity.x = -gameOptions.fishSpeed
        });
        this.fishLoop = this.time.addEvent({
            callback: this.addFish,
            callbackScope: this,
            delay: 3000,
            loop: true
        })
        this.physics.add.overlap(this.norppaSensor, this.fishGroup,this.colladeFishNorppa,null,this);


        // Making of the ground
        this.groundGroup = this.physics.add.group()
        this.groundGroup.setDepth(0)
        let spaceground = 0
        while(spaceground <= 1700) {
            this.groundGroup.create(spaceground, game.config.height, "ground")
            spaceground = spaceground + 200
        }
        this.groundGroup.children.iterate(function (ground) {
            ground.setScale(2); 
            ground.body.velocity.x = -gameOptions.gameSpeed
        })
        this.groudLoop = this.time.addEvent({
            callback: this.addGround,
            callbackScope: this,
            delay: gameOptions.groundDelay,
            loop: true
        })


        // Making of the publes
        this.publeGroup = this.physics.add.group()
        this.publeGroup.setDepth(2)
        this.publeLoop = this.time.addEvent({
            callback: this.addPuble,
            callbackScope: this,
            delay: 1/gameOptions.gameSpeed*100,
            loop: true
        })


        // Making of nets
        this.netGroup = this.physics.add.group()
        this.netSensorGroup = this.physics.add.group()
        this.netLoop = this.time.addEvent({
            callback: this.addNet,
            callbackScope: this,
            delay: Phaser.Math.Between(4000,16000),
            loop: true
        })
        this.netGroup.create(game.config.width+500, -5, "verkko")
        this.netGroup.children.iterate(function (net) {
            net.setScale(0.8)
            net.setDepth(3)
            net.body.velocity.x = -gameOptions.gameSpeed
            net.body.velocity.y = 20
        })
        this.netSensorGroup.create(game.config.width+460, 5,"sensor") 
        this.netSensorGroup.children.iterate(function (sensor) {
            sensor.setScale(12)
            sensor.setDepth(0)
            sensor.setAngle(45)
            sensor.body.velocity.x = -gameOptions.gameSpeed
            sensor.body.velocity.y = 20
            sensor.setVisible(false)
        })
        this.physics.add.collider(this.norppa,this.netSensorGroup,this.norppaStuck,null,this)
        this.physics.add.overlap(this.fishGroup,this.netSensorGroup,this.fishStuck,null,this)


        // Making of rocks
        this.rockGroup = this.physics.add.group()
        this.rockSensorGroup = this.physics.add.group()
        this.rockLoop = this.time.addEvent({
            callback: this.addRock,
            callbackScope: this,
            delay: gameOptions.relationNumber*Phaser.Math.Between(6000,12000),
            loop: true
        })
        this.physics.add.collider(this.norppa,this.rockSensorGroup,this.norppaStuck,null,this)


        // Making of plants
        this.plantGroup = this.physics.add.group()
        this.plantGroup.create(1200,900,"plant")
        this.plantGroup.children.iterate( function(plant) {
            plant.setScale(0.3)
            plant.body.velocity.x = -gameOptions.gameSpeed
        })
        this.plantLoop = this.time.addEvent({
            callback: this.addPlant,
            callbackScope: this,
            delay: Phaser.Math.Between(3000,12000),
            loop: true
        })


        // Making of the Teekkari hats
        this.teekkariHattuGroup = this.physics.add.group()
        this.teekkariHattuSensorGroup = this.physics.add.group()
        this.hatLoop = this.time.addEvent({
            callback: this.addHat,
            callbackScope: this,
            delay: Phaser.Math.Between(3000,12000),
            loop: true
        })
        this.physics.add.overlap(this.norppaSensor,this.teekkariHattuSensorGroup,this.getHat,null,this)
        this.norppasHat = this.physics.add.sprite(this.norppa.x+60,this.norppa.y,"teekkariHat")
        this.norppasHat.setVisible(false)
        this.norppasHat.setScale(0.2)
        this.norppasHat.setDepth(3)


        // Making of the scoreboard
        this.scoreBoard = this.add.graphics();
        this.scoreBoard.fillStyle(0xd3d3d3, 1); 
        this.scoreBoard.lineStyle(10,0xd3d3d3,1);
        this.scoreBoard.fillRect(0, 0,200, 100);
        this.scoreBoard.setDepth(4)
        this.scoreFish = this.physics.add.image(120,40,"scoreFish")
        this.scoreFish.setScale(0.3)
        this.scoreFish.setDepth(4)
        this.scoreText = this.add.text(20,20,0,{
            fontSize: "40px",
            fill: "#000000",
            fontFamily: "Roboto"})
        this.scoreText.setWordWrapWidth(200);
        this.scoreText.setDepth(5)


        // Let's change the delays for every 8 seconds
        this.delayLoop = this.time.addEvent({
            callback: this.changeDelays,
            callbackScope: this,
            delay: 8000,
            loop: true
        })

        // Let's erase data that is not visible anymore for every 10 seconds
        this.eraseLoop = this.time.addEvent({
            callback: this.eraseStuff,
            callbackScope: this,
            delay: 10000,
            loop: true
        })


        // Let's make the touch screen control 
        this.input.on("pointerdown",this.pressScreen,this)
        this.input.on("pointerup",this.releaseScreen,this)


}

    // Function to control what happens when you press the screen
    pressScreen(pointer) {
        // If you press the upper half of the screen the norppa goes upp
        if (pointer.y < game.config.height/2) {
            gameOptions.norppasMovementCheck = 1

        }
        // If you press the other hald of the screen the norppa goes down
        else if (pointer.y > game.config.height/2) {
            gameOptions.norppasMovementCheck = -1
        }
        // The gameOptions.norppasMovementCheck variable sends the ifnromation about norppas movement to the upload function
    }

    // Function to change the gameOptions.norppasMovementCheck varable to value 0 to change the norppas movement back to normal (default)
    releaseScreen() {
        gameOptions.norppasMovementCheck = 0
    }

    // Function to destroy elements that are no longer visible
    eraseStuff() {
        this.netGroup.children.each(function (net) {
            if (net.x < -1000) {
                net.destroy();
            }
           
        },this)
        this.netSensorGroup.children.each(function (sensor) {
            if (sensor.x < -1000) {
                sensor.destroy();
            }
           
        },this)

        this.rockGroup.children.each(function (rock) {
            if (rock.x < -1000) {
                rock.destroy();
            }
           
        },this)

        this.rockSensorGroup.children.each(function (sensor) {
            if (sensor.x < -1000) {
                sensor.destroy();
            }
           
        },this)


        this.fishGroup.children.each(function (fish) {
            if (fish.x < -1000) {
                fish.destroy();
            }
           
        },this)

        this.plantGroup.children.each(function (plant) {
            if (plant.x < -1000) {
                plant.destroy();
            }
           
        },this)

        this.groundGroup.children.each(function (ground) {
            if (ground.x < -1000) {
                ground.destroy();
            }
           
        },this)


        this.teekkariHattuGroup.children.each(function (hat) {
            if (hat.x < -1000) {
                hat.destroy();
            }
           
        },this)

        this.teekkariHattuSensorGroup.children.each(function (sensor) {
            if (sensor.x < -1000) {
                sensor.destroy();
            }
           
        },this)
    }

    // Fucntion to change delays of nets, rocks, hats and plants
    changeDelays() {
        this.netLoop.delay = Phaser.Math.Between(3000,16000)
        this.rockLoop.delay = Phaser.Math.Between(4000,16000)
        this.hatLoop.delay = Phaser.Math.Between(8000,12000)
        this.plantLoop.delay = Phaser.Math.Between(3000,12000)
    }

    // Function to make the norppa take the hat and to stop the hats from dropping with the help of the variable gameOptions.hatCatched 
    getHat() {
        this.teekkariHattuGroup.children.iterate(function(hat) {
            hat.disableBody(true,true)
        })
        this.teekkariHattuSensorGroup.children.iterate(function(sensor) {
            sensor.disableBody(true,true)
        })
        gameOptions.hatCatched = true
    }

    // Function to make a new teekkari hat
    addHat() {
        if (gameOptions.hatCatched == false) {
            this.teekkariHattuGroup.create(1000,0,"teekkariHat")
            this.teekkariHattuGroup.children.iterate(function(hat) {
                hat.body.gravity.y = 2*gameOptions.sealGravity
                hat.setScale(0.2)
                hat.body.velocity.x = -gameOptions.gameSpeed
            })
            this.teekkariHattuSensorGroup.create(1000,0,"sensor")
            this.teekkariHattuSensorGroup.children.iterate(function(sensor) {
                sensor.body.gravity.y = 2*gameOptions.sealGravity
                sensor.setScale(1.5)
                sensor.setVisible(false)
                sensor.body.velocity.x = -gameOptions.gameSpeed
            })  
        }

    }

    // Fucntion to make a new plant
    addPlant() {
        this.plantGroup.create(1200,900,"plant")
        this.plantGroup.children.iterate( function(plant) {
            plant.setScale(0.3)
            plant.body.velocity.x = -gameOptions.gameSpeed
        })
    }

    // Function to make a new net
    addNet() {
        this.netGroup.create(game.config.width+500, -5, "verkko")
        this.netGroup.children.iterate(function (net) {
            net.setScale(0.8)
            net.setDepth(3)
            net.body.velocity.x = -gameOptions.gameSpeed
            net.body.velocity.y = 20
        })


        this.netSensorGroup.create(game.config.width+460, 5,"sensor") 
        this.netSensorGroup.children.iterate(function (sensor) {
            sensor.setScale(12)
            sensor.setDepth(0)
            sensor.setAngle(45)
            sensor.body.velocity.x = -gameOptions.gameSpeed
            sensor.body.velocity.y = 20
            sensor.setVisible(false)
        })

    }

    // Function to make a new rock
    addRock() {
        this.rockGroup.create(1100,800,"rock")
        this.rockGroup.children.iterate( function(rock) {
            rock.setScale(0.6)
            rock.body.velocity.x = -gameOptions.gameSpeed
        })

        this.rockSensorGroup.create(1065,830,"sensor")
        this.rockSensorGroup.children.iterate( function(sensor) {
            sensor.body.velocity.x = -gameOptions.gameSpeed
            sensor.setScale(7)
            sensor.setVisible(false)
        })
    }

    // Function that runs when the norppa run into a rock or net.  
    norppaStuck() {
        this.norppaSound.play() // Play the sound norppa makes
        gameOptions.hatCatched = false // hat is no longer catched
        this.viiksekaitaSong.stop() // Stop the song
        this.scene.start("GameOver") // Go to the scene GameOVer
    }

    // Function to make fishes stuck to the nets
    fishStuck(fish) {
        fish.body.velocity.x = -gameOptions.gameSpeed
        fish.setAngle(65)
    }


    // Function to add a groud
    addGround() {
        this.groundGroup.create(game.config.width+700, game.config.height, "ground")
        this.groundGroup.children.iterate(function (ground) {
            ground.setScale(2); 
            ground.body.velocity.x = -gameOptions.gameSpeed
        });
    }

    // Function to implement the norppa eating a fish
    colladeFishNorppa(norppaSensor,fish) {
        gameOptions.currentScore++ 
        this.norppaEats.play()
        fish.disableBody(true,true)
        this.scoreText.setText(gameOptions.currentScore)
    }

    // fucntion to add a fish
    addFish() {
        this.fishGroup.create(game.config.width+40, Phaser.Math.Between(30, game.config.height-150), "kala");
        this.fishGroup.create(game.config.width+120, Phaser.Math.Between(30, game.config.height-150), "kala");
        this.fishGroup.create(game.config.width+220, Phaser.Math.Between(30, game.config.height-150), "kala");
        this.fishGroup.children.iterate(function (fish) {
            fish.setScale(0.1); 
            fish.body.velocity.x = -gameOptions.fishSpeed
        });
    }

    // funtion to add a puble
    addPuble() {
            this.publeGroup.create(this.norppa.x-80, Phaser.Math.Between(this.norppa.y+3, this.norppa.y-3),"puble")
            this.publeGroup.children.iterate(function (puble) {
            puble.setScale(0.005); 
            puble.body.velocity.x = -gameOptions.gameSpeed
        });
    }
        
    // the updates
    update() {

        // Let's check that the depths of the elements are right
        this.groundGroup.setDepth(0)
        this.rockGroup.setDepth(2)
        this.rockSensorGroup.setDepth(4)
        this.plantGroup.setDepth(1)

        // Let's keep the norppaSensor with the norppa
        this.norppaSensor.y = this.norppa.y +20

        // If the norppa has catched the hat let's also keep it with the norppa
        if (gameOptions.hatCatched == true) {
            this.norppasHat.setVisible(true)
            this.norppasHat.y = this.norppa.y-35

        }

        // Let's stop the nets in y-direction when they are half way pass the screen
        this.netGroup.children.iterate(function (net) {
            if ( net.x  < game.config.width/2) {
                net.body.velocity.y = 0
            }
        }
        )
        this.netSensorGroup.children.iterate(function (sensor) {
            if ( sensor.x  < game.config.width/2) {
                sensor.body.velocity.y = 0
            }
        }
        )

        // Let's make the implementation of norppa swimming up
        if (this.cursors.up.isDown || gameOptions.norppasMovementCheck == 1) {
            this.norppa.body.velocity.y =  -gameOptions.sealSpeed
            this.norppaSensor.body.velocity.y = -gameOptions.sealSpeed
            this.norppa.setAngle(-30)
            this.norppaSensor.setAngle(-30)
            this.norppaSensor.y = this.norppa.y-30
            this.norppaSensor.x = this.norppa.x+100
            this.publeGroup.children.iterate(function (puble) {
                puble.setAngle(-30)
            });

            if (gameOptions.hatCatched == true) {
                this.norppasHat.y = this.norppasHat.y -40
            }


        // Let's make the implementation of norppa swimming down  
        } else if (this.cursors.down.isDown || gameOptions.norppasMovementCheck == -1) {
            this.norppa.body.velocity.y =  gameOptions.sealSpeed
            this.norppaSensor.body.velocity.y = gameOptions.sealSpeed
            this.norppa.setAngle(30)
            this.norppaSensor.setAngle(30)
            this.norppaSensor.y = this.norppa.y+70
            this.norppaSensor.x = this.norppa.x+90
            this.publeGroup.children.iterate(function (puble) {
                puble.setAngle(30)
            });

            if (gameOptions.hatCatched == true) {
                this.norppasHat.y = this.norppasHat.y +40
            }

        // If the norppa isn't swimming up or down let's return the qualities that were canged
        }  else {
            this.norppa.setAngle(0)
            this.norppaSensor.setAngle(0)
            this.norppaSensor.x = this.norppa.x+110
            this.publeGroup.children.iterate(function (puble) {
                puble.setAngle(0)
            });  
        }
    }
} 

// Scene that runs when the game is over.
class GameOver extends Phaser.Scene {

    // Let¨s make a constructor
    constructor() {
        super("GameOver")
    }


    // Let's make an array of facts about saimaa seal. 
    facts = [
        "Did you know that you can meet Saimaannorppa only in Saimaa?",
        "Did you know that fishing nets are major threat to Saimaannorppas?",
        "Did you know that the global warming poses a threat to Saimaannorppas?",
        "Did you know that there are approximately 480 Saimaannorppas in Saimaa? ",
        "Did you know that Norppalive is starred by the norppas Pullervo and Mona?",
        "Did you know that WWF gives a diploma to everyone who voluntarily abandons net fishing on Lake Saimaa.",
        "Did you know that Saimaannorppa's favorite food is small fish? ",
        "Did you know that Saimaannorppas spend 80% of their time under water?",
        "Did you know that Saimaannorppa's Latin name is Pusa hispida saimensis?",
        "Did you know that the Saimaannorppas are 130-145 cm long on average?",
        "Did you know that Saimaannorppa's dive can last up to 25 minutes?",
        "Did you know that the largest Saimaannorppa is named Viljo?",
        "Did you know that the Saimaanorppa became isolated in Saimaa 8,000 years ago?",
        "Did you know that in 2023, every fifth out of the 100 saimaannorppa's pups were born in human-made banks?"]


    // Let's load the resources needed.
    preload() {
        this.load.image("musicNorppa","assets/musicNorppa.png")
        this.load.image("fish","assets/kala.png")
    }

    // Let's create the scene.
    create() {

        // Let's update the highscore if needed.
        if (gameOptions.currentScore > gameOptions.highScore) {
            gameOptions.highScore = gameOptions.currentScore
        }


        // Let's make a game over text.
        this.GameOverText = this.add.text(100,25,"Game Over!",{
            fontSize: "120px",
            fill: "#000000",
            fontFamily: "Roboto"})


        // Let's add a picture of norppa listening music
        this.musicNorppa = this.physics.add.sprite(620,450,"musicNorppa")
        this.musicNorppa.setScale(0.6)


        // Let's male a circle for the fact
        this.factCircle = this.add.graphics();
        this.factCircle.fillStyle(0xd3d3d3,1);
        this.factCircle.fillCircleShape(new Phaser.Geom.Circle(265, 480, 175))

        // Let's make the fact text
        let index = Phaser.Math.Between(0,this.facts.length-1) // choosing the index of the fact randomly
        let factText = this.facts[index]

        this.factText = this.add.text(130,385,factText, {
            fontSize: "30px",
            fill: "#000000",
            fontFamily: "Roboto"
        }
        )
        this.factText.setWordWrapWidth(300)


        // Let's make a button to play again
        this.startGameButton = this.add.graphics();
        this.startGameButton.fillStyle(0xd3d3d3, 1); 
        this.startGameButton.lineStyle(10,0x000000,1);
        this.startGameButton.fillRect(80, 700,300, 200);
        this.startGameButton.strokeRect(80, 700,300, 200);
        this.startGameButton.setInteractive(new Phaser.Geom.Rectangle(80, 700,300, 200), Phaser.Geom.Rectangle.Contains)
        this.startGameText = this.add.text(120,700,"Play again",{
            fontSize: "80px",
            fill: "#000000",
            fontFamily: "Roboto"})
        this.startGameText.setWordWrapWidth(200);
        this.startGameButton.on("pointerdown",() => {
            gameOptions.currentScore  = 0
            this.scene.start("PlayGame");
        })


        // Let's make a button to return to the main manu scene
        this.mainMenuButton = this.add.graphics();
        this.mainMenuButton.fillStyle(0xd3d3d3, 1); 
        this.mainMenuButton.lineStyle(10,0x000000,1);
        this.mainMenuButton.fillRect(game.config.width-380, 700,300, 200);
        this.mainMenuButton.strokeRect(game.config.width-380, 700,300, 200);
        this.mainMenuButton.setInteractive(new Phaser.Geom.Rectangle(game.config.width-380, 700,300, 200), Phaser.Geom.Rectangle.Contains)
        this.mainMenuText = this.add.text(game.config.width-350,700,"Main Menu",{
            fontSize: "80px",
            fill: "#000000",
            fontFamily: "Roboto"})
        this.mainMenuText.setWordWrapWidth(200);
        this.mainMenuButton.on("pointerdown",() => {
            this.scene.start("StartGame");
        })

        // Let's make show the latest score
        let scoreText = "Your score: "+gameOptions.currentScore
        this.scoreText = this.add.text(80,200,scoreText,{
            fontSize: "45px",
            fill: "#000000",
            fontFamily: "Roboto"})
        this.scoreText.setWordWrapWidth(300);
        this.fish = this.physics.add.image(450,220,"fish")
        this.fish.setScale(0.3)

}


    upload() {

    }


}


    