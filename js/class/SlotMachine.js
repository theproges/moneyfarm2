function SlotMachine(){
    var reels = [];
    var reelsCount = 5;
    var stopReelTimeout = 300;
    var container = phaserGame.add.group();
    var background = phaserGame.add.image(0, 0, 'background');
    var reelFrame = phaserGame.add.image(100, 100, 'reelFrame');
    var reelStrips = [
        [1,4,3,2,6,4,4,1,2,3,4,10,10,10,12,3,4,2,11],
        [12,11,3,4,8,2,3,4,1,12,7,8,9,3,5,6,3,5,11,10],
        [1,3,3,5,6,4,4,1,2,3,4,12,8,10,11,3,5,2,11],
        [12,11,3,4,8,2,3,4,2,2,7,8,2,3,5,6,3,5,1,2],
        [1,7,3,2,6,7,4,12,2,7,4,12,10]
    ];
    var spiningTime = 1000;
    var isRuning = false;
    var pointsStep = 1;
    var pointsTime = 500;
    var isCountPoints = false;
    var pointsValue = 0;

    background.width = config.canvasWidth; 
    background.height = config.canvasHeight;
    container.add(background);  

    for (var i = 0; i < reelsCount; i++){
        var reelBack = phaserGame.add.image(137*(i + 1), 130, 'reelBack');

        reelBack.width = 137;
        reelBack.height = 380;
        container.add(reelBack);
    }

    reelFrame.width = config.canvasWidth - 200;
    reelFrame.height = config.canvasHeight - 200;
    container.add(reelFrame);

    var sideBandLeft = phaserGame.add.image(90, 125, 'sideband');
    var sideBandRight = phaserGame.add.image(830, 125, 'sideband');

    sideBandLeft.width = sideBandRight.width = 40;
    sideBandLeft.height = sideBandRight.height = 400;
    container.add(sideBandLeft);
    container.add(sideBandRight);

    var logo = phaserGame.add.image(100, 45, 'logo');

    logo.width = 200;
    logo.height = 100;
    container.add(logo);

    var box = phaserGame.add.image(670, 65, 'box');

    box.width = 170;
    box.height = 70;
    container.add(box);

    var pointsText = phaserGame.add.text(720, 55, pointsValue.toFixed(2), {
        font: "normal 30px Impact",
        stroke: "black",
        strokeThickness: 2,
        boundsAlignH: "right",
        boundsAlignV: "middle"
    });
    pointsText.setTextBounds(0, 0, 100, 100);
    var pointsTextGrd = pointsText.context.createLinearGradient(0, 0, 0, pointsText.height);
    pointsTextGrd.addColorStop(0, '#FEEB92');   
    pointsTextGrd.addColorStop(1, '#CC7E33');
    pointsText.fill = pointsTextGrd;


    for (var i = 0; i < reelsCount; i++){
        reels.push(new Reel(i));
        reels[i].setStrip(reelStrips[i]);
        container.add(reels[i].container);
        reels[i].container.x = 130 * (i + 1)+(i*4)+83;
        reels[i].container.y = 40;
        reels[i].setOffset(0);
    }

    var spinBtn = phaserGame.add.sprite(480,580, 'spinBtn');
    var spinBtnText = phaserGame.add.text(445, 569, "SPIN", {
        font: "normal 26px Arial Black",
        stroke: "#333",
        strokeThickness: 4,
        fill: "#EEE670",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    });

    spinBtn.inputEnabled = true;
    spinBtn.anchor.x = 0.5;
    spinBtn.anchor.y = 0.5;
    spinBtn.width = 130;
    spinBtn.height = 80;
    spinBtn.events.onInputDown.add(function(){
        spinBtn.width -= 10;
        spinBtn.height -= 10;
        spinBtnText.fontSize = 25;
        if (!isRuning){
            pointsValue = 0;
            pointsText.text = pointsValue.toFixed(2);
            this.start();
            setTimeout(function(){
                this.stop();
            }.bind(this), spiningTime);
            isRuning = true;
        }
    }, this);

    spinBtn.events.onInputUp.add(function(){
        spinBtn.width += 10;
        spinBtn.height += 10;
        spinBtnText.fontSize = 26;
    }, this);

    container.add(spinBtn);
    container.add(spinBtnText);


    this.start = function(){
        for (var i = 0; i < reels.length; i++){
            reels[i].stopAnimating();
            reels[i].start();
        }
    };

    this.stop = function(atOnce){
        var offset = generateOffsets();

        for (var i = 0; i < reels.length; i++){
            if (atOnce){
                reels[i].stop(offset[i]);
                isRuning = false;
                playAnimation();
                countPoints();
            } else {
                (function(reel, offset, timeout, reelId){
                    setTimeout(function(){
                        reel.stop(offset);

                        if (reel.id === reelId){
                            isRuning = false;
                            playAnimation();
                            countPoints();
                        }
                    }, timeout);
                })(reels[i], offset[i], stopReelTimeout * i + 1, reels.length - 1);
            }
        }
        
    };

    this.update = function(){
        for (var i = 0; i < reels.length; i++){
            reels[i].update();
        }

        if (isCountPoints){
            pointsValue += pointsStep;
            pointsText.text = pointsValue.toFixed(2);
        }
    }

    function generateOffsets(){
        return [getRandomInt(1,8),getRandomInt(1,8),getRandomInt(1,8),getRandomInt(1,8),5];
    };

    function playAnimation(){
        setTimeout(function(){
            for (var i = 0; i < reels.length; i++){
                reels[i].playAnimations();
            }
        }, 600);
    };

    function countPoints(){
        pointsStep = getRandomInt(1, 100) / 100;
        isCountPoints = true;
        setTimeout(function(){
            isCountPoints = false;
        }, pointsTime);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}