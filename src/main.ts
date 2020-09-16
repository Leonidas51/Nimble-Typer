import words from "./words.js";

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
  msg_container: HTMLElement;
  new_word_chance_base: number = 0.1;
  new_word_chance: number = this.new_word_chance_base;
  words_entered: number = 0;
  longest_correct: string = "";
  longest_error: string = "";
  speed: number = 0.3;
  ticks: number = 1;

  constructor() {
    this.input = <HTMLInputElement>document.getElementById("main-input");
    this.play_area = document.getElementById("play-area");
    this.overlay = document.getElementById("overlay");
    this.msg_container = document.getElementById("msg-container");
  }

  init(): void {
    this.tick = this.tick.bind(this);
    this.startGame = this.startGame.bind(this);
    this.input.value = "";

    window.addEventListener("keyup", this.enterWord.bind(this));
    document.getElementById("btn-init").addEventListener("click", this.startGame);
    document.getElementById("btn-restart").addEventListener("click", this.startGame);
  }

  startGame(): void {
    this.overlay.style.display = "none";
    this.overlay.querySelector(<any>"#overlay-start").style.display = "none";
    this.overlay.querySelector(<any>"#overlay-endgame").style.display = "none";

    this.input.removeAttribute("disabled");
    this.input.focus();
    this.input.value = "";
    
    this.new_word_chance_base = 0.1;
    this.new_word_chance = this.new_word_chance_base;
    this.words_entered = 0;
    this.longest_correct = "";
    this.longest_error = "";
    this.speed = 0.3;
    this.ticks = 1;

    this.addWord();
    this.tick();

    this.showMessage("Вводите слова, пока они не дошли до правого края!");
  }
 
  addWord(): void {
    const new_word = this.getRandomWord();
    const new_el = document.createElement("span")
    let new_word_top

    new_el.className = "word";
    new_el.style.right = "800px";
    new_el.innerHTML = new_word;

    //take 5 tries to not let words overlap
    for (let i = 0; i < 5; i++) {
      let fail = false;
      new_word_top = Math.round(Math.random() * 380);
  
      this.current_words.forEach(word => {
        let top = parseInt(word.el.style.top)
        if (Math.abs(new_word_top - top) <= 15) {
          fail = true;
        }
      })

      if (!fail) {
        break;
      }
    }

    new_el.style.top = new_word_top + "px";

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
        
        this.animateWordRemoval(word.el);
        this.current_words.splice(i, 1);
      }
    })

    if (prev_len > this.current_words.length) { // word entered correctly
      if (this.input.value.length > this.longest_correct.length) {
        this.longest_correct = this.input.value;
      }

      this.input.value = "";
      this.words_entered++;

      if ((this.words_entered + 5) % 10 === 0) { // 5, 15, 25...
        this.speed += 0.1;
        this.showMessage('Скорость увеличена!');
      } else if (this.words_entered && this.words_entered % 10 === 0) { // 10, 20, 30...
        this.new_word_chance_base += 0.1;
        this.showMessage('Больше слов!');
      }
    } else { // error in word
      if (this.input.value.length > this.longest_error.length) {
        this.longest_error = this.input.value;
      }

      this.input.classList.add("error");

      setTimeout(() => {
        this.input.classList.remove("error");
      }, 700)
    }
  }

  animateWordRemoval(el): void {
    el.classList.add("remove-animate");

    setTimeout(() => {
      el.remove();
    }, 1000);
  }

  showMessage(msg): void {
    this.msg_container.innerHTML = msg;
    this.msg_container.style.opacity = "1";

    setTimeout(() => {
      this.msg_container.style.opacity = "0";
    }, 1000);
  }

  gameOver(): void {
    this.current_words = [];
    this.input.setAttribute("disabled", "");
    this.play_area.innerHTML = "";
    
    this.overlay.style.display = "block";
    this.overlay.querySelector(<any>"#overlay-endgame").style.display = "block";

    document.getElementById("endgame-value-score").innerHTML = String(this.words_entered);
    document.getElementById("endgame-value-longest-correct").innerHTML = this.longest_correct || "N/A";
    document.getElementById("endgame-value-longest-error").innerHTML = this.longest_error || "N/A";
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
      this.new_word_chance = this.new_word_chance_base;
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