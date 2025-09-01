/* Элементы DOM */

// Информация о треке
const coverImg = document.querySelector('.cover');
const trackTitle = document.querySelector('.track_title');
const artistName = document.querySelector('.artist_name');

// Длительность трека
const time = document.querySelector('.current_time');
const fullTime = document.querySelector('.full_time');

const timelineSlider = document.querySelector('.timeline_slider .slider');
const timelineThumb = document.querySelector('.timeline_slider .slider_thumb');
const timelineProgress = document.querySelector('.timeline_slider .progress');

// Громкость трека
const volumeInfoContainer = document.querySelector('.volume_slider');
const volumeSlider = document.querySelector('.volume_slider .slider');
const volumeProgress = document.querySelector('.volume_slider .progress');
const volumeIcon = document.querySelector('.volume_slider .volume_icon');

// Кнопки управления воспроизведением
const playBtn = document.querySelector('#btnPlay');
const prevBtn = document.querySelector('#btnBackward');
const nextBtn = document.querySelector('#btnForward');

const audio = document.querySelector('#audio');

// Создание и добавление элемента, содержащего текстовое значение текущей громкости внутрь раздела о громкости
const volumeValueSpan = document.createElement('span');
volumeInfoContainer.insertAdjacentElement('afterbegin', volumeValueSpan);

/* Глобальные переменные */

// Играет ли трек
let trackPlaying = false;

// Выключен ли звук
let volumeMuted = false;

// Текущее значение отображаемой громкости
let volumeVal;

// Какой трек загружен в данный момент (основываясь на id)
let trackId = 0;

/* Данные о треках */

// Названия треков
const tracks = [
	'Immortal',
	'No Talk',
	'Enough',
	'Skylines',
	'Get through',
	'Lofi Mallet',
	'Winning',
];

// Имена исполнителей
const artists = ['NEFFEX', 'VYEN', 'NEFFEX', 'Anno Domini Beats', 'NEFFEX', 'Kwon', 'NEFFEX'];

// Обложки треков
const covers = ['cover1', 'cover2', 'cover3', 'cover4', 'cover5', 'cover6', 'cover7'];

/* Обработчик клика по кнопке Play (Pause) */
playBtn.addEventListener('click', playTrack);

/* Функция для воспроизведения трека (постановки на паузу) */
function playTrack() {
	// Если трек не играет
	if (trackPlaying === false) {
		audio.play();
		// Показать иконку "Pause" внтури кнопки
		playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
		// Изменение значения глобальной переменной
		trackPlaying = true;

		// Если трек уже играет
	} else {
		audio.pause();
		// Показать иконку "Play" внтури кнопки
		playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
		// Изменение значения глобальной переменной
		trackPlaying = false;
	}
}

/* Функция для смены трека */
function switchTrack() {
	// Если трек играет
	if (trackPlaying === true) {
		// Продолжить воспроизводить аудио
		audio.play();
	}
}

/* Функция для загрузки трека */
function loadTrack() {
	// Задаем источник для аудио
	audio.src = './tracks/' + tracks[trackId] + '.mp3';
	// Загружаем аудио
	audio.load();
	// Изменение и отображение названия трека
	trackTitle.innerHTML = tracks[trackId];
	// Изменение и отображение имени исполнителя
	artistName.innerHTML = artists[trackId];
	// Изменение и отображение обложки
	coverImg.src = './covers/' + covers[trackId] + '.jpg';

	// Устанавка шкалы времени трека в начало
	timelineProgress.style.width = 0;
	timelineThumb.style.left = 0;
}

// Вызываем функцию при первичной загрузке
loadTrack();

/* Функция для вычисления и форматирования времени трека */
function setTime(output, input) {
	// Вычисление количества минут
	const minutes = Math.floor(input / 60);
	// Вычисление количества секунд
	const seconds = Math.floor(input % 60);

	// Отображение внутри нужного элемента времени в формате, зависищим от количества секунд
	output.innerHTML = seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
}

/* Отображение общей длительности трека внутри контейнера для времени */
setTime(fullTime, audio.duration);

/* Обработчик для отображения и изменения текущего времени трека, и добавление анимации для полосы времени */
audio.addEventListener('timeupdate', () => {
	// Текущее время аудио
	const currentAudioTime = Math.floor(audio.currentTime);
	const timePercentage = (currentAudioTime / audio.duration) * 100 + '%'; // в процентах

	// Отображение текущего времени трека
	setTime(time, currentAudioTime);

	// Установка и изменение полосы времени, основываясь на текущем времени в процентах
	timelineProgress.style.width = timePercentage;
	timelineThumb.style.left = timePercentage;
});

/* Функция для взаимодействия пользователя со шкалой времени */
function handleCustomTimelineSliderValue() {
	// Значение текущего времени на шкале в процентах
	const val = Math.floor((timelineSlider.value / audio.duration) * 100) + '%';

	// Установка и изменение полосы времени, основываясь на текущем времени в процентах
	timelineProgress.style.width = val;
	timelineThumb.style.left = val;

	// Отображение текущего времени трека
	setTime(time, timelineSlider.value);

	// Установка значения полосы времени для текущего времени аудио трека
	audio.currentTime = timelineSlider.value;
}

