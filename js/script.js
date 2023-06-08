const sliderItems = document.querySelectorAll('.slide'),
  prev = document.querySelector('#prev'),
  next = document.querySelector('#next'),
  progressBar = document.querySelector('.progress-bar'),
  progressBarFilled = document.querySelector('.progress-bar-filled'),
  playLg = document.querySelector('#playLg'),
  playSm = document.querySelector('#playSm'),
  mute = document.querySelector('#mute'),
  volume = document.querySelector('#volume'),
  fullscreen = document.querySelector('#fullscreen'),
  container = document.querySelector('.container'),
  loader = document.querySelector('.loader'),
  videos = document.querySelectorAll('video'),
  speedDecr = document.querySelector('.speed-decr'),
  speedIncr = document.querySelector('.speed-incr'),
  speedNew = document.querySelector('.speed-new')

const wallpapers = ['./img/day.jpg', './img/night.jpg', './img/taverns.jpg']
let activeIdx = 0
let currentVideo = sliderItems[activeIdx].querySelector('video')
let fullscreenMode = false
currentVideo.volume = 0.5
let volumeBefore = currentVideo.volume

bindEvents()
preloadVideo()
next.addEventListener('click', () => {
  changeActiveSlide()
  activeIdx++

  if (activeIdx > sliderItems.length - 1) {
    activeIdx = 0
  }

  currentVideo = sliderItems[activeIdx].querySelector('video')
  setBgToBody()
  setActiveSlide()
})

prev.addEventListener('click', () => {
  changeActiveSlide()
  activeIdx--

  if (activeIdx < 0) {
    activeIdx = sliderItems.length - 1
  }

  currentVideo = sliderItems[activeIdx].querySelector('video')
  setBgToBody()
  setActiveSlide()
})
document.addEventListener('fullscreenchange', watchFullscreen)

document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    if (
      document.activeElement === playLg ||
      document.activeElement === playSm
    ) {
      return
    }

    togglePlay()
  }
  if (e.code === 'KeyM') {
    toggleMute()
  }
  if (e.code === 'KeyF') {
    toggleFullscreen()
  }
  if (e.shiftKey) {
    if (e.code === 'Period') {
      increaseSpeed()
    }
    if (e.code === 'Comma') {
      decreaseSpeed()
    }
  }
})

videos.forEach(video => {
  video.volume = 0.5
})

setBgToBody()

function setBgToBody() {
  document.body.style.backgroundImage = `url(${wallpapers[activeIdx]})`
}

function setActiveSlide() {
  sliderItems.forEach(slide => slide.classList.remove('active'))
  sliderItems[activeIdx].classList.add('active')
  currentVideo.play()
  playLg.classList.add('hidden')
  playSm.classList.add('played')
  changeVolume(0.5)

  bindEvents()
}

function changeActiveSlide() {
  currentVideo.pause()
  currentVideo.currentTime = 0
  progressBarFilled.style.flexBasis = 0
  sliderItems.forEach(slide => slide.classList.remove('active'))

  unbindEvents()
}

function togglePlay() {
  if (currentVideo.paused) {
    currentVideo.play()
    playLg.classList.add('hidden')
    playSm.classList.add('played')
  } else {
    currentVideo.pause()
    playLg.classList.remove('hidden')
    playSm.classList.remove('played')
  }
}

function progressUpdate() {
  const percent =
    (sliderItems[activeIdx].querySelector('video').currentTime /
      sliderItems[activeIdx].querySelector('video').duration) *
    100
  progressBarFilled.style.flexBasis = `${percent}%`
}

function progressChange(e) {
  const nexTime =
    (e.offsetX / progressBar.offsetWidth) *
    sliderItems[activeIdx].querySelector('video').duration
  sliderItems[activeIdx].querySelector('video').currentTime = nexTime
}

function changeVolume(newVolume) {
  newVolume != 0 ? (volumeBefore = newVolume) : ''
  volume.value = newVolume
  currentVideo.volume = newVolume
  let percentage = ((newVolume - volume.min) / (volume.max - volume.min)) * 100
  volume.style.background = `linear-gradient(to right, #909090 0%, #909090 ${percentage}%, #000 ${percentage}%, #000 100%)`
}

function toggleMute() {
  if (currentVideo.muted) {
    currentVideo.muted = false
    mute.classList.remove('muted')
    changeVolume(volumeBefore)
  } else {
    currentVideo.muted = true
    mute.classList.add('muted')
    changeVolume(0)
  }
}

