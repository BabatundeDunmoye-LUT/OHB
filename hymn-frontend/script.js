let hymns = [];

// Fetch hymns from the backend
async function fetchHymns(query = '') {
  try {
    const response = await fetch(`https://ohb.onrender.com/hymns?title=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const hymns = await response.json();
    console.log('Fetched hymns:', hymns);

    // Add line breaks if missing (fallback logic)

  hymns.forEach(hymn => {
    hymn.lyrics = hymn.lyrics
      .replace(/(Verse \d+|Chorus)/g, '\n$1\n') // Ensure line breaks for titles
      .replace(/(?:\. )/g, '.\n'); // Add line breaks after periods
  });

    renderHymns(hymns);
  } catch (error) {
    console.error('Error fetching hymns:', error);
    alert('Failed to fetch hymns. Please try again later.');
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

  const lyricsContainer = document.getElementById('hymnLyrics');
  lyricsContainer.innerHTML = ''; // Clear any previous lyrics

  // Split lyrics by line breaks and render each line
  hymn.lyrics.split('\n').forEach(line => {
    const lineElement = document.createElement('p'); // Create a <p> element for each line
    if (line.startsWith('Verse') || line.startsWith('Chorus')) {
      lineElement.innerHTML = `<strong>${line}</strong>`; // Bold for Verse and Chorus
    } else {
      lineElement.textContent = line;
    }
    lyricsContainer.appendChild(lineElement); // Add line to the container
  });

  document.getElementById('lyricsDisplay').style.display = 'block'; // Show the lyrics container
}



// Display hymn lyrics
//function showLyrics(hymn) {
//  document.getElementById('hymnTitle').textContent = hymn.title;
//
//  const lyricsContainer = document.getElementById('hymnLyrics');
//  lyricsContainer.innerHTML = ''; // Clear previous content
//
//  hymn.lyrics.split('\n').forEach(line => {
//    if (line.startsWith('Verse')) {
//      const verseElement = document.createElement('p');
//      verseElement.innerHTML = `<strong>${line}</strong>`;
//      lyricsContainer.appendChild(verseElement);
//    } else if (line.startsWith('Chorus')) {
//      const chorusElement = document.createElement('p');
//      chorusElement.innerHTML = `<strong>${line}</strong>`;
//      lyricsContainer.appendChild(chorusElement);
//    } else if (line.trim() === '') {
//      // Add a blank line for better spacing
//      const blankLine = document.createElement('br');
//      lyricsContainer.appendChild(blankLine);
//    } else {
//      // Regular line
//      const lineElement = document.createElement('p');
//      lineElement.textContent = line;
//      lyricsContainer.appendChild(lineElement);
//    }
//  });

  // Display the lyrics container
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