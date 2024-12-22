console.log("Script bien chargé");

// ---------- URL SETTINGS ---------
const PROTOCOLE_API = `https`;
const URL_API = `pokeapi.co/api/v2`;

const BASE_AUDIO_URL = `${PROTOCOLE_API}://pokemoncries.com/cries`;

// ---------- GLOBAL CONST ---------
const CURRENT_PLAYER_KEY = "currentPlayer";
const ALL_PLAYERS_KEY = "players";
const NB_POKEMON = 721; //jusqu'à la 6gen
const PROBA_SHINY_SHADOW = 0.5; //En %
const PROBA_SHINY_SOUND = 20; //En %

const GameType = {
    GUESS_SOUND: 1,
    GUESS_SHADOW: 2,
};

//Déclarations
let pkmSprite;
let pkmAllSprites;
let pkmAngName;
let pkmFrName;
let pkmID;
let pkmTypes;

let randomValue;
let helped = false;
let newShinyValue = 0;

let currentGameType = GameType.GUESS_SOUND;

// --------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- GET DATA --------------------------------------------------
// --------------------------------------------------------------------------------------------------------------


async function getRandomPokemonData() {
    pkmID = Math.floor(Math.random() * NB_POKEMON) + 1;
    helped = false;
    const url = `${PROTOCOLE_API}://${URL_API}/pokemon/${pkmID}`;

    randomValue = Math.random() * 100;

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
        // pkmSprite = isShiny ? data.sprites.front_shiny : data.sprites.front_default;
        pkmAllSprites = data.sprites;
        pkmSprite = pkmAllSprites.front_default;

        // -------- Load sprite --------
        const imgSprite = document.getElementById("game-sprite-pkm");
        imgSprite.src = `${pkmSprite}`;

        // -------- Set Input Value --------
        // const inputElement = document.getElementById("pkm-name-answer");
        // inputElement.value = pkmAngName;

        // ---------------------------------------
        // ------------- HELP BUTTONS ------------
        // ---------------------------------------
        const helpContainer = document.getElementById('help-container'); // Assurez-vous que cet élément existe
        helpContainer.innerHTML = '';
        const helpElements = document.querySelectorAll(".game-controls-help");
        helpElements.forEach(helpElement => {
            helpElement.classList.add("active");
        });


        // ---------- Other items ----------
        const inputUserElement = document.getElementById("game-pkm-name-try");
        inputUserElement.classList.add("active");

        document.getElementById("pkm-name-answer").innerText = '';

        const audioElement = document.getElementById("audio-pkm");
        audioElement.src = `${BASE_AUDIO_URL}/${pkmID}.mp3`;
        const spriteElement = document.getElementById("game-sprite-pkm");

        // ------------------------------------
        // ------------ GET TYPES -------------
        // ------------------------------------

        pkmTypes = data.types.map(typeEntry => typeEntry.type.name);
        console.log("Types du Pokémon : " + pkmTypes.join(", "));

        // ------------------------------------
        // ----------- GAME DISPLAY -----------
        // ------------------------------------
        switch (currentGameType) {
            case 1: //Guess sound
                // -------- Load Sound --------
                audioElement.play();

                // -------- Display item --------
                spriteElement.classList.remove("active")
                audioElement.classList.add("active");
                break;
            case 2: //Guess shadpe
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
// --------------------------------------------------------------------------------------------------------------

function checkPkmName() {
    const isShiny = checkIfShiny();
    const userGuess = document.getElementById("pkm-name-user").value.trim().toLowerCase();
    // const correctAnswer = document.getElementById("pkm-name-answer").value.trim().toLowerCase();

    if (userGuess === pkmAngName.toLowerCase() || userGuess === pkmFrName.toLowerCase()) {
        const currentPlayerData = localStorage.getItem(CURRENT_PLAYER_KEY);
        let catchLabel = `Félications ! Vous obtenez un ${pkmFrName}.`;

        if (isShiny) {
            pkmSprite = pkmAllSprites.front_shiny;
            catchLabel = `✨ WAOUW ! Vous obtenez un ${pkmFrName} Shiny ! ✨`;
            const imgSprite = document.getElementById("game-sprite-pkm");
            imgSprite.src = `${pkmSprite}`;
        }


        if (currentPlayerData) {
            const currentPlayer = JSON.parse(currentPlayerData);
            let pokemonExists = currentPlayer.pokemons.some(pokemon => pokemon.id === pkmID);
            if (pokemonExists && isShiny) {
                pokemonExists = currentPlayer.pokemons.some(pokemon => pokemon.id === pkmID && pokemon.shiny === true); //si shiny, alors je l'ajoute même s'il existe déjà en version classique
            }

            if (!pokemonExists) {
                const newPokemon = {
                    id: pkmID,
                    name: pkmFrName,
                    sprite: pkmSprite,
                    shiny: isShiny,
                    favorite: false
                };

                currentPlayer.pokemons.push(newPokemon);

                localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(currentPlayer));

                const players = JSON.parse(localStorage.getItem(ALL_PLAYERS_KEY));
                const updatedPlayers = players.map(player =>
                    player.id === currentPlayer.id ? currentPlayer : player
                );
                localStorage.setItem(ALL_PLAYERS_KEY, JSON.stringify(updatedPlayers));
            } else {
                catchLabel = `Bravo, vous avez reconnu ${pkmFrName}.`;
            }
        } else {
            catchLabel = `Bravo, vous avez reconnu ${pkmFrName}.`;
        }

        endGame(catchLabel);
    } else {
        alert("Raté ! Ce n'est pas le bon Pokémon.");
    }

}

// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ SWITCH GAME -------------------------------------------------
// --------------------------------------------------------------------------------------------------------------


function toggleGameType(event) {
    const inputUserElement = document.getElementById("pkm-name-user");
    inputUserElement.value = '';

    console.log("currentGameType : " + currentGameType);
    currentGameType = parseInt(event.target.value);
    const gameTypeText = currentGameType === GameType.GUESS_SOUND ?
        "Devine le cri" :
        "Devine la silhouette";
    document.getElementById("game-current-type").textContent = `Type de jeu actuel : ${gameTypeText}`;

    getRandomPokemonData();
}

// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- HELP GAME --------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

function getTypeHelp() {
    // Désactiver boutons d'aide
    const helpElements = document.querySelectorAll(".game-controls-help");
    helpElements.forEach(helpElement => {
        helpElement.classList.remove("active");
    });

    if (!pkmTypes || pkmTypes.length === 0) {
        console.error("Les types du Pokémon ne sont pas disponibles.");
        return;
    }

    const helpContainer = document.getElementById('help-container');
    helpContainer.innerHTML = "";
    helpContainer.classList.add("active");

    const typesParagraph = document.createElement('p');
    typesParagraph.classList.add('game-help-type-p');

    // Séparer les types par des virgules
    typesParagraph.innerText = `Types du Pokémon : ${pkmTypes.join(', ')}`;

    helpContainer.appendChild(typesParagraph);

    // Change shiny value drop
    helped = true;
    switch (currentGameType) {
        case 1: //Guess sound
            newShinyValue = PROBA_SHINY_SOUND / 2;
            break;
        case 2: //Guess shadpe
            newShinyValue = PROBA_SHINY_SHADOW / 2;
            break;
        default:
            break;
    };
}

async function getSquareHelp() {
    try {
        const firstType = pkmTypes[0];

        // Get pokémons du même type
        const pokemonsWithSameType = await getPokemonByType(firstType);

        // En garder 3 (en fr) et ajouter le vrai
        const randomPokemons = await getRandomPokemons(pokemonsWithSameType, 3);
        randomPokemons.push(pkmFrName);

        // Mélanger les pkm
        const shuffledPokemons = shuffleArray(randomPokemons);

        // Add Buttons
        const helpContainer = document.getElementById('help-container');

        shuffledPokemons.forEach(pokemonName => {
            //create button
            const btn = document.createElement('button');
            btn.innerText = pokemonName;
            btn.classList.add('game-help-square-btn');

            // event listener
            btn.addEventListener('click', () => {
                const inputElement = document.getElementById('pkm-name-user');
                inputElement.value = pokemonName; // Donner la valeur du bouton à l'input de réponse de base
                checkPkmName();
            });

            // add btn to container
            helpContainer.classList.add("active");
            helpContainer.appendChild(btn);
        })

        // Désactiver boutons d'aide et l'input user
        const helpElements = document.querySelectorAll(".game-controls-help");
        helpElements.forEach(helpElement => {
            helpElement.classList.remove("active");
        });

        const guessGroupElement = document.getElementById("game-pkm-name-try");
        guessGroupElement.classList.remove("active")

        // Change shiny value drop
        helped = true;
        switch (currentGameType) {
            case 1: //Guess sound
                newShinyValue = PROBA_SHINY_SOUND / 4;
                break;
            case 2: //Guess shadpe
                newShinyValue = PROBA_SHINY_SHADOW / 4;
                break;
            default:
                break;
        };
    } catch (error) {
        console.error("Erreur dans getSquareHelp :", error);
    }
}

async function getPokemonByType(type) {
    const url = `${PROTOCOLE_API}://${URL_API}/type/${type}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur lors de la récupération des Pokémon pour le type ${type}`);
        const typeData = await response.json();

        return typeData.pokemon;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getPokemonNameInFrench(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl);
        if (!response.ok) throw new Error(`Erreur lors de la récupération du Pokémon à l'URL : ${pokemonUrl}`);
        const data = await response.json();

        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        if (!speciesResponse.ok) throw new Error(`Erreur lors de la récupération des données de l'espèce : ${speciesUrl}`);
        const speciesData = await speciesResponse.json();

        const frenchNameEntry = speciesData.names.find(nameEntry => nameEntry.language.name === "fr");
        return frenchNameEntry ? frenchNameEntry.name : data.name; // Nom anglais par défaut
    } catch (error) {
        console.error("Erreur dans getPokemonNameInFrench :", error);
        return "Nom inconnu";
    }
}


