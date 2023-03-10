const musicContainer = document.getElementById("music_container");

const modeButton = document.getElementById("music_mode_btn");
const playButton = document.getElementById("music_play_btn");
const previousButton = document.getElementById("previous_btn");
const nextButton = document.getElementById("next_btn");
const listButton = document.getElementById("songs_list_btn");

const prgressArea = document.getElementById("prgress_area");
const progressBar = document.getElementById("progress_bar");

const currentTime = document.getElementById("current_time");
const duration = document.getElementById("duration");

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const songsListContainer = document.getElementById("songs_list_container");
const songsListUlTag = songsListContainer.querySelector("ul");
const songsListCloseButton = document.getElementById("song_list_close_btn");
const songsListModeButton = document.getElementById("songs_list_mode_btn");
const songsListModeName = document.getElementById("songs_list_mode_name");

const repeat = "repeat";
const repeat_one = "repeat_one";
const shuffle = "shuffle";
const modes = [repeat, repeat_one, shuffle];

var music_index = 0;
var mode_index = 0;
var pasused = true;

const setMusicContainerCenter = () => {
  if (musicContainer.clientHeight > document.body.clientHeight) {
    document.body.style.height = "fit-content";
  } else {
    document.body.style.height = "100vh";
  }
}

const loadSongsList = () => {
  songs.map((song, index) => {
    let list_num = index + 1;
    if (list_num < 10) {
      list_num = '0' + list_num;
    }
    let liTag = `
    <li index="${index}" number="${list_num}" onclick="playThisMusic(${index})" class="flex items-center hover:bg-gray-800 p-5 max-sm:p-3 rounded-xl cursor-pointer gap-5 overflow-hidden">
      <div class="animation${index} flex items-center text-sm w-4">
        <div>${list_num}</div>
      </div>
      <div class="flex gap-5 max-sm:gap-3 items-center">
        <div class="w-max">
          <img class="w-12 h-12 rounded-lg aspect-square object-cover" src="${song.cover}" alt="${song.title}" />
        </div>
        <div>
          <h1 class="text-base font-light">${song.title}</h1>
          <div class="flex gap-3 text-sm text-slate-500 overflow-hidden">
            <h1>${song.artist}</h1>
          </div>
        </div>
      </div>
    </li>`;
    songsListUlTag.insertAdjacentHTML("beforeend", liTag);
  });
}

const loadPlayingSongInList = () => {
  songsListUlTag.querySelectorAll('li').forEach(element => {
    let index = element.getAttribute("index");
    let number = element.getAttribute("number");

    let animationEl = element.getElementsByClassName(`animation${index}`).item(0);
    if (music_index == index) {
      element.classList.add("bg-gray-800");
      let playing_animation = `<div class="playing_animation"><span></span><span></span><span></span></div>`;
      animationEl.innerHTML = playing_animation;
    }
    else {
      element.classList.remove("bg-gray-800");
      animationEl.innerHTML = `<div>${number}</div>`;
    }
  });
}

const hideSongsList = () => {
  songsListContainer.style.transform = "translateY(100%)";
}

const showSongsList = () => {
  songsListContainer.style.transform = "translateY(0)";
}

const renderModeIcon = () => {
  modeButton.getElementsByTagName("span").item(0).innerHTML = modes[mode_index];
  songsListModeButton.getElementsByTagName("span").item(0).innerHTML = modes[mode_index];
}

const renderPlayIcon = () => {
  if (pasused) {
    playButton.getElementsByTagName("span").item(0).innerHTML = "play_arrow";
  } else {
    playButton.getElementsByTagName("span").item(0).innerHTML = "pause";
  }
}

const playAudio = () => {
  audio.play();
}

const pauseAudio = () => {
  audio.pause();
}

const loadMusic = () => {
  let song = songs[music_index];

  audio.setAttribute("src", song.audioDir);
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.setAttribute("src", song.cover);

  musicContainer.style.backgroundImage = `url(${song.cover})`;
  loadPlayingSongInList();
}

const liveMusic = () => {
  (pasused) ? pauseAudio() : playAudio();
  renderPlayIcon();
}

const playThisMusic = (index) => {
  music_index = index;
  loadMusic();
  setPause(false);
  liveMusic();
  hideSongsList();
}

const previousMusic = () => {
  music_index -= 1;
  (music_index < 0) ? music_index = songs.length - 1 : mode_index = music_index ;
  loadMusic();
  setPause(false);
  liveMusic();
}

const nextMusic = () => {
  music_index += 1;
  (music_index > songs.length - 1) ? music_index = 0 : mode_index = music_index;
  loadMusic();
  setPause(false);
  liveMusic();
}

const setPause = (what_ever) => {
  pasused = what_ever;
}

const displayModeLabel = () => {
  let label = "";
  switch (modes[mode_index]) {
    case repeat:
      label = "Repeat All";
      break;

    case repeat_one:
      label = "Repeat One";
      break;

    case shuffle:
      label = "Shuffle";
      break;
  }
  songsListModeName.textContent = label;
}

const changeMode = () => {
  mode_index += 1;
  if (mode_index > modes.length - 1) {
    mode_index = 0;
  }
  displayModeLabel();
  renderModeIcon();
}

modeButton.addEventListener('click', () => {
  changeMode();
});

songsListModeButton.addEventListener('click', () => {
  changeMode();
});

playButton.addEventListener('click', () => {
  (pasused) ? pasused = false : pasused = true;
  liveMusic();
  renderPlayIcon();
});

previousButton.addEventListener('click', () => {
  previousMusic();
});

nextButton.addEventListener('click', () => {
  nextMusic();
});

listButton.addEventListener('click', () => {
  showSongsList();
});

songsListCloseButton.addEventListener('click', () => {
  hideSongsList();
});

prgressArea.addEventListener('click', (event) => {
  audio.currentTime = (event.offsetX / prgressArea.clientWidth) * audio.duration;
  setPause(false);
  liveMusic();
  renderPlayIcon();
});

audio.addEventListener('timeupdate', (event) => {
  let current_time = event.target.currentTime;
  let total_time = event.target.duration;

  let progress_width = (current_time / total_time) * 100;
  progressBar.style.width = progress_width + "%";

  let current_min = Math.floor(current_time / 60);
  let current_sec = Math.floor(current_time % 60);
  if (current_sec < 10) {
    current_sec = '0' + current_sec;
  }
  currentTime.textContent = `${current_min}:${current_sec}`;
});

audio.addEventListener('loadeddata', (event) => {
  let total_time = event.target.duration;
  let total_min = Math.floor(total_time / 60);
  let total_sec = Math.floor(total_time % 60);
  if (total_sec < 10) {
    total_sec = '0' + total_sec;
  }
  duration.textContent = `${total_min}:${total_sec}`;
});

audio.addEventListener('ended', () => {
  switch (modes[mode_index]) {
    case repeat:
      nextMusic();
      break;

    case repeat_one:
      audio.currentTime = 0;
      playAudio();
      break;

    case shuffle:
      while (true) {
        let random_index = Math.floor(Math.random() * songs.length);
        if (random_index !== music_index) {
          music_index = random_index;
          loadMusic();
          playAudio();
          break;
        }
      }
      break;
  }
});

window.addEventListener('load', () => {
  setMusicContainerCenter();
  renderPlayIcon();
  renderModeIcon();
  loadSongsList();
  displayModeLabel();
  loadMusic();
});