const musicContainer = document.getElementById("music_container");

const modeButton = document.getElementById("music_mode_btn");
const playButton = document.getElementById("music_play_btn");
const previousButton = document.getElementById("previous_btn");
const nextButton = document.getElementById("next_btn");
const listButton = document.getElementById("songs_list_btn");

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

const lyricsTag = document.getElementById("lyrics").querySelector(".content");

const loading = document.getElementById("loading");

const repeat = "repeat";
const repeat_one = "repeat_one";
const shuffle = "shuffle";
const modes = [repeat, repeat_one, shuffle];

var music_index = 0;
var mode_index = 0;
var pasused = true;
var lyrics = [];
var currentLyricLineIndex = null;

const setMusicContainerCenter = () => {
  if (musicContainer.clientHeight > document.body.clientHeight) {
    document.body.classList.add = "h-fit";
    document.body.classList.remove = "h-screen";
  } else {
    document.body.classList.remove = "h-fit";
    document.body.classList.add = "h-screen";
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
        <div class="w-12 aspect-square rounded-lg bg-cover bg-center bg-no-repeat" style="background-image: url(${song.cover})">
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

const togglePlayingAnimation = () => {
  songsListUlTag.querySelectorAll('li').forEach(element => {
    let index = element.getAttribute("index");

    let spanTags = element.getElementsByClassName(`animation${index}`).item(0).querySelectorAll("span");
    if (music_index == index) {
      if (pasused) {
        spanTags.forEach(span => {
          span.style.animationPlayState = 'paused';
        });
      } else {
        spanTags.forEach(span => {
          span.style.animationPlayState = 'running';
        });
      }
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
  currentLyricLineIndex = null;
  lyrics = [];
  lyricsTag.innerHTML = "";
  let song = songs[music_index];

  audio.setAttribute("src", song.audioDir);
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.setAttribute("src", song.cover);

  fetch(song.lyricDir)
  .then(res => {
    res.text()
    .then(result => {
      let lines = result.trim().split('\n');
      lines.map((line, index) => {
        if (line.indexOf("[") != undefined && line.indexOf("]") != undefined && line.indexOf(":") != undefined) {
          let [m, s] = line.slice(line.indexOf("[") + 1, line.indexOf("]")).split(":");
          let min = Number(m);
          let sec = Number(s);
  
          if (min > 0) {
            sec += min * 60;
          }
  
          let lyric = line.slice(line.indexOf("]") + 1, line.length);
  
          let lyricTag = `<div class="text-slate-500 lyric_index_${index} py-3">${lyric}</div>`;
  
          lyricsTag.innerHTML += lyricTag;
  
          lyrics.push({time: sec, line: lyric});
        }
      });
    })
    .catch(err => console.error(err))
  })
  .catch(err => console.error(err));

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
  (music_index < 0) ? music_index = songs.length - 1 : music_index = music_index ;
  loadMusic();
  setPause(false);
  liveMusic();
  togglePlayingAnimation();
}

const nextMusic = () => {
  music_index += 1;
  (music_index > songs.length - 1) ? music_index = 0 : music_index = music_index;
  loadMusic();
  setPause(false);
  liveMusic();
  togglePlayingAnimation();
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

const seekTo = () => {
  audio.currentTime = audio.duration * (progressBar.value / 100);
  setPause(false);
  liveMusic();
  renderPlayIcon();
}

const alignLyric = () => {
  var a = $(`.lyric_index_${currentLyricLineIndex}`).height();
  var c = $('#lyrics').height();
  var d = $(`.lyric_index_${currentLyricLineIndex}`).offset().top - $(`.lyric_index_${currentLyricLineIndex}`).parent().offset().top;
  var e = d + a / 2 - c / 2;
  $('#lyrics').animate(
    { scrollTop: e + 'px' },
    { easing: 'swing', duration: 250 }
  );
}

var lyricHeight = $('.content').height();
$(window).on('resize', function () {
  if ($('.content').height() != lyricHeight) {
    lyricHeight = $('.content').height();
    alignLyric();
  }
});

const run = () => {
  setMusicContainerCenter();
  renderPlayIcon();
  renderModeIcon();
  loadSongsList();
  displayModeLabel();
  loadMusic();
  togglePlayingAnimation();
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
  togglePlayingAnimation();
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

audio.addEventListener('timeupdate', (event) => {
  let current_time = event.target.currentTime;
  let total_time = event.target.duration;

  let past = null;

  lyrics.map((value, index) => {
    if (value.time < current_time) {
      past = index
    }
  })

  if (past != null && past != currentLyricLineIndex) {
    currentLyricLineIndex = past;
    lyricsTag.querySelectorAll("div").forEach(item => {
      item.style.color = "rgb(100 116 139)";
    });

    let current_lyric = lyricsTag.querySelector(`.lyric_index_${past}`);
    current_lyric.style.color = "rgb(248 250 252)";
    alignLyric();
  }

  progressBar.value = (current_time / total_time) * 100;

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

run();

window.addEventListener('load', () => {
  loading.style.display = 'none';
});