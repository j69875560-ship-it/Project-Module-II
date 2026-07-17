# Wordly Dictionary SPA

It is a webpage that acts as a dictonary. It is a single page application so all tasks and operations are performened on one page.
In order to actually retreie words and their meanings it uses a public dictonary API that retreives the synonames, meanings, phonetics etc.

## Features

- Word search with real-time results
- Definitions grouped by part of speech
- Phonetic pronunciation text
- Audio pronunciation (when available)
- Example sentences (when available)
- Synonyms (when available)
- Favorites saved to localStorage
- Error handling for missing words and network issues
- Responsive design for mobile and desktop

## Technologies Used

- HTML
- CSS
- JavaScript
- [Free Dictionary API](https://dictionaryapi.dev/)
- localStorage

## Project Structure

```
wordly/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── index.js
├── assets/
└── README.md
```

## How to Run

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` use Live Server.
4. Type a word in the search box and click **Search**.
or
1. Copy the link to the webpage and access it from there.[https://j69875560-ship-it.github.io/Project-Module-II/]

## API Information

This app uses the **Free Dictionary API**.

Endpoint format:
```
https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

The API returns meanings, pronunciation, audio, examples, synonyms, and source URLs when available.

## Usage

1. Enter a word in the search field.
2. Click **Search**.
3. View the definition, pronunciation, and other details.
4. Click **Play Audio** to hear the pronunciation (if available).
5. Click **Save Word** to add it to your favorites.
6. Click a saved word in the Favorites section to search it again.
7. Click **Remove** to delete a word from favorites.

## Screenshots

![Search Page](./assets/First-slide.jpg)

## links and final sections
1. Live Demo: [https://j69875560-ship-it.github.io/Project-Module-II/]
2. GitHub repository URL: [https://github.com/j69875560-ship-it/Project-Module-II]
3. Limitations: 
I. There is a lack of audio,synmonames etc on some words.
II. This dictionary is only coded for english word so words in other languages will be unable to give results.
III. Not all browsers can support the audio playback.
## Author-Name
 Gitonga Johncarlos Mwenda.

## Lisence
This project is for a learning purposes and is a project from Moringa School.
