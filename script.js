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
    const historyList = document.getElementById('history-list'); // Obtiene la lista del historial
    historyList.innerHTML = ''; // Limpia la lista

    for (const name of pokemonHistory) { // Recorre el historial y agrega cada nombre a la lista
        const listItem = document.createElement('li'); // Crea un elemento de lista
        listItem.textContent = name; // Establece el contenido de texto con el nombre del pokémon
        historyList.appendChild(listItem); // Agrega el elemento de lista a la lista
    }
}

updatePokemonHistory(); // Llama a la función para mostrar el historial inicial

// Función para buscar un pokémon
const searchPokemon = event => {
    event.preventDefault(); // Evita el envío del formulario
    const { value } = event.target.pokemon; // Obtiene el valor ingresado en el campo de entrada
    if (value.trim() === '') { // Verifica si el valor está vacío
        renderNotFound(); // Llama a la función para mostrar "No encontrado"
        return; // Sale de la función
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => {
            pokemonHistory.push(response.name); // Agrega el nombre del pokémon al historial
            updatePokemonHistory(); // Actualiza el historial
            renderPokemonData(response); // Llama a la función para mostrar los datos del pokémon
        })
        .catch(() => renderNotFound()); // En caso de error, llama a la función para mostrar "No encontrado"
}

// Esta función se encarga de renderizar los datos de un Pokémon en la tarjeta.
const renderPokemonData = data => {
    // Obtiene la URL de la imagen frontal del Pokémon.
    const sprite =  data.sprites.front_default;
    // Extrae las estadísticas y tipos del Pokémon desde los datos recibidos.
    const { stats, types } = data;

    // Establece el nombre del Pokémon en la tarjeta.
    pokeName.textContent = data.name;
    // Establece la imagen del Pokémon en la tarjeta.
    pokeImg.setAttribute('src', sprite);
    // Establece el número de identificación del Pokémon en la tarjeta.
    pokeId.textContent = `Nº ${data.id}`;
    
    // Llama a la función setCardColor para establecer el color de fondo de la tarjeta
    // basado en los tipos del Pokémon.
    setCardColor(types);
    
    // Llama a las funciones renderPokemonTypes y renderPokemonStats para mostrar los
    // tipos y estadísticas del Pokémon en la tarjeta.
    renderPokemonTypes(types);
    renderPokemonStats(stats);
}

// Esta función establece el color de fondo de la tarjeta en función de los tipos del Pokémon.
const setCardColor = types => {
    // Obtiene el color correspondiente al primer tipo del Pokémon desde typeColors.
    const colorOne = typeColors[types[0].type.name];
    // Si el Pokémon tiene un segundo tipo, obtiene el color correspondiente;
    // de lo contrario, usa el color predeterminado.
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    
    // Aplica un fondo degradado en la imagen del Pokémon con los colores obtenidos.
    pokeImg.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
    // Establece el tamaño del fondo del degradado en la imagen.
    pokeImg.style.backgroundSize = ' 5px 5px';
}

// Esta función renderiza los tipos del Pokémon en la tarjeta.
const renderPokemonTypes = types => {
    // Limpia el contenido actual de la sección de tipos en la tarjeta.
    pokeTypes.innerHTML = '';
    // Itera a través de los tipos del Pokémon y crea un elemento div para cada uno.
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        // Establece el color del tipo en función del tipo del Pokémon.
        typeTextElement.style.color = typeColors[type.type.name];
        // Establece el texto del tipo y lo agrega como hijo al contenedor de tipos.
        typeTextElement.textContent = type.type.name;
        pokeTypes.appendChild(typeTextElement);
    });
}

// Esta función renderiza las estadísticas del Pokémon en la tarjeta.
const renderPokemonStats = stats => {
    // Limpia el contenido actual de la sección de estadísticas en la tarjeta.
    pokeStats.innerHTML = '';
    // Itera a través de las estadísticas del Pokémon y crea elementos div para cada una.
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        
        // Establece el nombre de la estadística y la cantidad base como texto.
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        
        // Agrega los elementos de nombre y cantidad como hijos al contenedor de estadísticas.
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

// Esta función se ejecuta cuando no se encuentra ningún Pokémon con el nombre o número ingresado.
const renderNotFound = () => {
    // Establece el nombre en "No encontrado".
    pokeName.textContent = 'No encontrado';
    // Establece una imagen de sombra en la tarjeta.
    pokeImg.setAttribute('src', 'images/shadow.png');
    // Establece el fondo de la imagen de Pokémon en blanco.
    pokeImg.style.background =  '#fff';
    // Limpia las secciones de tipos, estadísticas e ID en la tarjeta.
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
}
