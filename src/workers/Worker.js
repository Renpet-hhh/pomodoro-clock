
export default () => {

    // ------------------------
    // creates a timer, with methods run and stop
    const getTimer = () => {
        const timer = {shouldStop: false, isFirstRun: true, count: 0, interval: null, currentTime: null};
        timer.run = () => {
            if (timer.shouldStop) {
                return;
            }
            if (timer.isFirstRun) {
                timer.isFirstRun = false;
                timer.initialTime = Date.now()
            }
            timer.fn();
            timer.count++;
            if (Math.floor((Date.now() - timer.initialTime)/timer.interval) > timer.count) {
                timer.fn();
                timer.count++;
            }
            setTimeout(() => timer.run(), timer.interval);
        }
        timer.stop = () => {
            timer.shouldStop = true;
            return {interval: timer.interval, currentTime: timer.currentTime};
        }
        
        const decrementTime = () => {
            if (timer.currentTime === null) return;
            timer.currentTime -= 100;
            if (timer.currentTime === 0) {
                timer.currentTime = null; // avoids duplicate onFinish evocation
                postMessage("FINISH");
            }
            if (timer.currentTime % 1000 === 900) {
                postMessage(Math.floor(timer.currentTime/1000));
            }
        }
        timer.fn = decrementTime;
        return timer;
    }
    // ------------------------

    let timer = getTimer();

    onmessage = (e) => {
        if (e.data === "STOP") {
            let previous = timer.stop(); // get previous data
            timer = getTimer(); // new timer
            timer.interval = previous.interval;
            timer.currentTime = previous.currentTime;
        } else if (e.data === "RUN") {
            if (!timer.interval || !timer.currentTime) {
                postMessage("ERROR, PROVIDE DATA");
                return;
            }
            timer.run();
        } else if (Array.isArray(e.data) && e.data.length === 2) { // when Timer calls postMessage([interval, currentTime])
            timer.interval = e.data[0];
            timer.currentTime = e.data[1];
        } else if (e.data === "SPEED UP") {
            timer.interval = 10;
        }
        else {
            postMessage("ERROR");
        }
    };


}