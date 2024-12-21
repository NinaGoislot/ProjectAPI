console.log("Script bien chargé");

// ---------- URL SETTINGS ---------
const PROTOCOLE_API = `https`;
const URL_API = `pokeapi.co/api/v2`;

const BASE_AUDIO_URL = 'https://pokemoncries.com/cries';

// ---------- GLOBAL CONST ---------
const NB_POKEMON = 721; //jusqu'à la 6gen
const PROBA_SHINY_SHADOW = 0.05; //En %
const PROBA_SHINY_SOUND = 1; //En %

const GameType = {
    GUESS_SOUND: 1,
    GUESS_SHADOW: 2,
};

//Déclarations
let pkmSprite;
let pkmAngName;
let pkmFrName;

let currentGameType = GameType.GUESS_SOUND;

// --------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- GET DATA --------------------------------------------------

async function getRandomPokemonData() {
    const randomId = Math.floor(Math.random() * NB_POKEMON) + 1; // Entre 1 et 1010 (nombre de Pokémons dans PokéAPI)
    const url = `${PROTOCOLE_API}://${URL_API}/pokemon/${randomId}`;
    const isShiny = checkIfShiny();

    //Fetch
    try {
        // ---------------------------------------
        // ----------- GET POKEMON DATA ----------
        // ---------------------------------------
        const response = await fetch(url);
        if (!response.ok) throw new Error(` Error :( || Status: ${response.status}`);
        const data = await response.json();

        // ---------------------------------------
        // ----------- GET SPECIES DATA ----------
        // ---------------------------------------
        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        if (!speciesResponse.ok) throw new Error(`Error :( || Status: ${speciesResponse.status}`);
        const speciesData = await speciesResponse.json();

        // ---------------------------------------
        // --------------- USE DATA --------------
        // ---------------------------------------

        // ----------- Get Name -----------
        pkmAngName = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Première lettre en maj
        pkmFrName = speciesData.names.find(nameEntry => nameEntry.language.name === "fr").name;

        // ---------- Get Sprite ----------
        pkmSprite = isShiny ? data.sprites.front_shiny : data.sprites.front_default;

        // -------- Load sprite --------
        const shinyLabel = isShiny ? `<p>✨ WAOUW ! Shiny ${pkmAngName}! ✨</p>` : `<p>${pkmAngName}</p>`;

        const imgSprite = document.getElementById("game-sprite-pkm");
        imgSprite.src = `${pkmSprite}`;

        // -------- Set Input Value --------
        // const inputElement = document.getElementById("pkm-name-answer");
        // inputElement.value = pkmAngName;

        // ------------- Items -------------
        const audioElement = document.getElementById("audio-pkm");
        audioElement.src = `${BASE_AUDIO_URL}/${randomId}.mp3`;
        const spriteElement = document.getElementById("game-sprite-pkm");

        // ------------------------------------
        // ----------- GAME DISPLAY -----------
        switch (currentGameType) {
            case 1: //Guess sound
                // -------- Load Sound --------
                audioElement.play();

                // -------- Display item --------
                spriteElement.classList.remove("active")
                audioElement.classList.add("active");
                break;
            case 2: //Guess shadow
                // -------- Load Filter ---------
                spriteElement.classList.add("shape");

                // -------- Display item --------
                audioElement.classList.remove("active");
                spriteElement.classList.add("active");
                break;
            default:
                break;
        };

        console.log("Pokémon recu : " + pkmFrName);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- VERIF GAME -------------------------------------------------
function checkPkmName() {
    const userGuess = document.getElementById("pkm-name-user").value.trim().toLowerCase();
    // const correctAnswer = document.getElementById("pkm-name-answer").value.trim().toLowerCase();

    if (userGuess === pkmAngName.toLowerCase() ||userGuess === pkmFrName.toLowerCase() ) {
        alert("C'est le bon Pokémon !");
    } else {
        alert("Raté ! Ce n'est pas le bon Pokémon.");
    }

}

// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ SWITCH GAME -------------------------------------------------

function toggleGameType(event) {
    console.log("currentGameType : " + currentGameType);
    currentGameType = parseInt(event.target.value);
    const gameTypeText = currentGameType === GameType.GUESS_SOUND ?
        "Devine le cri" :
        "Devine la silhouette";
    document.getElementById("game-current-type").textContent = `Type de jeu actuel : ${gameTypeText}`;

    getRandomPokemonData();
}

// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- EVENTS LISTENERS ----------------------------------------------

document.getElementById("generate-pkm").addEventListener("click", getRandomPokemonData);
document.getElementById("check-pkm-name").addEventListener("click", checkPkmName);

document.getElementById("game-switch").addEventListener("change", toggleGameType);

// --------------------------------------------------------------------------------------------------------------
// ----------------------------------------------- OTHER FUNCTIONS ----------------------------------------------

function checkIfShiny() {
    switch (currentGameType) {
        case 1:
            return Math.random() < PROBA_SHINY_SOUND;
        case 2:
            return Math.random() < PROBA_SHINY_SHADOW;
        default:
            return false;
    };
}