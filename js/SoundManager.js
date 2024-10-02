class SoundManager {
  constructor() {
    this.soundOn = localStorage.getItem("soundOn") === "true";

    this.sounds = {
      incorrect: new Audio("../sound/error.wav"),
      correct: new Audio("../sound/correct-choice.wav"),
      areaCompleted: new Audio("../sound/correct-blips.wav"),
      winSound: new Audio("../sound/win.mp3"),
      deleteSound: new Audio("../sound/del.wav"),
    };

    this.setVolume(0.5);

    this.speakerIcon = document.getElementById("speakerIcon");
    if (this.speakerIcon) {
      this.updateSpeakerIcon();
    }
  }

  toggleSound() {
    this.soundOn = !this.soundOn;
    localStorage.setItem("soundOn", this.soundOn.toString());
    if (this.speakerIcon) {
      this.updateSpeakerIcon();
    }
  }

  updateSpeakerIcon() {
    if (this.speakerIcon) {
      this.speakerIcon.classList.toggle("mute", !this.soundOn);
    }
  }

  setVolume(volume) {
    this.volume = volume;
    for (const sound in this.sounds) {
      if (this.sounds.hasOwnProperty(sound)) {
        this.sounds[sound].volume = volume;
      }
    }
  }

  playSound(soundName) {
    if (this.soundOn && this.sounds[soundName]) {
      this.sounds[soundName].play();
    }
  }

  isSoundOn() {
    return this.soundOn;
  }
}
