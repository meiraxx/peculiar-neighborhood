import * as PIXI from 'pixi.js'
export default class GameStatistics {
	
    constructor(app) {
    	this.app = app;
        this.app.statistics = this;
    	this.batUsageTime = 0.0;
    	this.gunUsageTime = 0.0;
        this.netgunUsageTime = 0.0;
        this.whistleUsageTime = 0.0;
        this.currentWeapon = -1;
        this.killedMonsters = 0;
        this.curedMonsters = 0;
        this.gunShots = 0;
        this.netgunShots = 0;
        this.baseballBatBeats = 0;
        this.gunHits = 0;
        this.netgunHits = 0;
        this.batHits = 0;
        this.currentWaveCounter = 0;
        this.score = 0.0;
        this.levelTime = 0.0;
        this.levelSuccess = false;
        this.playerDead = false;
        this.waveTimes = [];
    }
    initLoop() {
        this.app.ticker.add(delta => this.loop(delta));
    }

    loop(delta) {
        switch(this.currentWeapon) {
            case 0: this.batUsageTime += delta* 0.01;
            break;
            case 1: this.gunUsageTime += delta* 0.01;
            break;
            case 2: this.netgunUsageTime += delta* 0.01;
            break;
            case 3: this.whistleUsageTime += delta* 0.01;
            break;
        }
        this.levelTime += delta* 0.01;

    }   

    toString() {

        var totalEquipmentTime = (this.batUsageTime + this.netgunUsageTime + this.gunUsageTime);
        totalEquipmentTime = totalEquipmentTime == 0.0 ? 1.0 : totalEquipmentTime;
        var batAccuracy = (this.batHits / (this.baseballBatBeats == 0 ? 1 : this.baseballBatBeats));
        var gunAccuracy = (this.gunHits / (this.gunShots == 0 ? 1 : this.gunShots));
        var netgunAccuracy = (this.netgunHits / (this.netgunShots == 0 ? 1 : this.netgunShots));

        var ret = (this.levelSuccess ? "Success!" : "Fail!") + "\n" +
        (this.playerDead ? "(player died)\n" : "\n") + 
        "score: " + this.score.toString() + "\n" +
        "monsters killed:   " + this.killedMonsters.toString() + "\n" +
        "monsters cured:    " + this.curedMonsters.toString() + "\n" +
        "baseball bat:\n"+
        "   usage time: " + this.batUsageTime.toString() + " seconds, " + ((this.batUsageTime / totalEquipmentTime) * 100.0) .toString() + "%\n"+
        "   accuracy: " + batAccuracy.toString() + "%, used " + this.baseballBatBeats.toString() + " times" + "\n" +
        "pistol:\n"+
        "   usage time: " + this.gunUsageTime.toString() + " seconds, " + ((this.gunUsageTime / totalEquipmentTime) * 100.0).toString() + "%\n"+
        "   accuracy: " + gunAccuracy.toString() + "%, used " + this.gunShots.toString() + " times" + "\n" +
        "netgun:\n"+
        "   usage time: " + this.netgunUsageTime.toString() + " seconds, " + ((this.netgunUsageTime / totalEquipmentTime) * 100.0).toString() + "%\n"+
        "   accuracy: " + netgunAccuracy.toString() + "%, used " + this.netgunShots.toString() + " times" + "\n" +
        "waves: \n";
        for(var i = 0; i < this.waveTimes.length - 1; i++) {
            ret += "wave " + i.toString() + " duration: from " + this.waveTimes[i].toString() + " to " + this.waveTimes[i+1].toString() + " (" + (this.waveTimes[i+1] - this.waveTimes[i]).toString() + " seconds)\n";
        }
        if(this.waveTimes.length % 2 == 1)
            ret += "last ongoing wave " + (this.waveTimes.length - 1).toString() + " duration: from " + this.waveTimes[this.waveTimes.length - 1].toString() + " (" + (this.levelTime - this.waveTimes[this.waveTimes.length - 1]).toString() + " seconds)\n";   
        ret += "total time played: " + (this.levelTime).toString() + "\n";
        return ret;
    }

    monsterKilled() {
        this.killedMonsters += 1;
    }

    monsterCured() {
        this.curedMonsters += 1;
    }

    bulletShot() {
        this.gunShots += 1;
    }
    netShot() {
        this.netgunShots += 1;
    }
    netHit() {
        this.netgunHits += 1;
    }

    waveIncremented() {
        this.currentWaveCounter += 1;
        this.waveTimes.push(this.levelTime);
    }

    setScore(score) {
        this.score += score;
    }

    baseballBatBeat() {
        this.baseballBatBeats += 1;
    }
    baseballBatHit() {
        this.batHits += 1;
    }

    gunEquipped() {
        this.currentWeapon = 1;
    }
    weaponUnequipped() {
        this.currentWeapon = -1;
    }

    netgunEquipped() {
        this.currentWeapon = 2;

    }

    whistleEquipped() {
        this.currentWeapon = 3;
    }

    baseballBatEquipped() {
        this.currentWeapon = 0;
    }

    bulletHit() {
        this.gunHits += 1;
    }

    successLevel() {
        this.levelSuccess = true;
    }
    
    playerDied() {
        this.playerDead = true;
    }


}