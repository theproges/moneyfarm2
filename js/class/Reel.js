function Reel(reelId) {
    var container = phaserGame.add.group(),
        gap = 0,
        width = 140,
        height = 450,
        id = reelId,
        startSpinAnimation,
        spiningAnimation,
        stopSpinAnimation,
        that = this,
        visible = true,
        stopped = true,
        stopping = false,
        bottomIndex = 0,
        topIndex = 0,
        stopTopIndex = -1,
        stopBottomIndex = -1,
        maskWidth,
        maskHeight,
        newTopIndex = -1,
        newBottomIndex = -1,
        maskBottomY,
        spinConfig,

        symbolsCount = 3,
        frameTick = 0,
        stage = 'idle',
        startTime = 5,
        startSpeed = 1,
        spinSpeed = 30,
        stopSpeed = 20,
        mustStopAnimation = false,
        symbolPool = {};

    container.gap = gap;
    container.visible = visible;

    this.container = container;
    this.id = id;
    this.currSymbols = [];
    this.symbols = [];

    var symHeight = height / (symbolsCount + 1);


    this.update = function(){
        switch (stage){
            case 'start': startSpinAnimation.call(this); break;
            case 'spining': spiningAnimation.call(this); break;
            case 'stop': stopSpinAnimation.call(this); break;
            case 'idle': break;
        }
    };

    startSpinAnimation = function(){
        this.startTopIndex = topIndex;
        this.startBottomIndex = bottomIndex;
    
        if (frameTick >= startTime){
            frameTick = 1;
            this.topIndex = topIndex;
            this.bottomIndex = bottomIndex;
            this.reelSpeed = spinSpeed;
            stage = 'spining';
        } else {
            for (var i = 0, length = that.currSymbols.length; i < length; i++) {
                var sym = that.currSymbols[i];

                sym.y -= startSpeed;
            }
            frameTick += 1;
        }        
    };

    spiningAnimation = function() {
        var sym;

        mustStopAnimation = false;
        for (var i = 0; i < that.currSymbols.length; i++) {
            sym = that.currSymbols[i];
            sym.y += this.reelSpeed;

            if (i === that.currSymbols.length - 1 && sym.y >= maskBottomY + 10) { // checking stage
                var newSym;
                var oldSym;

                if (newTopIndex !== -1) {
                    this.topIndex = newTopIndex;
                    this.bottomIndex = newBottomIndex;
                    newTopIndex = -1;
                    newBottomIndex = -1;
                } else {
                    this.topIndex--;
                    this.bottomIndex--;
                }

                this.topIndex = this.topIndex < 0 ? that.symbols.length - 1 : this.topIndex;
                this.bottomIndex = this.bottomIndex < 0 ? that.symbols.length - 1 : this.bottomIndex;

                oldSym = that.currSymbols.pop();
                container.removeChild(oldSym.container);
                oldSym.isUsing = false;
                oldSym.visible = false;

                newSym = getSymbol(that.symbols[this.topIndex]);
                newSym.visible = true;
                newSym.isUsing = true;
                newSym.y = that.currSymbols[0].y - symHeight - gap;
                container.add(newSym.container);
                if (!newSym.isTop){
                    container.sendToBack(newSym.container);
                }
                that.currSymbols.unshift(newSym);

                if (this.topIndex === stopTopIndex) {
                    mustStopAnimation = true;
                }
            }
        }

        if (mustStopAnimation) {
            frameTick = 1;
            mustStopAnimation = false;
            stage = 'stop';
        }
    };

    stopSpinAnimation = function() {
        var deepCoef = 20,
            bottomY = maskHeight + symHeight + deepCoef;

        for (var i = 0, length = that.currSymbols.length; i < length; i++) {
            var lastSym = that.currSymbols[length - 1],
                sym = that.currSymbols[i];

            if (lastSym.y < bottomY && !mustStopAnimation) {
                sym.y += this.reelSpeed;
            } else {
                sym.y -= stopSpeed;
                mustStopAnimation = true;

                if (lastSym.y < bottomY - deepCoef) {
                    for (var i = 0, length = that.currSymbols.length; i < length; i++) {
                        var sym = that.currSymbols[i];

                        sym.y = i * (symHeight + gap) + symHeight / 2;
                    }
                    stage = 'idle';
                }
            }
        }
    };
    

    // METHODS
    this.setOffset = function(offset) {
        if (this.symbols && this.symbols.length > 0) {
            countOffset(offset);
            updateReelView();
        }
    };

    this.countOffset = countOffset;

    this.start = function(newSpinConfig) {
        frameTick = 1;
        stopTopIndex = -1;
        stopBottomIndex = -1;
        spinConfig = newSpinConfig;

        stage = 'start';
    };

    this.stop = function(offset) {
        countOffset(offset);
        stopTopIndex = topIndex;
        stopBottomIndex = bottomIndex;
        newTopIndex = stopTopIndex + (symbolsCount + 2);
        newTopIndex = newTopIndex >= that.symbols.length ? newTopIndex - that.symbols.length : newTopIndex;
        newBottomIndex = stopBottomIndex + (symbolsCount + 2);
        newBottomIndex = newBottomIndex >= that.symbols.length ? newBottomIndex - that.symbols.length : newBottomIndex;
    };

    this.setStrip = function(strip, noReset) {
        this.symbols = strip;

        if (symbolsCount && !noReset) {
            topIndex = that.symbols.length - 1;
            bottomIndex = symbolsCount;
        }

        for (var i = 0, len = strip.length; i < len; i++){
            if (symbolPool[strip[i]]){
                symbolPool[strip[i]].push(new Symbol(strip[i]))
            } else {
                symbolPool[strip[i]] = [new Symbol(strip[i])];
            }
        }
    };

    this.updateView = updateReelView;

    this.stopAnimating = function() {
        for (var i = 0; i < this.currSymbols.length; i++){
            this.currSymbols[i].stop();
        }
    };

    this.playAnimations = function(){
        for (var i = 1; i < this.currSymbols.length - 1; i++){
            this.currSymbols[i].play();
        }
    }

    // FUNCS
    function countOffset(offset) {
        var count = symbolsCount;

        topIndex = offset - 1 < 0 ? that.symbols.length - 1 : offset - 1;
        bottomIndex = count + offset >= that.symbols.length ? count + offset - that.symbols.length : count + offset;
    }

    function updateReelView() {
        container.removeAll(true);

        for (var n = symbolsCount + 1, k = bottomIndex; n >= 0; n--, k--) {
            k = k < 0 ? that.symbols.length - 1 : k;

            that.currSymbols[n] = getSymbol(that.symbols[k]);
            var currSym = that.currSymbols[n];

            currSym.visible = true;
            currSym.width = width;
            currSym.height = symHeight;
            currSym.x = 0;
            currSym.y = n * (symHeight + gap) + symHeight / 2;
            container.add(currSym.container);
            if (!currSym.isTop){
                container.sendToBack(currSym.container);
            }
        }

        // Set mask
        var mask = phaserGame.add.graphics(0, 0);

        maskWidth = config.canvasWidth;
        maskHeight = container.height - symHeight * 2;
        maskBottomY = container.y + symHeight + maskHeight;

        mask.beginFill(0xff33ff);
        mask.drawRect(0, container.y + symHeight, maskWidth, maskHeight);
        container.mask = mask;
    }

    function getSymbol(symId){
        var symbolsArr = symbolPool[symId];
        var sym;

        for (var i = 0; i < symbolsArr.length; i++){
            sym = symbolsArr[i];

            if (!sym.isUsing){
                sym.isUsing = true;
                break;
            } else {
                sym = null;
            }
        }

        if (!sym){
            sym = new Symbol(symId);
            sym.isUsing = true;
            symbolsArr.push(sym);
        }

        sym.width = width;
        sym.height = symHeight;

        return sym;
    }
}
