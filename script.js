'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      const map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // handlich clicks on map
    this.#map.on('click', this._showform.bind(this));
  }

  _showform(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositve = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();
    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if activity running , creat running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // ckeck if data is valid

      if (
        //* !Number.isFinite(distance) ||
        //*  !Number.isFinite(duration) ||
        //* !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositve(distance, duration, cadence)
      )
        return alert('Inputs have to be positive number!');
      workout = new Running([lat, lng], distance, duration, cadence);
      console.log(workout);
    }

    // if workout cycling, creat cyvling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositve(distance, duration)
      )
        return alert('Inputs have to be positive number!');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // add new object to workout array
    this.#workout.push(workout);
    // render workout on map as marker
    this.renderWorkoutMarker(workout);
    // render workout on list

    // hide form + clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.vaue =
      inputElevation.value =
        '';
  }

      L.marker(coords)
        .addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
    },
    function () {
      alert('Could not get your position');
    }
  );
