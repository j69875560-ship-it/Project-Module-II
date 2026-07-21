// COMMIT 1: SELECT ELEMENTS
const form = document.getElementById("form");
const inputText = document.getElementById("input-text");
const searchBtn = document.getElementById("search-btn");
const messageDiv = document.getElementById("message");
const loadingMessage = document.getElementById("loading-message");
const errorMessageDiv = document.getElementById("error-message-div");
const errorMessage = document.getElementById("error-message");
const resultsSection = document.getElementById("results-section");
const searchedWords = document.getElementById("searched-words");
const pronunciationText = document.getElementById("pronunciation-text");
const audioControl = document.getElementById("audio-control");
const meaningsDiv = document.getElementById("meanings");
const definitionsDiv = document.getElementById("definitions");
const examplesDiv = document.getElementById("examples");
const synonymsDiv = document.getElementById("synonyms");
const sourceLink = document.getElementById("source-link");
const favouriteBtn = document.getElementById("favourite-btn");
const favouriteContainer = document.getElementById("favourite-container");

let currentWord = "";
// Phonetic is actually how the words are spelled e.g. hello /h/o/u/l
let currentPhonetic = "";

// COMMIT 2: INITIALIZE APP ON PAGE LOAD
// Every time the page loads the html loads first and the showFavourite function runs.
document.addEventListener("DOMContentLoaded", () => {
  showFavourites();
});
// COMMIT 3: HANDLE SEARCH FORM SUBMISSION
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const word = inputText.value.trim();

  if (word === "") {
    // Show error will be a separete function for error messages.
    showError("Please enter a word.");
    return;
  }
  // Separate fns clearResults,clearError,setLoading,fetchWord, displayWord.
  clearResults();
  clearError();
  setLoading(true);
  // promise with 3 possible endings.1.Success, .then-runs,.catch-skipped, .finnaly-runs
  // 2.word not found (404) ,.then-skipped, catch-runs with "not found" when the browser returns it>.finnally-runs
  // 3. Network error, .then()-skipped,.catch-runs with "network">.finall-still runs as it turns off loading spinner and re-enables button.

  fetchWord(word)
    .then((data) => {
      displayWord(data);
    })
    .catch((err) => {
      if (err.message === "not found") {
        showError(
          "We could not find that word. Check the spelling and try again.",
        );
      } else {
        showError(
          "Something went wrong while loading the definition. Please try again.",
        );
      }
    })
    .finally(() => {
      setLoading(false);
    });
});
// COMMIT 4: FETCH WORD DATA FROM THE API
function fetchWord(word) {
  // encodeURI converts the word to a url safe version.
  const url =
    "https://api.dictionaryapi.dev/api/v2/entries/en/" +
    encodeURIComponent(word);
  // response is the parameter it can be any word
  return fetch(url).then((response) => {
    // response.status is a number (like 200, 404, 500)
    // 404 means the word does not exist in the dictionary
    if (response.status === 404) {
      // It is actually better to use throw rather than return as return will just return back a normal value while throw stops the function immediately and jumps to .catch()
      throw new Error("not found");
    }
    // response.ok is true for status codes 200-299 (success range)
    // If it's not OK, something went wrong on the server
    if (!response.ok) {
      throw new Error("network");
    }
    // response.json() will read the response body and parses it from
    // JSON text into a real JavaScript object/array so it can be better manipulated instead of being strings.
    // It will also return a Promise, so it will return it to chain to the next .then()
    return response.json();
  });
}
// The API looks like word:eg "car", phonetic:"ka:r/", meanings[...]. So its a good idea to convert to object for easier manipulation like
// COMMIT 5: DISPLAY THE WORD DATA

