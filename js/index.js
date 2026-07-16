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
// COMMIT 5: DISPLAY THE WORD DATA
// ============================================
// This function receives the data from the API and builds the HTML to
// show the user. The API returns an ARRAY (a list) of word entries.
// We use the first one: data[0].
//
// WHAT DOES THE API DATA LOOK LIKE?
//   The API returns an array where each item is an object like this:
//   {
//     word: "hello",
//     phonetic: "/həˈloʊ/",
//     phonetics: [
//       { text: "/həˈloʊ/", audio: "https://.../hello.mp3" },
//       { text: "/həˈləʊ/", audio: "" }
//     ],
//     meanings: [
//       {
//         partOfSpeech: "noun",
//         definitions: [
//           { definition: "A greeting.", example: "Hello, everyone.", synonyms: [] },
//           { definition: "Another meaning.", example: null, synonyms: ["hi"] }
//         ],
//         synonyms: ["greeting"]
//       }
//     ],
//     sourceUrls: ["https://en.wiktionary.org/wiki/hello"]
//   }
//
// IMPORTANT: Not every property is guaranteed to exist!
//   Some words have no audio. Some have no examples. Some have no synonyms.
//   We must check if each thing exists before using it.

function displayWord(data) {
  // Guard clause: if the data is not an array or is empty, show an error
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

  // The API sometimes puts the phonetic text inside a "phonetics" array
  // instead of the top-level "phonetic" field. We loop through the
  // phonetics array to find the first one that has text.
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
  // We loop through the phonetics array to find the first audio URL.
  // Some phonetics have an empty string for audio, so we skip those.
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
      // Synonyms can exist at TWO levels:
      //   1. meaning.synonyms (synonyms for the whole part of speech)
      //   2. meaning.definitions[d].synonyms (synonyms for each definition)
      // We collect ALL of them, then remove duplicates.
      const allSynonyms = [];

      // Collect from meaning-level
      if (meaning.synonyms && Array.isArray(meaning.synonyms)) {
        for (let s = 0; s < meaning.synonyms.length; s++) {
          allSynonyms.push(meaning.synonyms[s]);
        }
      }

      // Collect from definition-level
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
      // A Set is like an array but only stores unique values
      const uniqueSynonyms = [...new Set(allSynonyms)];

      if (uniqueSynonyms.length > 0) {
        const synP = document.createElement("p");
        synP.className = "synonyms-text";
        synP.innerHTML =
          "<strong>Synonyms:</strong> " + uniqueSynonyms.join(", ");
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
  // Check if this word is already saved, then set the button text and style
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