async function getRandomPokemons(pokemons, count) {
    try {
        const validPokemons = pokemons.filter(pokemon => pokemon && pokemon.pokemon && pokemon.pokemon.name);
        const shuffledPokemons = shuffleArray(validPokemons).slice(0, count);
        // Noms en français pour chaque Pokémon
        const pokemonNamesInFrench = await Promise.all(
            shuffledPokemons.map(pokemon => getPokemonNameInFrench(pokemon.pokemon.url))
        );
        return pokemonNamesInFrench;
    } catch (error) {
        console.error("Erreur dans getRandomPokemons :", error);
        return [];
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- EVENTS LISTENERS ----------------------------------------------
// --------------------------------------------------------------------------------------------------------------


document.getElementById("generate-pkm").addEventListener("click", getRandomPokemonData);
document.getElementById("check-pkm-name").addEventListener("click", checkPkmName);

document.getElementById("game-switch").addEventListener("change", toggleGameType);

// --------------------------------------------------------------------------------------------------------------
// ----------------------------------------------- OTHER FUNCTIONS ----------------------------------------------
// --------------------------------------------------------------------------------------------------------------


function checkIfShiny() {
    let valueToUse;
    switch (currentGameType) {
        case 1:
            valueToUse = helped ? newShinyValue : PROBA_SHINY_SOUND;
            console.log("taux de drop de shiny : " + valueToUse);
            return randomValue < valueToUse;
        case 2:
            valueToUse = helped ? newShinyValue : PROBA_SHINY_SHADOW;
            console.log("taux de drop de shiny : " + valueToUse);
            return randomValue < valueToUse;
        default:
            return false;
    };
}

function endGame(catchLabel) {
    const audioElement = document.getElementById("audio-pkm");
    const spriteElement = document.getElementById("game-sprite-pkm");
    const guessGroupElement = document.getElementById("game-pkm-name-try");
    const inputUserElement = document.getElementById("pkm-name-user");
    const textAfterCatch = document.getElementById("pkm-name-answer");
    const helpContainer = document.getElementById('help-container');

    spriteElement.classList.remove("shape");
    spriteElement.classList.add("active");
    audioElement.classList.add("active");
    guessGroupElement.classList.remove("active")
    helpContainer.classList.remove("active");


    inputUserElement.value = '';
    textAfterCatch.innerText = catchLabel;
}