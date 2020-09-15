import words from "./words.json";

interface Word {
  text: string;
  el: HTMLElement;
}

function randomChance(limit): Boolean {
  limit /= 100;

  if (Math.random() <= limit) {
    return true;
  }

  return false;
}

class Game {
  current_words: Array<Word> = [];
  input: HTMLInputElement;
  overlay: HTMLElement;
  play_area: HTMLElement;
  new_word_chance: number = 0.1;
  words_entered: number = 0;
  speed: number = 0.3;
  ticks: number = 1;

  constructor() {
    this.input = <HTMLInputElement>document.getElementById("main-input");
    this.play_area = document.getElementById("play-area");
    this.overlay = document.getElementById("overlay");
  }

  init(): void {
    this.tick = this.tick.bind(this);
    this.input.value = "";

    document.addEventListener("keyup", this.enterWord.bind(this));
    document.getElementById("btn-init").addEventListener("click", this.startGame.bind(this));
  }

  startGame(): void {
    this.overlay.style.display = "none";
    this.input.removeAttribute("disabled");
    this.input.focus();

    this.addWord();
    this.tick();
  }
 
  addWord(): void {
    const new_word = this.getRandomWord();
    const new_el = document.createElement("span")

    new_el.className = "word";
    new_el.style.right = "800px";
    new_el.style.top = Math.round(Math.random() * 380) + "px";
    new_el.innerHTML = new_word;

    this.play_area.appendChild(new_el);
    this.current_words.push({
      text: new_word,
      el: new_el
    })
  }

  enterWord(e): void {
    if (e.key !== "Enter") {
      return;
    }

    let prev_len = this.current_words.length;

    this.current_words.forEach((word, i) => {
      if (this.input.value === word.text) {
        
        word.el.remove();
        this.current_words.splice(i, 1);
      }
    })

    if (prev_len > this.current_words.length) {
      this.input.value = "";
      this.words_entered++;

      if (this.words_entered && this.words_entered % 5 === 0) {
        this.speed += 0.1
      }
    }
  }

  gameOver(): void {
    this.current_words = [];

    this.input.setAttribute("disabled", "");

    this.play_area.innerHTML = "";
  }

  getRandomWord(): string {
    return words[Math.round(Math.random() * words.length)]
  }

  tick(): void {
    let game_over = false;

    this.current_words.forEach(word => {
      word.el.style.right = parseInt(word.el.style.right) - this.speed + "px";
      
      if (parseInt(word.el.style.right) <= 0) {
        game_over = true;
      }
    })

    if (randomChance(this.new_word_chance)) {
      this.addWord();
      this.new_word_chance = 0.1;
    } else {
      this.new_word_chance += 0.001;
    }

    if (game_over) {
      this.gameOver();
      return;
    }

    this.ticks++;
    requestAnimationFrame(this.tick);
  }
}

const game = new Game();

game.init();