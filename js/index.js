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
// WHAT IS AN API?
//   API stands for Application Programming Interface. Think of it like a
//   waiter at a restaurant. You (the app) place an order (send a request),
//   the waiter takes it to the kitchen (the server), and brings back your
//   food (the response/data). The Free Dictionary API is a free service
//   that gives us word definitions, pronunciations, examples, and more.
//
// WHAT IS fetch()?
//   fetch() is a built-in browser function that sends an HTTP request to
//   a URL and returns a "Promise". A Promise is like a promise in real
//   life - it says "I will give you the result later". We use .then()
//   to say "when you get the result, do this".
//
// WHAT IS encodeURIComponent()?
//   URLs can only contain certain characters. If a word has spaces or
//   special characters (like "hello world" or "cafe"), encodeURIComponent()
//   converts them to URL-safe versions (e.g., "hello%20world").
//
// HOW IT WORKS STEP BY STEP:
//   1. Build the URL by combining the API base URL with the word
//   2. Call fetch(url) to send the request
//   3. When the response comes back, check the status code:
//        - 404 = word not found
//        - anything else that's not OK = network/server error
//   4. If OK, convert the response body from JSON text to a JavaScript object
//   5. Return that object so the next .then() can use it

function fetchWord(word) {
  const url =
    "https://api.dictionaryapi.dev/api/v2/entries/en/" +
    encodeURIComponent(word);

  return fetch(url).then((response) => {
    // response.status is a number (like 200, 404, 500)
    // 404 means the word does not exist in the dictionary
    if (response.status === 404) {
      throw new Error("not found");
    }

    // response.ok is true for status codes 200-299 (success range)
    // If it's not OK, something went wrong on the server
    if (!response.ok) {
      throw new Error("network");
    }

    // response.json() reads the response body and parses it from
    // JSON text into a real JavaScript object/array.
    // It also returns a Promise, so we return it to chain to the next .then()
    return response.json();
  });
}