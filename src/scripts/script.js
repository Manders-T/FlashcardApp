const defaultFrenchWordsArray = ["Bonjour", "Au revoir", "J'adore"];
const defaultEnglishTranslationArray = ["Hello", "Goodbye", "I love"];

const actionButton = document.getElementById('next_action');
const translateButton = document.getElementById('translate');
const currentWord = document.getElementById('current_word');
const cardTitle = document.getElementById('card_title');
const addToList = document.getElementById('add-words');
const newFrenchWord = document.getElementById('new-french-word');
const newEnglishWord = document.getElementById('new-english-word');
const resetList = document.getElementById('reset-list');
const optionToggle = document.getElementById('option')
let counter = 0;
let currentPosition = 0;

let storedOption = localStorage.getItem("option");
switch (storedOption) {
  case null:
    storedOption = "frenchToEnglish";
    localStorage.setItem("option", storedOption);
    break;
  case "englishToFrench":
    optionToggle.checked = true;
    break;
}

let frenchWordsArray = JSON.parse(localStorage.getItem("frenchWords"))
if (frenchWordsArray === null) {
    frenchWordsArray = defaultFrenchWordsArray.slice(0);
}

let englishTranslationArray = JSON.parse(localStorage.getItem("englishWords"))
if (englishTranslationArray === null) {
    englishTranslationArray = defaultEnglishTranslationArray.slice(0);
}

function getRandomInteger(checkPosition) {
  let newPostion;
  do {
  newPostion = Math.floor(Math.random() * frenchWordsArray.length);
  } while (checkPosition === newPostion)
  return newPostion;
}

actionButton.addEventListener('click', () => {
    cardTitle.innerText = 'French Word:';
    let wordArrayPosition;
    if (frenchWordsArray.length < 5) {
      wordArrayPosition = counter % frenchWordsArray.length;
    } else {
      wordArrayPosition = getRandomInteger(currentPosition);
    }
    currentWord.innerText = frenchWordsArray[wordArrayPosition];
    //document.getElementById('card-div').style.visibility = 'visible';
    document.getElementById('card-div').style.display = 'block';
    translateButton.disabled = false;
    actionButton.innerText = 'Next';
    if (actionButton.getAnimations().length !== 0) {
      actionButton.getAnimations()[0].cancel();
    }
    counter++;
    currentPosition = wordArrayPosition;
})

translateButton.addEventListener('click', () => {
    cardTitle.innerText = 'English Translation:';
    let wordArrayPosition = frenchWordsArray.indexOf(currentWord.innerText);
    currentWord.innerText = englishTranslationArray[wordArrayPosition];
    translateButton.disabled = true;
})

addToList.addEventListener('click', () => {
    if (frenchWordsArray.includes(newFrenchWord.value)) {
      alert("Word already entered!")
    } else if (newFrenchWord.value == "" || newEnglishWord.value == "") {
        alert("Make sure both boxes are filled out!")
    } else {
      if (frenchWordsArray.toString() === defaultFrenchWordsArray.toString()) {
        frenchWordsArray = [];
        englishTranslationArray = [];
      }
      frenchWordsArray.push(newFrenchWord.value);
      englishTranslationArray.push(newEnglishWord.value);
      localStorage.setItem("frenchWords", JSON.stringify(frenchWordsArray))
      localStorage.setItem("englishWords", JSON.stringify(englishTranslationArray))
    }
    newFrenchWord.value = "";
    newEnglishWord.value = "";
})

resetList.addEventListener('click', () => {
    console.log("Resetting list..")
    frenchWordsArray = defaultFrenchWordsArray.slice(0);
    console.log(frenchWordsArray);
    englishTranslationArray = defaultEnglishTranslationArray.slice(0);
    localStorage.clear();
})

optionToggle.addEventListener('change', () => {
  if (optionToggle.checked === true && storedOption !== "englishToFrench") {
    storedOption = "englishToFrench";
    localStorage.setItem("option", storedOption);
  } else if (optionToggle.checked === false && storedOption !== "frenchToEnglish") {
    storedOption = "frenchToEnglish";
    localStorage.setItem("option", storedOption);
  }
})