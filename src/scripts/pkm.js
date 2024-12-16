console.log("Script bien chargé");

const PROTOCOLE_API = `https`;
const URL_API = `pokeapi.co/api/v2`;

const PROBA_SHINY = 0.05; //En %

// --------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- GET DATA --------------------------------------------------

async function getRandomPokemonSprite() {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Entre 1 et 1010 (nombre de Pokémons dans PokéAPI)
    const url = `${PROTOCOLE_API}://${URL_API}/pokemon/${randomId}`;
    const isShiny = Math.random() < PROBA_SHINY;

    //Déclarations
    let pkmSprite;
    let pkmAngName;
    let pkmFrName;
    let pkmCry;

    //Fetch
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`:( Error! Status: ${response.status}`);

        const data = await response.json();

        //----------- More data -----------
        const speciesUrl = data.species.url;
        // const speciesResponse = await fetch(speciesUrl);
        // const speciesData = await speciesResponse.json();

        // const cryUrl = speciesData.url;
        // const cryResponse = await fetch(cryUrl);
        // const cryData = await cryResponse.json();

        // ---------- Get Sound ----------
        // pkmCry = cryData.sound;

        // ---------- Get Sprite ----------
        pkmSprite = isShiny ? data.sprites.front_shiny : data.sprites.front_default;

        // -------- Display sprite --------
        pkmAngName = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Première lettre en maj
        const spriteImage = `<img src="${pkmSprite}" alt="Sprite du pokémon ${pkmAngName}" title="${pkmAngName}" />`;
        const shinyLabel = isShiny ? `<p>✨ WAOUW ! Shiny ${pkmAngName}! ✨</p>` : `<p>${pkmAngName}</p>`;

        document.getElementById("pokemon-sprite").innerHTML = shinyLabel + spriteImage;

        console.log("Pokémon recu : " + pkmAngName);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}


// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- EVENTS LISTENERS ----------------------------------------------

document.getElementById("generate-pokemon").addEventListener("click", getRandomPokemonSprite);


// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- UI CHANGES -------------------------------------------------

