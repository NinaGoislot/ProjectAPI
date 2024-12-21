console.log("Script bien chargé");

// ---------- URL SETTINGS ---------
const PROTOCOLE_API = `https`;
const URL_API = `pokeapi.co/api/v2`;

const BASE_AUDIO_URL = 'https://pokemoncries.com/cries';

// ---------- GLOBAL CONST ---------
const PROBA_SHINY = 0.05; //En %

const GameType = {
    GUESS_SOUND: 1,
    GUESS_SHADOW: 2,
};

//Déclarations
let pkmSprite;
let pkmAngName;
let pkmFrName;

// --------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- GET DATA --------------------------------------------------

async function getRandomPokemonSprite() {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Entre 1 et 1010 (nombre de Pokémons dans PokéAPI)
    const url = `${PROTOCOLE_API}://${URL_API}/pokemon/${randomId}`;
    const isShiny = Math.random() < PROBA_SHINY;

    //Fetch
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(` Error :( || Status: ${response.status}`);

        const data = await response.json();

        // ----------- Get Name -----------
        pkmAngName = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Première lettre en maj

        // ---------- Get Sprite ----------
        pkmSprite = isShiny ? data.sprites.front_shiny : data.sprites.front_default;

        // -------- Load sprite --------
        // const spriteImage = `<img src="${pkmSprite}" alt="Sprite du pokémon ${pkmAngName}" title="${pkmAngName}" />`;
        // const shinyLabel = isShiny ? `<p>✨ WAOUW ! Shiny ${pkmAngName}! ✨</p>` : `<p>${pkmAngName}</p>`;

        // document.getElementById("sprite-pkm").innerHTML = shinyLabel + spriteImage;

        const imgSprite = document.getElementById("game-sprite-pkm");
        imgSprite.src = `${pkmSprite}`;

        // -------- Set Input Value --------
        const inputElement = document.getElementById("pkm-name-answer");
        inputElement.value = pkmAngName;

        // -------- Load and Play Sound --------
        const audioElement = document.getElementById("audio-pkm");
        audioElement.src = `${BASE_AUDIO_URL}/${randomId}.mp3`;
        audioElement.play();

        // -------- Display item --------
        audioElement.classList.toggle("active");

        console.log("Pokémon recu : " + pkmAngName);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- VERIF GAME -------------------------------------------------
function checkPkmName(){
    const userGuess = document.getElementById("pkm-name").value.trim().toLowerCase();
    const correctAnswer = document.getElementById("pkm-name-answer").value.trim().toLowerCase();

    if (userGuess === correctAnswer) {
        alert("C'est le bon Pokémon !");
    } else {
        alert("Raté ! Ce n'est pas le bon Pokémon.");
    }

}

// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- EVENTS LISTENERS ----------------------------------------------

document.getElementById("generate-pkm").addEventListener("click", getRandomPokemonSprite);
document.getElementById("check-pkm-name").addEventListener("click", checkPkmName);