// Вызываем функцию при первичной загрузке
handleCustomTimelineSliderValue();

/* Обработчик для изменения отображения шкалы времени при взаимодействии с ней */
timelineSlider.addEventListener('input', handleCustomTimelineSliderValue);

/* Функция для взаимодействия пользователя со шкалой громкости */
function handleCustomVolumeSliderValue() {
	// Максимальное значение шкалы громкости
	const maxVal = volumeSlider.getAttribute('max');
	volumeVal = Math.floor((volumeSlider.value / maxVal) * 100) + '%'; // в процентах

	// Установка ширины полосы громкости, основываясь на текущем значении отображаемой громкости
	volumeProgress.style.width = volumeVal;
	// Установка громкости аудио трека, основываясь на значении громкости внутри шкалы слайдера
	audio.volume = volumeSlider.value / 100;
	// Установка цифрового отображаемого значения громкости
	volumeValueSpan.innerText = volumeSlider.value + '%';

	/* Изменение отображения иконки звука */
	if (audio.volume >= 0.5) {
		// Если громкость высокая (выше 50%)
		volumeIcon.innerHTML = `
			<span class="volume_high">
				<i class="fa-solid fa-volume-high"></i>
			</span>
		`;
	} else if (audio.volume === 0 && volumeMuted) {
		// Если звук выключен
		volumeIcon.innerHTML = `
			<span class="volume_muted">
				<i class="fa-solid fa-volume-xmark"></i>
			</span>
    	`;
	} else {
		// Если громкость низкая (менее 50%)
		volumeIcon.innerHTML = `
			<span class="volume_low">
				<i class="fa-solid fa-volume-low"></i>
			</span>
		`;
	}
}

// Вызываем функцию при первичной загрузке
handleCustomVolumeSliderValue();

/* Обработчик для изменения отображения шкалы громкости при взаимодействии с ней */
volumeSlider.addEventListener('input', handleCustomVolumeSliderValue);

/* Обработчик клика по иконке звука */
volumeIcon.addEventListener('click', () => {
	if (volumeMuted === false) {
		// Если звук не отключен
		volumeIcon.innerHTML = `
			<span class="volume_muted">
				<i class="fa-solid fa-volume-xmark"></i>
			</span>
		`;

		// Отключение звука у аудио трека
		audio.volume = 0;
		// Установка значения 0 для ширины полосы шкалы громкости
		volumeProgress.style.width = 0;
		// Изменение значения глобальной переменной
		volumeMuted = true;
		// Установка цифрового отображаемого значения громкости
		volumeValueSpan.innerText = '0%';
	} else {
		// Если звук отключен
		// Отображение иконки звука, исходя из значения громкости внутри шкалы слайдера
		volumeIcon.innerHTML =
			volumeSlider.value >= 50
				? `
			<span class="volume_low">
				<i class="fa-solid fa-volume-high"></i>
			</span>
    		`
				: `
			<span class="volume_low">
				<i class="fa-solid fa-volume-low"></i>
			</span>
			`;

		// Установка громкости аудио трека, основываясь на значении громкости внутри шкалы слайдера
		audio.volume = volumeSlider.value / 100;
		// Установка ширины полосы громкости, основываясь на текущем значении отображаемой громкости
		volumeProgress.style.width = volumeVal;
		// Изменение значения глобальной переменной
		volumeMuted = false;
		// Установка цифрового отображаемого значения громкости
		volumeValueSpan.innerText = volumeSlider.value + '%';
	}
});

/* Обработчик событий после загрузки данных аудио */
audio.addEventListener('loadeddata', () => {
	// Отображение длительности трека
	setTime(fullTime, audio.duration);

	// Установка максимального значения для шкалы времени
	timelineSlider.setAttribute('max', audio.duration);
});

/* Обработчик клика по кнопке "Предыдущий трек" */
prevBtn.addEventListener('click', goToPrevTrack);

/* Функция для переключения на предыдущий трек */
function goToPrevTrack() {
	// Уменьшение значения ID для глобальной перменной
	trackId--;

	// Если ID меньше нуля, то выполняется переход к последнему треку
	if (trackId < 0) {
		trackId = tracks.length - 1;
	}

	// Загрузка трека
	loadTrack();
	// Переключение трека
	switchTrack();
}

/* Обработчик клика по кнопке "Следующий трек" */
nextBtn.addEventListener('click', goToNextTrack);

/* Функция для переключения на следующий трек */
function goToNextTrack() {
	// Увеличение значения ID для глобальной перменной
	trackId++;

	// Если ID больше количества треков, то выполняется переход к первому треку
	if (trackId > tracks.length - 1) {
		trackId = 0;
	}

	// Загрузка трека
	loadTrack();
	// Переключение трека
	switchTrack();
}

/* Когда весь плейлист отыграл, аудио начинается заново с первого трека */
audio.addEventListener('ended', goToNextTrack);
