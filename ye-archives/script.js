const albums = [
    {
        id: "college-dropout",
        name: "The College Dropout",
        year: "2004",
        image: "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg",
        description: "The College Dropout is the debut studio album by American rapper and producer Kanye West. It was released on February 10, 2004. Diverging from the then-dominant gangster persona in hip hop, West's lyrics on the album concern themes of family, self-consciousness, material consumption, spiritualism, and struggle.",
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder: Through the Wire snippet
    },
    {
        id: "late-registration",
        name: "Late Registration",
        year: "2005",
        image: "https://upload.wikimedia.org/wikipedia/en/f/f4/Late_registration_cd_cover.jpg",
        description: "Late Registration is the second studio album by American rapper and producer Kanye West. It was released on August 30, 2005. The album's production was a collaboration between West and American record producer Jon Brion, and features guest appearances from Adam Levine, Lupe Fiasco, Jamie Foxx, Common, Game, Jay-Z, Brandy, and Nas.",
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" // Placeholder: Gold Digger snippet
    },
    {
        id: "graduation",
        name: "Graduation",
        year: "2007",
        image: "https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg",
        description: "Graduation is the third studio album by American rapper and producer Kanye West. It was released on September 11, 2007. The album's production was primarily handled by West himself, with contributions from various other producers. It features guest appearances from Dwele, T-Pain, Lil Wayne, Mos Def, and Chris Martin.",
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" // Placeholder: Stronger snippet
    },
    {
        id: "808s",
        name: "808s & Heartbreak",
        year: "2008",
        image: "https://upload.wikimedia.org/wikipedia/en/f/f1/808s_%26_Heartbreak.png",
        description: "808s & Heartbreak is the fourth studio album by American rapper and producer Kanye West. It was released on November 24, 2008. Marking a musical departure from his previous rap records, 808s features a minimalist sound and heavy use of the Roland TR-808 drum machine and Auto-Tune.",
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" // Placeholder: Heartless snippet
    },
    {
        id: "mbdtf",
        name: "My Beautiful Dark Twisted Fantasy",
        year: "2010",
        image: "https://imgs.search.brave.com/l6vOYHNDapDk2_XYFMCrez0vNeOB5K6F6w_Zy-7epKY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS41MTQy/MDgyMDQ0LjcyNzgv/cmFmLDM2MHgzNjAs/MDc1LHQsZmFmYWZh/OmNhNDQzZjQ3ODYu/dTEuanBn",
        description: "My Beautiful Dark Twisted Fantasy is the fifth studio album by American rapper and producer Kanye West. Released on November 22, 2010, it features a maximalist production style and themes of fame, excess, and self-reflection. It is widely regarded as one of the greatest albums of all time.",
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" // Placeholder: Power snippet
    },
    {
        id: "yeezus",
        name: "Yeezus",
        year: "2013",
        image: "https://upload.wikimedia.org/wikipedia/en/0/03/Yeezus_album_cover.png",
        description: "Yeezus is the sixth studio album by American rapper and producer Kanye West. It was released on June 18, 2013. The album is characterized by its abrasive, experimental, and minimalist sound, drawing from industrial, acid house, and Chicago drill music.",
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" // Placeholder: Black Skinhead snippet
    }
];

const albumGrid = document.getElementById('albumGrid');

if (albumGrid) {
    albums.forEach(album => {
        const box = document.createElement('div');
        box.className = 'album-box';
        box.innerHTML = `
            <img src="${album.image}" alt="${album.name}">
            <div class="album-overlay">
                <div class="album-name">${album.name}</div>
            </div>
        `;
        box.addEventListener('click', () => {
            window.location.href = `album.html?id=${album.id}`;
        });
        albumGrid.appendChild(box);
    });
}

// Logic for Album Detail Page
const albumTitle = document.getElementById('albumTitle');
if (albumTitle) {
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get('id');
    const album = albums.find(a => a.id === albumId);

    if (album) {
        albumTitle.textContent = album.name;
        document.getElementById('albumYear').textContent = album.year;
        document.getElementById('albumDesc').textContent = album.description;
        document.getElementById('albumImg').src = album.image;
        document.getElementById('albumImg').alt = album.name;
        document.title = `${album.name} - YE-ARCHIVE`;

        // Background Music Logic
        const audio = new Audio(album.songUrl);
        audio.loop = true;
        
        // Browsers usually block autoplay until a user interaction occurs.
        // We'll try to play it, and if it fails, we'll wait for the first click.
        const playMusic = () => {
            audio.play().catch(error => {
                console.log("Autoplay blocked. Waiting for user interaction to play music.");
                document.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        };
        
        playMusic();
    }
}
