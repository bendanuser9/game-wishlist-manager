    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn'); 
    const searchResults =document.getElementById('searchResults');
     //API for fetching game data
    const API_KEY = '7a18d8ab5ede47f0b0ab0450cbeaa6c0';
    const API_BASE = 'https://api.rawg.io/api'

    //load wishlist from local storage
    //JSON.parse converts stored string back into array
    let wishlist=JSON.parse(localStorage.getItem('gameWishlist')) || [];

    /**
     * displays search results as game cards in a grid
     * @param {Array} games 
     */
    function displayGames(games) {
        //checks if no games were found
    if (games.length === 0) {
        searchResults.innerHTML = '<p>No games found. Try a different search!</p>';
        return;
    }
    
    let html = '';
    
    //loop through each game and create HTML card
    games.forEach(game => {
        html += `
            <div class="game-card">
                <img src="${game.background_image}" alt="${game.name}">
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating}</p>
                <p>Released: ${game.released}</p>
                <button class="wishlist-btn" onclick="addToWishlist(${game.id}, '${game.name}')">
                    Add to Wishlist
            </div>
        `;
    });
    
    searchResults.innerHTML = html;
    }

    //wishlist management

    /**
     * 
     * @param {number} gameId game identifier   
     * @param {string} gameName name of the game
     */
    
    function addToWishlist(gameId, gameName) {
        //checks if game already exists in wishlist 
        const existingGame = wishlist.find(game => game.id === gameId);
        
        //if game exists, tells user and exits function
        if (existingGame) {
            alert('This game is already in your wishlist!');
            return;
        }
        
        //add game to wishlist array
        wishlist.push({
            id: gameId,
            name: gameName
        });
        
        //save updated wishlist to localstorage
        localStorage.setItem('gameWishlist', JSON.stringify(wishlist));

        //show success message after adding to wishlist
        alert(`${gameName} added to wishlist!`);
        console.log('Current wishlist:', wishlist);

        //update wishlist counter display
        updateWishlistCount();
    }

    //displays all games in the wishlist
    function displayWishlist() {
    const wishlistResults = document.getElementById('wishlistResults');

        //if wishlist is empty show message
        if (wishlist.length === 0) {
            wishlistResults.innerHTML = '<p>Your wishlist is empty. Search for games to add them!</p>';
            return;
        }
        
        let html = '';


        //loop through wishlist and create cards with remove button        
        wishlist.forEach(game => {
            html += `
                <div class="game-card">
                    <h3>${game.name}</h3>
                    <button class="wishlist-btn" onclick="removeFromWishlist(${game.id})">
                        Remove from Wishlist
                    </button>
                </div>
            `;
        });

        //display wishlist cards
        wishlistResults.innerHTML = html;
    }
    
    //updates wishlist counter in the navigation
    function updateWishlistCount() {
        wishlistCount.textContent = wishlist.length;
    }

    //removes a game from the wishlist
    function removeFromWishlist(gameId) {
        wishlist = wishlist.filter(game => game.id !== gameId);
        localStorage.setItem('gameWishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        displayWishlist();
    }
    
    //Navigation and tab switching
    //references to navigation elements
    const searchTab = document.getElementById('searchTab');
    const wishlistTab = document.getElementById('wishlistTab');
    const searchSection = document.getElementById('searchSection');
    const wishlistSection = document.getElementById('wishlistSection');
    const wishlistCount = document.getElementById('wishlistCount');
        //search tab on click
        searchTab.addEventListener('click', function() {
            //make search tab active
            searchTab.classList.add('active');
            wishlistTab.classList.remove('active');
            searchSection.classList.add('active');
            wishlistSection.classList.remove('active');
        });
        //wishlist tab is clicked
        wishlistTab.addEventListener('click', function() {
            //wishlist tab is active
            wishlistTab.classList.add('active');
            searchTab.classList.remove('active');
            wishlistSection.classList.add('active');
            searchSection.classList.remove('active');
            displayWishlist();
        });

    searchBtn.addEventListener('click', async function(){
    const searchTerm = searchInput.value;


        //check if search box is empty
        if (!searchTerm) {
            searchResults.innerHTML = '<p>Please enter a search term!</p>';
            return;
        }
        //show loading message while fetching 
        searchResults.innerHTML = '<p>Loading games...</p>';
        //API url with search query
        const url = `${API_BASE}/games?key=${API_KEY}&search=${searchTerm}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(data);
        //display game results
        displayGames(data.results);
    });
    //enter key now triggers search
    searchInput.addEventListener('keypress', function(e) {

        if (e.key === 'Enter'){
            searchBtn.click();
        }
    });
    //update wishlist counter on page load
    updateWishlistCount();

    //references for theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', function() {
        //get current theme
        const currentTheme = html.getAttribute('data-theme');
        //toggle between light and dark mode
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });


    /**
     * Updates the theme toggle button text
     * @param {string} theme - Current theme light or dark mode
     */
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    }
