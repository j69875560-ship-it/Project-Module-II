# Wordly Dictionary SPA

A simple single-page dictionary application that lets you search for English words, view definitions, hear pronunciations, and save your favorite words.

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

- HTML5
- CSS3
- JavaScript (vanilla)
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
3. Open `index.html` in your browser, or use Live Server.
4. Type a word in the search box and click **Search**.

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

## Known Limitations

- Some words may lack audio, examples, or synonyms.
- Only English words are supported.
- Audio playback depends on browser support.

## Author
    Gitonga Johncarlos Mwenda

## License

This project is for a learning purposes and is a project from Moringa School.
