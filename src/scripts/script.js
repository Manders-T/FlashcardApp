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

//Get translation direction and store locally if not set
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

//Get foreign words from local storage and set to default list if empty
let frenchWordsArray = JSON.parse(localStorage.getItem("frenchWords"))
if (frenchWordsArray === null) {
    frenchWordsArray = defaultFrenchWordsArray.slice(0);
}

//Get english words from local storage and set to default list if empty
let englishTranslationArray = JSON.parse(localStorage.getItem("englishWords"))
if (englishTranslationArray === null) {
    englishTranslationArray = defaultEnglishTranslationArray.slice(0);
}

//Get Random integer for selecting position in words array - ensure different to previous
function getRandomInteger(checkPosition) {
  let newPostion;
  do {
  newPostion = Math.floor(Math.random() * frenchWordsArray.length);
  } while (checkPosition === newPostion)
  return newPostion;
}

function takeAction () {
    
  let wordArrayPosition;
  //If few words use simple option to reduce getting repeat words
  if (frenchWordsArray.length < 5) {
    wordArrayPosition = counter % frenchWordsArray.length;
  } else {
    wordArrayPosition = getRandomInteger(currentPosition);
  }

  if (storedOption === "englishToFrench") {
    cardTitle.innerText = 'English Word:';
    currentWord.innerText = englishTranslationArray[wordArrayPosition];
  } else {
    cardTitle.innerText = 'French Word:';
    currentWord.innerText = frenchWordsArray[wordArrayPosition];
  }

  
  document.getElementById('card-div').style.display = 'block';
  translateButton.disabled = false;
  actionButton.innerText = 'Next';
  //Cancel pulsing button after being pressed once
  if (actionButton.getAnimations().length !== 0) {
    actionButton.getAnimations()[0].cancel();
  }
  counter++;
  //Set current position to pass into randomint function for checking it is different
  currentPosition = wordArrayPosition;
}

actionButton.addEventListener('click', takeAction);

translateButton.addEventListener('click', () => {
    //Change card title and switch to appropriate translated word
    let wordArrayPosition;
    if (storedOption === "englishToFrench"){
      cardTitle.innerText = 'French Translation:';
      wordArrayPosition = englishTranslationArray.indexOf(currentWord.innerText);
      currentWord.innerText = frenchWordsArray[wordArrayPosition];
    } else {
      cardTitle.innerText = 'English Translation:';
      wordArrayPosition = frenchWordsArray.indexOf(currentWord.innerText);
      currentWord.innerText = englishTranslationArray[wordArrayPosition];
    }
    
    translateButton.disabled = true;
})

addToList.addEventListener('click', () => {
    //Check if word already in the array
    if (frenchWordsArray.includes(newFrenchWord.value)) {
      alert("Word already entered!")
      //Check both boxes are populated
    } else if (newFrenchWord.value == "" || newEnglishWord.value == "") {
        alert("Make sure both boxes are filled out!")
    } else {
      //If array only includes the default words empty the arrays
      if (frenchWordsArray.toString() === defaultFrenchWordsArray.toString()) {
        frenchWordsArray = [];
        englishTranslationArray = [];
      }
      //Add the words to the arrays and set in local storage
      frenchWordsArray.push(newFrenchWord.value);
      englishTranslationArray.push(newEnglishWord.value);
      localStorage.setItem("frenchWords", JSON.stringify(frenchWordsArray))
      localStorage.setItem("englishWords", JSON.stringify(englishTranslationArray))
    }
    newFrenchWord.value = "";
    newEnglishWord.value = "";
})

resetList.addEventListener('click', () => {
    //Set both arrays back to default values and clear local storage
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
  takeAction();
})