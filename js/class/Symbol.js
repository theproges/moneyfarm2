function Symbol(id){
    var staticSpriteName = 'symbols';
    var symbolsConfig = {
        0: {
            staticFrame: 'NINE.png',
            animationSprite: {
                name: 'symbolAnimations',
                prefix: 'Royal_9_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 10
            }
        },
        1: {
            staticFrame: 'TEN.png',
            animationSprite: {
                name: 'symbolAnimations',
                prefix: 'Royal_10_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 10
            }
        },
        2: {
            staticFrame: 'JACK.png',
            animationSprite: {
                name: 'symbolAnimations',
                prefix: 'Royal_J_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 10
            }
        },
        3: {
            staticFrame: 'QUEEN.png',
            animationSprite: {
                name: 'symbolAnimations',
                prefix: 'Royal_Q_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 10
            }
        },
        4: {
            staticFrame: 'KING.png',
            animationSprite: {
                name: 'symbolAnimations',
                prefix: 'Royal_K_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 10
            }
        },
        5: {
            staticFrame: 'ACE.png',
            animationSprite: {
                name: 'symbolAnimations',
                prefix: 'Royal_8_A_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 10
            }
        },
        6: {
            staticFrame: 'WILD.png',
            height: 200,
            isTop: true,
            animationSprite: {
                height: 238,
                width: 225,
                name: 'wildAnim',
                prefix: 'Wild_Chicken_',
                firstFrameNum: 0,
                lastFrameNum: 59,
                sufix: '.png',
                zeroPad: 3,
                fps: 18
            }
        },
        7: {
            staticFrame: 'PIC1.png',
            height: 160,
            animationSprite: null
        },
        8: {
            staticFrame: 'PIC2.png',
            height: 130,
            animationSprite: null
        },
        9: {
            staticFrame: 'PIC3.png',
            height: 130,
            animationSprite: null
        },
        10: {
            staticFrame: 'PIC4.png',
            height: 130,
            animationSprite: null
        },
        11: {
            staticFrame: 'PIC5.png',
            height: 130,
            animationSprite: null
        },
        12: {
            staticFrame: 'SCAT.png',
            isTop: true,
            height: 165,
            animationSprite: {
                height: 220,
                width: 195,
                name: 'scatter2',
                prefix: 'Scatter_Egg_Start_',
                firstFrameNum: 0,
                lastFrameNum: 25,
                sufix: '.png',
                zeroPad: 3,
                fps: 14
            },
            animationSpriteLoop: {
                height: 220,
                width: 195,
                name: 'scatter1',
                prefix: 'Scatter_Egg_Loop_',
                firstFrameNum: 0,
                lastFrameNum: 14,
                sufix: '.png',
                zeroPad: 3,
                fps: 13
            }
        }
    };
    var conf = symbolsConfig[id];
    var container = phaserGame.add.group();
    var staticSprite = phaserGame.add.sprite(0, 0, staticSpriteName, conf.staticFrame);

    staticSprite.height = conf.height;
    staticSprite.width = conf.width;
    
    container.add(staticSprite);
    
    staticSprite.visible = true;
    staticSprite.anchor.y = 0.5;
    staticSprite.anchor.x = 0.5;
    if (conf.animationSprite){
        var animationSprite = phaserGame.add.sprite(0, 0, conf.animationSprite.name);

        container.add(animationSprite);
        animationSprite.visible = false;
        animationSprite.anchor.y = 0.5;
        animationSprite.anchor.x = 0.5;

        if (conf.animationSprite.width)
            animationSprite.width = conf.animationSprite.width;
        if (conf.animationSprite.height)
            animationSprite.height = conf.animationSprite.height;

        animationSprite.animations.add('standard', Phaser.Animation.generateFrameNames(
            conf.animationSprite.prefix,
            conf.animationSprite.firstFrameNum,
            conf.animationSprite.lastFrameNum,
            conf.animationSprite.sufix,
            conf.animationSprite.zeroPad), conf.animationSprite.fps);

        if (id === 12){
            var animationSpriteLoop = phaserGame.add.sprite(0, 0, conf.animationSpriteLoop.name);

            container.add(animationSpriteLoop);
            animationSpriteLoop.visible = false;
            animationSpriteLoop.anchor.y = 0.5;
            animationSpriteLoop.anchor.x = 0.5;

            if (conf.animationSpriteLoop.width)
                animationSpriteLoop.width = conf.animationSpriteLoop.width;
            if (conf.animationSpriteLoop.height)
                animationSpriteLoop.height = conf.animationSpriteLoop.height;

            animationSpriteLoop.animations.add('standard', Phaser.Animation.generateFrameNames(
                conf.animationSpriteLoop.prefix,
                conf.animationSpriteLoop.firstFrameNum,
                conf.animationSpriteLoop.lastFrameNum,
                conf.animationSpriteLoop.sufix,
                conf.animationSpriteLoop.zeroPad), conf.animationSpriteLoop.fps);

            animationSpriteLoop.animations.currentAnim.onComplete.add(function() {
                animationSprite.visible = false;
                animationSpriteLoop.visible = false;
                staticSprite.visible = true;
            });
        }

    }

    this.play = function(loop) {
        if (!animationSprite){
            return;
        }

        animationSprite.visible = true;
        animationSprite.width = conf.animationSprite.width || staticSprite.width;
        animationSprite.height = conf.animationSprite.height || staticSprite.height;
        staticSprite.visible = false;

        animationSprite.animations.currentAnim.onComplete.add(function() {
            if (id === 12){
                animationSprite.visible = false;
                animationSpriteLoop.visible = true;
                animationSpriteLoop.play('standard', null, true);
            } else {
                staticSprite.visible = true;
                animationSprite.visible = false;
            }
        }, this);
        animationSprite.play('standard', null, loop);
    };

    this.stop = function(){
        if (!animationSprite){
            return;
        }
        staticSprite.visible = true;
        animationSprite.visible = false;
        animationSprite.animations.stop();

        if (id === 12){
            animationSpriteLoop.visible = false;
            animationSpriteLoop.animations.stop();
        }
    }

    Object.defineProperty(this, 'x', {
        get: function() {
            return this.container.x;
        },
        set: function(newX) {
            this.container.x = newX;
        }
    });

    Object.defineProperty(this, 'y', {
        get: function() {
            return this.container.y;
        },
        set: function(newY) {
            this.container.y = newY;
        }
    });

    Object.defineProperty(this, 'width', {
        set: function(newWidth) {
            staticSprite.width = staticSprite.width || newWidth;

            if (animationSprite){
                animationSprite.width = animationSprite.width || newWidth;
            }
        }
    });

    Object.defineProperty(this, 'height', {
        get: function(){
            return staticSprite.height;
        },
        set: function(newHeight) {
            staticSprite.height = staticSprite.height || newHeight;

            if (animationSprite){
                animationSprite.height = animationSprite.height || newHeight;
            }
        }
    });

    Object.defineProperty(this, 'visible', {
        set: function(isVisible) {
            container.visible = isVisible;
        }
    });

    this.container = container;
    container.visible = false;
    this.isUsing = false;
    this.isTop = conf.isTop || false;
}