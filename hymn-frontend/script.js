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
  const query = document.getElementById('search').value;
  try {
    const response = await fetch('https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}');
    if (!response.ok) {
      throw new Error('Failed to fetch hymns');
    }
    const filteredHymns = await response.json();
    renderHymns(filteredHymns);
  } catch (error) {
    console.error('Error during search:', error);
    alert('Unable to fetch search results. Please try again later.');
  }
}

document.getElementById('search').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchHymns();
  }
});


// Fetch hymns on page load
fetchHymns();
