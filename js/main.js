var phaserGame;
var bootState;
var loadState;
var playState;
var slotMachine;
var preBack;
var loadingTextLabel;
var loadingPercentText;

phaserGame = new Phaser.Game({
    width: config.canvasWidth,
    height: config.canvasHeight,
    renderer: Phaser.AUTO,
    parent: 'game'
});

bootState = {
    preload: function() {
        phaserGame.load.image('preBack', './img/preloaderBack.png');
    },
    create: function() {
        phaserGame.state.start('load');
    }
};

loadState = {
    preload: function() {
        preBack = phaserGame.add.sprite(0, 0, 'preBack');
        preBack.width = config.canvasWidth;
        preBack.height = config.canvasHeight;

        loadingTextLabel = phaserGame.add.text(220, 255, "LOADING...", {
            font: "normal 72px Impact",
            stroke: "white",
            strokeThickness: 2,
            boundsAlignH: "right",
            boundsAlignV: "middle"
        });
        loadingPercentText = phaserGame.add.text(580, 255, "0%", {
            font: "normal 72px Impact",
            stroke: "white",
            strokeThickness: 2,
            boundsAlignH: "right",
            boundsAlignV: "middle"
        });
    },
    create: function() {
        phaserGame.load.onLoadStart.add(function() {
            console.log('start loading');
        });

        phaserGame.load.onFileComplete.add(function(percent, name, index) {
            loadingPercentText.text = percent+"%";
        });

        phaserGame.load.onLoadComplete.add(function() {
            console.log('end loading');
            phaserGame.state.start('play');
        });

        phaserGame.load.image('background', './img/background.png');
        phaserGame.load.image('reelFrame', './img/reel_frame_regular.png');
        phaserGame.load.image('reelBack',  './img/ReelBackground_regular.png');
        phaserGame.load.image('sideband', './img/sideband.png');
        phaserGame.load.image('logo', './img/logo.png');        
        phaserGame.load.image('box', './img/box.png');
        phaserGame.load.image('spinBtn', './img/spin_btn.png');
        phaserGame.load.atlas('scatter1', './img/scatter1.png', './img/scatter1.json');
        phaserGame.load.atlas('scatter2', './img/scatter2.png', './img/scatter2.json');
        phaserGame.load.atlas('symbolAnimations', './img/symbolAnimations.png', './img/symbolAnimations.json');        
        phaserGame.load.atlas('wildAnim', './img/wildAnim.png', './img/wildAnim.json');
        phaserGame.load.atlas('symbols', './img/symbols.png', './img/symbols.json');

        phaserGame.load.start();           
    }
};

playState = {
    create: function() {
        //preloaderBar.visible = false;
        loadingPercentText.visible = false;
        loadingTextLabel.visible = false;
        phaserGame.stage.disableVisibilityChange = true;
        slotMachine = new SlotMachine();
    },
    update: function() {
        slotMachine.update();
    }
};

phaserGame.state.add('boot', bootState);
phaserGame.state.add('load', loadState);
phaserGame.state.add('play', playState);
phaserGame.state.start('boot');

// phaserGame.add.sprite(x, y, name, frame);
// phaserGame.paused = true;
// phaserGame.paused = false;