function toggleFullscreen() {
  if (!fullscreenMode) {
    if (container.requestFullscreen) {
      container.requestFullscreen()
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen()
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen()
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

function watchFullscreen() {
  if (!document.fullscreenElement) {
    fullscreenMode = false
    container.classList.remove('expanded')
    fullscreen.classList.remove('exit')
  } else {
    container.classList.add('expanded')
    fullscreenMode = true
    fullscreen.classList.add('exit')
  }
}

function increaseSpeed() {
  let currentSpeed = currentVideo.playbackRate
  speedIncr.classList.add('show')
  speedNew.classList.add('show')

  setTimeout(() => {
    speedIncr.classList.remove('show')
    speedNew.classList.remove('show')
  }, 500)

  if (currentSpeed === 2) {
    return
  }

  if (currentSpeed === 1.75) {
    currentVideo.playbackRate = 2
  }

  if (currentSpeed === 1.5) {
    currentVideo.playbackRate = 1.75
  }

  if (currentSpeed === 1.25) {
    currentVideo.playbackRate = 1.5
  }

  if (currentSpeed === 1) {
    currentVideo.playbackRate = 1.25
  }

  if (currentSpeed === 0.75) {
    currentVideo.playbackRate = 1
  }

  if (currentSpeed === 0.5) {
    currentVideo.playbackRate = 0.75
  }

  if (currentSpeed === 0.25) {
    currentVideo.playbackRate = 0.5
  }

  speedNew.textContent = `${currentVideo.playbackRate}x`
}

function decreaseSpeed() {
  let currentSpeed = currentVideo.playbackRate
  speedDecr.classList.add('show')
  speedNew.classList.add('show')

  setTimeout(() => {
    speedDecr.classList.remove('show')
    speedNew.classList.remove('show')
  }, 500)

  if (currentSpeed === 0.25) {
    return
  }

  if (currentSpeed === 0.5) {
    currentVideo.playbackRate = 0.25
  }

  if (currentSpeed === 0.75) {
    currentVideo.playbackRate = 0.5
  }

  if (currentSpeed === 1) {
    currentVideo.playbackRate = 0.75
  }

  if (currentSpeed === 1.25) {
    currentVideo.playbackRate = 1
  }

  if (currentSpeed === 1.5) {
    currentVideo.playbackRate = 1.25
  }

  if (currentSpeed === 1.75) {
    currentVideo.playbackRate = 1.5
  }

  if (currentSpeed === 2) {
    currentVideo.playbackRate = 1.75
  }

  speedNew.textContent = `${currentVideo.playbackRate}x`
}

function bindEvents() {
  currentVideo.addEventListener('timeupdate', progressUpdate)
  currentVideo.addEventListener('click', togglePlay)
  playLg.addEventListener('click', togglePlay)
  playSm.addEventListener('click', togglePlay)
  progressBar.addEventListener('click', progressChange)
  mute.addEventListener('click', toggleMute)
  volume.addEventListener('change', e => changeVolume(e.target.value))
  volume.addEventListener('mousemove', e => changeVolume(e.target.value))
  fullscreen.addEventListener('click', toggleFullscreen)
}

function unbindEvents() {
  currentVideo.removeEventListener('timeupdate', progressUpdate)
  currentVideo.removeEventListener('click', togglePlay)
  playLg.removeEventListener('click', togglePlay)
  playSm.removeEventListener('click', togglePlay)
  progressBar.removeEventListener('click', progressChange)
  mute.removeEventListener('click', toggleMute)
  volume.removeEventListener('change', e => changeVolume(e.target.value))
  volume.removeEventListener('mousemove', e => changeVolume(e.target.value))
  fullscreen.removeEventListener('click', toggleFullscreen)
}

async function preloadVideo() {
  videos[0].src = await preloader(videos[0].src)
  document.querySelector('.loader').classList.add('loader-hidden')
  videos[1].src = await preloader(videos[1].src)
  videos[2].src = await preloader(videos[2].src)
}

async function preloader(src) {
  const res = await fetch(src)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

console.log(`
Score: 30/30

✅ Разобраться в коде чужого проекта, понять его, воспроизвести исходное приложение. Правки и изменения допускаются и приветствуются, если они не ухудшают внешний вид и функционал исходного проекта - 10 баллов

✅ Дополнить исходный проект обязательным дополнительным функционалом, указанным в описании задания + 10 баллов
  ✨ Управление плеером с клавиатуры:
  1) клавиша Пробел — пауза
  2) Клавиша M (англ) — отключение/включение звука
  3) Клавиша > — ускорение воспроизведения ролика (with shift)
  4) Клавиша < — замедление воспроизведения ролика (with shift)
  5) Клавиша F — включение/выключение полноэкранного режимa
  Горячие клавиши должны работать так же, как работают эти клавиши в YouTube видео

✅ Дополнить исходный проект дополнительным функционалом на выбор + 10 баллов
  ✨ Добавить возможность перелистывания видео или слайдер видео`)