function displayWord(data) {
  // Guard clause: if the data is not an array or is empty, show an error. The array is from the json.
  if (!Array.isArray(data) || data.length === 0) {
    showError(
      "Something went wrong while loading the definition. Please try again.",
    );
    return;
  }

  const entry = data[0];

  // Store the word and phonetic for the favorites feature
  currentWord = entry.word || "";
  currentPhonetic = entry.phonetic || "";

  // To loop through the phonetic arrays incase one has nothing. To ensure we display those that have sth and if nothing remain blank.
  if (!currentPhonetic && entry.phonetics && entry.phonetics.length > 0) {
    for (let i = 0; i < entry.phonetics.length; i++) {
      if (entry.phonetics[i].text) {
        currentPhonetic = entry.phonetics[i].text;
        break; // Stop the loop once we find the first one
      }
    }
  }

  // Show the word title
  searchedWords.textContent = currentWord;

  // Show the phonetic text (or nothing if missing)
  pronunciationText.textContent = currentPhonetic || "";

  // ===== AUDIO BUTTON =====
  // It will loop through the phonetics array to find the first audio URL. But some phonetics have an empty string for audio so skip.
  let audioUrl = "";
  if (entry.phonetics && Array.isArray(entry.phonetics)) {
    for (let i = 0; i < entry.phonetics.length; i++) {
      if (entry.phonetics[i].audio && entry.phonetics[i].audio.trim() !== "") {
        audioUrl = entry.phonetics[i].audio;
        break;
      }
    }
  }

  audioControl.innerHTML = "";
  if (audioUrl) {
    const playBtn = document.createElement("button");
    playBtn.id = "play-audio";
    playBtn.textContent = "Play Audio";
    playBtn.onclick = () => {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        showError("Could not play audio.");
      });
    };
    audioControl.appendChild(playBtn);
  }

  // ===== MEANINGS =====
  // The API groups definitions by "part of speech" (noun, verb, adjective, etc.)
  // Each "meaning" object has: partOfSpeech, definitions[], synonyms[]
  // Each "definition" object has: definition, example, synonyms[]
  meaningsDiv.innerHTML = "";
  definitionsDiv.innerHTML = "";
  examplesDiv.innerHTML = "";
  synonymsDiv.innerHTML = "";

  if (entry.meanings && entry.meanings.length > 0) {
    for (let m = 0; m < entry.meanings.length; m++) {
      const meaning = entry.meanings[m];

      // Create a container for this part of speech
      const block = document.createElement("div");
      block.className = "meaning-block";

      // Part of speech heading (e.g., "noun", "verb", "interjection")
      const pos = document.createElement("h3");
      pos.className = "part-of-speech";
      pos.textContent = meaning.partOfSpeech || "unknown";
      block.appendChild(pos);

      meaningsDiv.appendChild(block);

      // Definitions list
      if (meaning.definitions && meaning.definitions.length > 0) {
        const ol = document.createElement("ol");
        ol.style.paddingLeft = "20px";

        for (let d = 0; d < meaning.definitions.length; d++) {
          const def = meaning.definitions[d];

          const li = document.createElement("li");
          li.className = "definition-item";

          // Definition text
          const defText = document.createElement("p");
          defText.className = "definition-text";
          defText.textContent = def.definition;
          li.appendChild(defText);

          ol.appendChild(li);
        }

        definitionsDiv.appendChild(ol);
      }

      // Examples
      if (meaning.definitions) {
        for (let d = 0; d < meaning.definitions.length; d++) {
          if (meaning.definitions[d].example) {
            const ex = document.createElement("p");
            ex.className = "example-text";
            ex.textContent =
              'Example: "' + meaning.definitions[d].example + '"';
            examplesDiv.appendChild(ex);
          }
        }
      }

      // ===== SYNONYMS =====
      // The synonyms in this api exist in two states:
      //   1. meaning.synonyms (synonyms for the whole part of speech)
      //   2. meaning.definitions[d].synonyms (synonyms for each definition)
      // I should collect all of them but also remove the duplicates.
      const allSynonyms = [];

      // Collect from meaning.synonyms
      if (meaning.synonyms && Array.isArray(meaning.synonyms)) {
        for (let s = 0; s < meaning.synonyms.length; s++) {
          allSynonyms.push(meaning.synonyms[s]);
        }
      }

      // Collect from meanimg.definition
      if (meaning.definitions) {
        for (let d = 0; d < meaning.definitions.length; d++) {
          if (
            meaning.definitions[d].synonyms &&
            Array.isArray(meaning.definitions[d].synonyms)
          ) {
            for (let s = 0; s < meaning.definitions[d].synonyms.length; s++) {
              allSynonyms.push(meaning.definitions[d].synonyms[s]);
            }
          }
        }
      }

      // Remove duplicates using a Set
      const uniqueSynonyms = [...new Set(allSynonyms)];
      // A Set is like an array but only stores unique values. It will ensure no duplication of values
      if (uniqueSynonyms.length > 0) {
        const synP = document.createElement("p");
        synP.className = "synonyms-text";
        synP.innerHTML =
          "<strong>Synonyms:</strong> " + uniqueSynonyms.join(", ");
        // i have used innerhtml instead of .textcontent as i want synonyms to be bold seperately and i dont want to create too many ids. .join is a good array method that will take in all items and join them synonyms and the uniqueSynonys array.
        synonymsDiv.appendChild(synP);
      }
    }
  }

  // ===== SOURCE LINK =====
  sourceLink.innerHTML = "";
  if (entry.sourceUrls && entry.sourceUrls.length > 0) {
    const link = document.createElement("a");
    link.href = entry.sourceUrls[0];
    link.target = "_blank";
    link.textContent = "View Source";
    sourceLink.appendChild(link);
  }

  // ===== FAVORITE BUTTON =====
  // Check if this word is already saved, if not create i will create save button and style it.
  if (isFavourite(currentWord)) {
    favouriteBtn.textContent = "Saved";
    favouriteBtn.className = "saved";
  } else {
    favouriteBtn.textContent = "Save Word";
    favouriteBtn.className = "";
  }

  // When the button is clicked, toggle this word in favorites
  favouriteBtn.onclick = () => {
    toggleFavourite(currentWord, currentPhonetic);
  };

  // Show the results section (it starts hidden in CSS)
  resultsSection.classList.add("visible");
}

