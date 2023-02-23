const { concatMap, flatMap, delay } = rxjs.operators;

const $txt = document.querySelector('.logo__expect');

const cursor = '|';
const words = ['joy', 'fascinating', 'immersive', 'beautiful', 'digital', 'intelligent', 'digital', 'engaging', 'ART BASE.digital'];
const delAction = 0;
const waitAction = 1;

function typeLetter(letter) {
  if (letter === waitAction) {
    return;
  }

  let txt = $txt.innerText;
  if (letter === delAction) {
    txt = txt.slice(0, txt.length - 2);
  } else {
    txt = txt.slice(0, txt.length - 1) + letter;
  }
  $txt.innerText = txt + cursor;
}

function typeSpeed(letter) {
  switch (letter) {
    case delAction:return Math.round(Math.random() * 75);
    case waitAction:return 500;
    default:return Math.round(Math.random() * 200);}

}

let subscriber;

function typeWords() {
  if (subscriber) {
    subscriber.unsubscribe();
  }

  $txt.innerText = '';

  subscriber = rxjs.from(words).
  pipe(
  concatMap(word => {
    let letters = word.split('');

    if (Math.random() < 0.25) {// misstype
      const idx = Math.round(Math.random() * (letters.length - 2));
      const a = letters[idx];
      const b = letters[idx + 1];
      letters.splice(idx, 2, b, a, delAction, delAction, a, b);
    }

    const lastWord = words[words.length - 1];
    const l = letters.length;
    letters.push(waitAction);

    if (word !== lastWord) {
      for (let i = 0; i < l; i++) {
        letters.push(delAction);
      }
    }

    return letters;
  }),
  concatMap(letter => rxjs.of(letter).pipe(delay(typeSpeed(letter))))).

  subscribe(typeLetter, () => {}, () => {
    $txt.innerText = $txt.innerText.replace(cursor, '');
    setTimeout(typeWords, 4000); // Wait for 2 seconds before typing new words
  });
}

typeWords();

document.querySelector('.logo').addEventListener('click', typeWords);