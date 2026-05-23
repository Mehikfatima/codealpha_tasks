const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
const playlistEl = document.getElementById("playlist");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const filePicker = document.getElementById("filePicker");
const fileDrop = document.getElementById("fileDrop");
const searchInput = document.getElementById("search");
const artwork = document.getElementById("artwork");
const themeBtn = document.getElementById("themeBtn");
const clearBtn = document.getElementById("clearBtn");

let songs = [
  { title: "Pasoori", artist: "Ali Sethi & Shae Gill", src: "songs/28d25568142c0c9d3809d8ca5b9cd40a (1).mp3" },
  { title: "Afreen Afreen", artist: "Coke Studio", src: "songs/4cc98377296ed2e6b2dbff71cee206f7.mp3" },
  { title: "Satisfya", artist: "Imran Khan", src: "songs/79c2437e4311fdced6b05eb9830d67bc.mp3" },
  { title: "Bewafa", artist: "Imran Khan", src: "songs/d3cbfa9181638bfb3fce57ad465f6f34.mp3" },
  { title: "Joona", artist: "Hassan Raheem", src: "songs/bd3d0e6112684787f4cdb5b2cc7c982c.mp3" }
];

let currentSong = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = "off"; // off, one, all

function init() {
  audio.volume = Number(volumeSlider.value);
  loadSong(currentSong, false);
  renderPlaylist();
}

function loadSong(index, autoplay = false) {
  if (!songs.length) {
    audio.removeAttribute("src");
    songTitle.textContent = "No Song Loaded";
    songArtist.textContent = "Add songs to start";
    playBtn.textContent = "▶";
    isPlaying = false;
    renderPlaylist();
    return;
  }

  currentSong = Math.max(0, Math.min(index, songs.length - 1));
  const song = songs[currentSong];

  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist || "Unknown Artist";
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  renderPlaylist();

  if (autoplay) playSong();
}

async function playSong() {
  if (!songs.length) return;

  try {
    await audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
    artwork.classList.add("playing");
  } catch (error) {
    console.warn("Playback failed:", error);
    alert("Your browser blocked autoplay. Press Play again, or check that the audio file exists.");
  }
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  artwork.classList.remove("playing");
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  if (!songs.length) return;

  if (isShuffle && songs.length > 1) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSong);
    loadSong(randomIndex, true);
    return;
  }

  if (currentSong === songs.length - 1 && repeatMode === "off") {
    loadSong(0, false);
    pauseSong();
    return;
  }

  loadSong((currentSong + 1) % songs.length, true);
}

function prevSong() {
  if (!songs.length) return;

  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  loadSong((currentSong - 1 + songs.length) % songs.length, true);
}

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function renderPlaylist() {
  const query = searchInput.value.trim().toLowerCase();
  playlistEl.innerHTML = "";

  songs
    .map((song, index) => ({ song, index }))
    .filter(({ song }) => {
      const text = `${song.title} ${song.artist}`.toLowerCase();
      return text.includes(query);
    })
    .forEach(({ song, index }) => {
      const li = document.createElement("li");
      li.className = index === currentSong ? "active" : "";
      li.innerHTML = `
        <div>
          <span class="track-title">${escapeHtml(song.title)}</span>
          <span class="track-artist">${escapeHtml(song.artist || "Unknown Artist")}</span>
        </div>
        <span class="track-index">${index === currentSong && isPlaying ? "▶" : index + 1}</span>
      `;

      li.addEventListener("click", () => loadSong(index, true));
      playlistEl.appendChild(li);
    });
}

function addFiles(fileList) {
  const files = Array.from(fileList).filter(file => file.type.startsWith("audio/"));

  if (!files.length) {
    alert("Please choose valid audio files.");
    return;
  }

  const wasEmpty = songs.length === 0;

  files.forEach(file => {
    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    songs.push({
      title: cleanName,
      artist: "Local file",
      src: URL.createObjectURL(file),
      local: true
    });
  });

  if (wasEmpty) {
    loadSong(0, true);
  } else {
    renderPlaylist();
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
  volumeValue.textContent = `${Math.round(audio.volume * 100)}%`;
});

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

audio.addEventListener("error", () => {
  const song = songs[currentSong];
  songTitle.textContent = "Could not load this song";
  songArtist.textContent = song ? `${song.title} file not found` : "No audio source";
  pauseSong();
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
  repeatBtn.classList.toggle("active", repeatMode !== "off");
  repeatBtn.textContent = repeatMode === "one" ? "🔂" : "🔁";
  repeatBtn.title = `Repeat: ${repeatMode}`;
});

fileDrop.addEventListener("click", () => filePicker.click());

filePicker.addEventListener("change", event => {
  addFiles(event.target.files);
  filePicker.value = "";
});

["dragenter", "dragover"].forEach(eventName => {
  fileDrop.addEventListener(eventName, event => {
    event.preventDefault();
    fileDrop.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach(eventName => {
  fileDrop.addEventListener(eventName, event => {
    event.preventDefault();
    fileDrop.classList.remove("dragover");
  });
});

fileDrop.addEventListener("drop", event => {
  addFiles(event.dataTransfer.files);
});

searchInput.addEventListener("input", renderPlaylist);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

clearBtn.addEventListener("click", () => {
  songs = songs.filter(song => !song.local);
  if (currentSong >= songs.length) currentSong = 0;
  loadSong(currentSong, false);
});

document.addEventListener("keydown", event => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input") return;

  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  } else if (event.key === "ArrowRight") {
    audio.currentTime = Math.min((audio.currentTime || 0) + 5, audio.duration || 0);
  } else if (event.key === "ArrowLeft") {
    audio.currentTime = Math.max((audio.currentTime || 0) - 5, 0);
  } else if (event.key.toLowerCase() === "n") {
    nextSong();
  } else if (event.key.toLowerCase() === "p") {
    prevSong();
  }
});

init();