// COMMIT 6: FAVORITES FUNCTIONS (localStorage)
//Local storage only stores key-value pairs as strings.
//  So since localStorage can ONLY store strings. remeber to use the following.
//   JSON.stringify(object) converts an object/array into a JSON string.
//   JSON.parse(string) converts a JSON string back into an object/array.
//   I should also use a key "wordly_favourites".

// ----- getFavourites() -----
// Reads the saved favorites from localStorage.
// Returns an array of objects, or an empty array if nothing is saved.
function getFavourites() {
  // localStorage.getItem("key") reads the value for that key.If the key doesn't exist, it returns null
  const stored = localStorage.getItem("wordly_favourites");

  if (stored) {
    try {
      return JSON.parse(stored);
      // stored is a string. JSON.parse converts it back to a real JavaScript array
    } catch (e) {
      return [];
      // If the stored string is corrupted (not valid JSON),JSON.parse will throw an error. I catch it and IT should return an empty array.
    }
  }

  return [];
  // if nothing has been saved yet
}

// ----- saveFavourites() -----
// Saves the favorites array to localStorage.
function saveFavourites(favourites) {
  localStorage.setItem("wordly_favourites", JSON.stringify(favourites));
}

// ----- isFavourite() -----
// Checks if a word is already in the favorites list.
function isFavourite(word) {
  const favourites = getFavourites();

  for (let i = 0; i < favourites.length; i++) {
    if (favourites[i].word.toLowerCase() === word.toLowerCase()) {
      return true; // Found it!
    }
  }

  return false; // Not found
}

