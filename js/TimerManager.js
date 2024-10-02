class TimerManager {
  constructor() {
    this.stopwatchInterval = null;
    this.isPaused = false;
    this.elapsedTime = 0;
    this.stopwatchDiv = document.getElementById("stopwatch");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resumeBtn = document.getElementById("resumeBtn");
  }

  startStopwatch() {
    this.stopwatchInterval = setInterval(() => {
      if (!this.isPaused) {
        this.elapsedTime++;
        this.updateStopwatchDisplay();
      }
    }, 1000);
  }

  pauseStopwatch() {
    this.isPaused = true;
    clearInterval(this.stopwatchInterval);
    this.pauseBtn.disabled = true;
    this.resumeBtn.disabled = false;
  }

  resumeStopwatch() {
    this.isPaused = false;
    this.startStopwatch();
    this.pauseBtn.disabled = false;
    this.resumeBtn.disabled = true;
  }

  updateStopwatchDisplay() {
    const hours = Math.floor(this.elapsedTime / 3600);
    const minutes = Math.floor((this.elapsedTime % 3600) / 60);
    const seconds = this.elapsedTime % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    this.stopwatchDiv.textContent = formattedTime;
  }

  getTimerStatus() {
    return this.isPaused;
  }
}
