const defaultFrenchWordsArray = ["Bonjour", "Au revoir", "J'adore"];
const defaultSpanishWordsArray = ["Hola", "Adios", "Amo"];
const defaultEnglishTranslationArray = ["Hello", "Goodbye", "I love"];

const actionButton = document.getElementById('next_action');
const translateButton = document.getElementById('translate');
const currentWord = document.getElementById('current_word');
const cardTitle = document.getElementById('card_title');
const addToList = document.getElementById('add-words');
const newForeignWord = document.getElementById('new-foreign-word');
const newEnglishWord = document.getElementById('new-english-word');
const resetList = document.getElementById('reset-list');
const optionToggle = document.getElementById('option');
const languageSelector = document.getElementById('language');
const foreignToEnglish = document.getElementById('opt1');
const englishToForeign = document.getElementById('opt2');
let counter = 0;
let currentPosition = 0;

//Get translation direction and store locally if not set
let storedOption = localStorage.getItem("option");
switch (storedOption) {
  case null:
    storedOption = "foreignToEnglish";
    localStorage.setItem("option", storedOption);
    break;
  case "englishToForeign":
    optionToggle.checked = true;
    break;
}

//Get language option and store locally if not set
let languageOption = localStorage.getItem("language");
switch (languageOption) {
  case null:
    languageOption = "FR";
    localStorage.setItem("language", languageOption);
    break;
  case "SP":
    languageSelector.value = "SP";
    break;
}

if (languageOption === "SP") {
  newForeignWord.placeholder = "New Spanish word";
  foreignToEnglish.innerText = "Spanish to English";
  englishToForeign.innerText = "English to Spanish";
} else {
  newForeignWord.placeholder = "New French word";
  foreignToEnglish.innerText = "French to English";
  englishToForeign.innerText = "English to French";
}

let transitionArray = JSON.parse(localStorage.getItem("frenchWords"))
if (transitionArray !== null) {
  localStorage.setItem("foreignWords", JSON.stringify(transitionArray))
  localStorage.removeItem("frenchWords")
}
//Get foreign words from local storage and set to default list if empty
let foreignWordsArray = JSON.parse(localStorage.getItem("foreignWords"))
if (foreignWordsArray === null) {
  if (languageOption === "FR") {
    foreignWordsArray = defaultFrenchWordsArray.slice(0);
  } else {
    foreignWordsArray = defaultSpanishWordsArray.slice(0);
  }
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
  newPostion = Math.floor(Math.random() * foreignWordsArray.length);
  } while (checkPosition === newPostion)
  return newPostion;
}

function takeAction () {
    
  let wordArrayPosition;
  //If few words use simple option to reduce getting repeat words
  if (foreignWordsArray.length < 5) {
    wordArrayPosition = counter % foreignWordsArray.length;
  } else {
    wordArrayPosition = getRandomInteger(currentPosition);
  }

  if (storedOption === "englishToForeign") {
    cardTitle.innerText = 'English word:';
    currentWord.innerText = englishTranslationArray[wordArrayPosition];
  } else {
    if (languageOption === "SP") {
      cardTitle.innerText = "Spanish word:"
    } else {
     cardTitle.innerText = 'French word:';
    }
    currentWord.innerText = foreignWordsArray[wordArrayPosition];
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
    if (storedOption === "englishToForeign"){
      if (languageOption === "SP") {
        cardTitle.innerText = 'Spanish translation:';
      } else {
        cardTitle.innerText = 'French translation:';
      }
      wordArrayPosition = englishTranslationArray.indexOf(currentWord.innerText);
      currentWord.innerText = foreignWordsArray[wordArrayPosition];
    } else {
      cardTitle.innerText = 'English translation:';
      wordArrayPosition = foreignWordsArray.indexOf(currentWord.innerText);
      currentWord.innerText = englishTranslationArray[wordArrayPosition];
    }
    
    translateButton.disabled = true;
})

addToList.addEventListener('click', () => {
    //Check if word already in the array
    if (foreignWordsArray.includes(newForeignWord.value)) {
      alert("Word already entered!")
      //Check both boxes are populated
    } else if (newForeignWord.value == "" || newEnglishWord.value == "") {
        alert("Make sure both boxes are filled out!")
    } else {
      //If array only includes the default words empty the arrays
      let foreignArrayAsString;
      if (languageOption === "FR") {
        foreignArrayAsString = defaultFrenchWordsArray.toString();
      } else {
        foreignArrayAsString = defaultSpanishWordsArray.toString();
      }

      if (foreignWordsArray.toString() === foreignArrayAsString) {
        foreignWordsArray = [];
        englishTranslationArray = [];
      }
      //Add the words to the arrays and set in local storage
      foreignWordsArray.push(newForeignWord.value.trim());
      englishTranslationArray.push(newEnglishWord.value.trim());
      localStorage.setItem("foreignWords", JSON.stringify(foreignWordsArray))
      localStorage.setItem("englishWords", JSON.stringify(englishTranslationArray))
    }
    newForeignWord.value = "";
    newEnglishWord.value = "";
})

resetList.addEventListener('click', () => {
    //Set both arrays back to default values and clear local storage
    console.log("Resetting list..")
    if (languageOption === "FR") {
      foreignWordsArray = defaultFrenchWordsArray.slice(0);
    } else {
      foreignWordsArray = defaultSpanishWordsArray.slice(0);
    }
    console.log(foreignWordsArray);
    englishTranslationArray = defaultEnglishTranslationArray.slice(0);
    localStorage.removeItem("foreignWords");
    localStorage.removeItem("englishWords");
})

optionToggle.addEventListener('change', () => {
  if (optionToggle.checked === true && storedOption !== "englishToForeign") {
    storedOption = "englishToForeign";
    localStorage.setItem("option", storedOption);
  } else if (optionToggle.checked === false && storedOption !== "foreignToEnglish") {
    storedOption = "foreignToEnglish";
    localStorage.setItem("option", storedOption);
  }
  takeAction();
})

languageSelector.addEventListener('change', () => {
  if (languageSelector.value === "FR" && languageOption !== "FR") {
    languageOption = "FR";
    localStorage.setItem('language', languageOption);
    newForeignWord.placeholder = "New French word";
    cardTitle.innerText = "French word:";
    foreignToEnglish.innerText = "French to English";
    englishToForeign.innerText = "English to French";
  } else if (languageSelector.value === "SP" && languageOption !== "SP") {
    languageOption = "SP"
    localStorage.setItem('language', languageOption);
    newForeignWord.placeholder = "New Spanish word";
    cardTitle.innerText = "Spanish word:";
    foreignToEnglish.innerText = "Spanish to English";
    englishToForeign.innerText = "English to Spanish";
  }
  document.getElementById('card-div').style.display = 'none';
})