// ----- toggleFavourite() -----
// Adds a word to favorites if it's not there, or removes it if it is.
function toggleFavourite(word, phonetic) {
  const favourites = getFavourites();
  let index = -1;

  // Find the position of this word in the array
  for (let i = 0; i < favourites.length; i++) {
    if (favourites[i].word.toLowerCase() === word.toLowerCase()) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    favourites.splice(index, 1);
    // Word is already saved → remove it.array.splice(index, 1) removes 1 item at the given index
    favouriteBtn.textContent = "Save Word";
    favouriteBtn.className = "";
  } else {
    favourites.push({ word: word, phonetic: phonetic || "" });
    // Word is not saved → add it, array.push(item) adds an item to the end of the array
    favouriteBtn.textContent = "Saved";
    favouriteBtn.className = "saved";
  }

  // Save the updated array back to localStorage
  saveFavourites(favourites);

  // Re-render the favorites list on the page
  showFavourites();
}

// ----- removeFavourite() -----
// Removes a word from favorites (called when clicking the Remove button in the favorites list)
function removeFavourite(word) {
  const favourites = getFavourites();
  const newFavourites = [];

  for (let i = 0; i < favourites.length; i++) {
    if (favourites[i].word.toLowerCase() !== word.toLowerCase()) {
      newFavourites.push(favourites[i]);
    }
  }
  // Build a new array that excludes the word we want to remove
  saveFavourites(newFavourites);
  showFavourites();

  if (currentWord.toLowerCase() === word.toLowerCase()) {
    favouriteBtn.textContent = "Save Word";
    favouriteBtn.className = "";
    // If the removed word is currently displayed, update its Save button
  }
}

// ----- showFavourites() -----
// Reads the favorites from localStorage and builds the HTML to display them.
// Each favorite item should have a clickable word (to search again) and a Remove button.
function showFavourites() {
  const favourites = getFavourites();

  favouriteContainer.innerHTML = "";
  // Clears the container first

  if (favourites.length === 0) {
    const emptyP = document.createElement("p");
    emptyP.className = "empty-state";
    emptyP.textContent = "No favourite word saved yet!";
    favouriteContainer.appendChild(emptyP);
    return;
    // If no favorites, show the empty state message
  }

  for (let i = 0; i < favourites.length; i++) {
    const fav = favourites[i];

    const item = document.createElement("div");
    item.className = "favourite-item";
    // Build each favorite item using createElement

    const wordSpan = document.createElement("span");
    wordSpan.className = "fav-word";
    wordSpan.textContent = fav.word;
    wordSpan.onclick = () => {
      inputText.value = fav.word;
      form.dispatchEvent(new Event("submit"));
    };
    item.appendChild(wordSpan);
    // Word span (clickable to search again)

    if (fav.phonetic) {
      const phoneticSpan = document.createElement("span");
      phoneticSpan.className = "fav-phonetic";
      phoneticSpan.textContent = fav.phonetic;
      item.appendChild(phoneticSpan);
      // Phonetic span (if available)
    }

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      removeFavourite(fav.word);
    };
    item.appendChild(removeBtn);

    favouriteContainer.appendChild(item);
    // Remove button
  }
}

// COMMIT 7: HELPER / UTILITY FUNCTIONS

// ----- showError() -----
// Displays an error message in the error box and should hide loading???
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessageDiv.classList.add("visible");
  messageDiv.classList.remove("visible");
}

// ----- clearError() -----
// Hides the error box and clears its text.
function clearError() {
  errorMessage.textContent = "";
  errorMessageDiv.classList.remove("visible");
}

// ----- setLoading() -----


// ----- clearResults() -----
function clearResults() {
  searchedWords.textContent = "";
  pronunciationText.textContent = "";
  audioControl.innerHTML = "";
  meaningsDiv.innerHTML = "";
  definitionsDiv.innerHTML = "";
  examplesDiv.innerHTML = "";
  synonymsDiv.innerHTML = "";
  sourceLink.innerHTML = "";
  favouriteBtn.textContent = "";
  favouriteBtn.className = "";
  favouriteBtn.onclick = null;
  resultsSection.classList.remove("visible");
  currentWord = "";
  currentPhonetic = "";
  // Resets all result areas to empty and hides the results section.
  // Also resets the current word variables.
}
