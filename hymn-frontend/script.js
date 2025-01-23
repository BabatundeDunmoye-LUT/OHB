let hymns = [];

// Fetch hymns from the backend
async function fetchHymns(query = '') {
  console.log(`Fetching hymns for query: ${query}`);
  try {
    const response = await fetch(`https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const hymns = await response.json();
    console.log('Hymns fetched:', hymns);
    renderHymns(hymns);
  } catch (error) {
    console.error('Error during fetch:', error);
    alert('Error fetching hymns. Please try again later.');
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

  // Split the lyrics by line breaks and process them
  const formattedLyrics = hymn.lyrics
    .split('\n') // Split into lines
    .map(line => {
      if (line.startsWith('Verse')) {
        return `<p><strong>${line}</strong></p>`; // Add bold formatting for verses
      } else if (line.startsWith('Chorus')) {
        return `<p><strong>${line}</strong></p>`; // Add bold formatting for chorus
      } else if (line.trim() === '') {
        return '<br>'; // Add an empty line for spacing
      } else {
        return `<p>${line}</p>`; // Wrap normal lines in <p> tags
      }
    })
    .join(''); // Join without adding additional <br> since <p> adds spacing

  document.getElementById('hymnLyrics').innerHTML = formattedLyrics;
  document.getElementById('lyricsDisplay').style.display = 'block';
}




// Filter hymns by search query
async function searchHymns() {
  const query = document.getElementById('search').value.trim();
  console.log('Search query:', query);

  try {
    const response = await fetch(`https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}`); // Use backticks for template literals
    console.log('Request URL:', `https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch hymns: ${response.statusText}`);
    }

    const hymns = await response.json();
    console.log('Response data:', hymns);
    renderHymns(hymns);
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
  const query = document.getElementById('search').value.trim();
  console.log(`Search initiated for: ${query}`);
  console.log('Search button clicked');
  fetchHymns(query);
});

// Fetch hymns on page load
fetchHymns();
