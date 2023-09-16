// Selecciona elementos HTML por su atributo 
const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');

// Objeto que mapea tipos de Pokémon a colores
const typeColors = {
    electric: '#FFEA70',   // Amarillo para tipo eléctrico
    normal: '#B09398',    // Gris para tipo normal
    fire: '#FF675C',      // Rojo para tipo fuego
    water: '#0596C7',     // Azul para tipo agua
    ice: '#AFEAFD',       // Celeste para tipo hielo
    rock: '#999799',      // Gris para tipo roca
    flying: '#7AE7C7',   // Verde claro para tipo volador
    grass: '#4A9681',    // Verde para tipo planta
    psychic: '#FFC6D9',  // Rosa para tipo psíquico
    ghost: '#561D25',    // Rojo oscuro para tipo fantasma
    bug: '#A2FAA3',      // Verde claro para tipo bicho
    poison: '#795663',   // Morado para tipo veneno
    ground: '#D2B074',   // Marrón para tipo tierra
    dragon: '#DA627D',   // Rojo para tipo dragón
    steel: '#1D8A99',    // Azul verdoso para tipo acero
    fighting: '#2F2F2F', // Gris oscuro para tipo lucha
    default: '#2A1A1F',  // Negro para el tipo por defecto
};

// Array para almacenar el historial de pokémons consultados
const pokemonHistory = [];

// Función para actualizar el historial de pokémons consultados
const updatePokemonHistory = () => {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    for (const name of pokemonHistory) { 
        const listItem = document.createElement('li'); 
        listItem.textContent = name; 
        historyList.appendChild(listItem); 
    }
}

updatePokemonHistory();

// Función para buscar un pokémon
const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target.pokemon;
    if (value.trim() === '') { 
        renderNotFound(); 
        return; 
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => {
            pokemonHistory.push(response.name); 
            updatePokemonHistory(); 
            renderPokemonData(response); 
        })
        .catch(() => renderNotFound()); 
}

// Esta función se encarga de renderizar los datos de un Pokémon en la tarjeta.
const renderPokemonData = data => {
    
    const sprite =  data.sprites.front_default;
   
    const { stats, types } = data;
    pokeName.textContent = data.name;
    pokeImg.setAttribute('src', sprite);
    pokeId.textContent = `Nº ${data.id}`;
    
    setCardColor(types);
    
    renderPokemonTypes(types);
    renderPokemonStats(stats);
}

// Esta función establece el color de fondo de la tarjeta en función de los tipos del Pokémon.
const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokeImg.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%`;
    pokeImg.style.backgroundSize = ' 5px 5px';
}

// Esta función renderiza los tipos del Pokémon en la tarjeta.
const renderPokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.color = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        pokeTypes.appendChild(typeTextElement);
    });
}

// Esta función renderiza las estadísticas del Pokémon en la tarjeta.
const renderPokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

// Esta función se ejecuta cuando no se encuentra ningún Pokémon con el nombre o número ingresado.
const renderNotFound = () => {
    pokeName.textContent = 'No encontrado';
    pokeImg.setAttribute('src', 'images/shadow.png')
    pokeImg.style.background =  '#fff';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
}
