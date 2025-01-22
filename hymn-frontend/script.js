let hymns = [];

// Fetch hymns from the backend
async function fetchHymns() {
  try {
    const response = await fetch('https://ohb.onrender.com/hymns'); // Update the URL if needed
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    hymns = await response.json();
    console.log('Fetched hymns:', hymns);
    renderHymns(hymns);
  } catch (error) {
    console.error('Error fetching hymns:', error.message);
  }
}


// Render hymn titles dynamically
function renderHymns(hymns) {
  console.log('Rendering hymns:', hymns);
  const hymnList = document.getElementById('hymnList');
  hymnList.innerHTML = '';
  hymns.forEach(hymn => {
    const li = document.createElement('li');
    li.textContent = hymn.title;
    li.onclick = () => showLyrics(hymn);
    hymnList.appendChild(li);
  });
}


// Display hymn lyrics
function showLyrics(hymn) {
  document.getElementById('hymnTitle').textContent = hymn.title;
  document.getElementById('hymnLyrics').textContent = hymn.lyrics;
  document.getElementById('lyricsDisplay').style.display = 'block';
}

// Filter hymns by search query
async function searchHymns() {
  const query = document.getElementById('search').value.trim();
  console.log('Search query:', query);

  try {
    const response = await fetch('https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}');
    console.log('Request URL:', 'https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}');

    if (!response.ok) {
      throw new Error(`Failed to fetch hymns: ${response.statusText}`);
    }

    const hymns = await response.json();
    console.log('Response data:', hymns);
    renderHymns(hymns); // Ensure this function updates the UI correctly
  } catch (error) {
    console.error('Error during search:', error);
    alert('Unable to fetch search results. Please try again later.');
  }
}


document.getElementById('search').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    console.log('Enter key pressed!');
    searchHymns();
  }
});


document.getElementById('search-btn').addEventListener('click', () => {
  console.log('Search button clicked!');
  searchHymns();
});

// Fetch hymns on page load
fetchHymns();
