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
