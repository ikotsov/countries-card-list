"use strict";

class CountriesDOM {
  constructor() {
    this.utils = new CountriesUtils();
  }

  addBtnListener(btnElement, onClickAsync) {
    const that = this;
    btnElement.addEventListener("click", async () => {
      that.clearContent();
      that.renderLoader();
      btnElement.disabled = true;

      try {
        await onClickAsync();
      } catch (error) {
        this.renderError(error.message);
      } finally {
        this.selectors().countriesContainer.style.opacity = 1;
      }

      that.removeLoader();
      btnElement.disabled = false;
    });
  }

  renderCountry(country) {
    const languageCode =
      this.utils.langCodeMapper.get(country.name.common) ?? undefined;

    const html = `
      <article class="country">
        <img class="country__img" src="${country.flags.svg}" />
        <div class="country__data">
          <h3 class="country__name">${country.name.common}</h3>
          <h4 class="country__region">${country.region}</h4>
          <p class="country__info"><span>🧑‍🤝‍🧑</span>${this.utils.formatPopulation(
            country.population
          )}</p>
          <p class="country__info"><span>🗣️</span>${
            country.languages[languageCode] ?? "Not defined"
          }</p>
          <p class="country__info"><span>🪙</span>${
            country.currencies.EUR.name
          }</p>
        </div>
      </article>`;

    this.selectors().countriesContainer.insertAdjacentHTML("beforeend", html);
  }

  renderError(message) {
    const html = `<p class="error-text">${message}</p>`;

    this.selectors().countriesContainer.insertAdjacentHTML("beforeend", html);
  }

  renderLoader() {
    const html = `<div class="loader"></div>`;

    this.selectors().mainContainer.insertAdjacentHTML("beforeend", html);
  }

  removeLoader() {
    document.querySelector(".loader").remove();
  }

  clearContent() {
    this.selectors().countriesContainer.innerHTML = "";
    this.selectors().countriesContainer.style.opacity = 0;
  }

  selectors() {
    return {
      mainContainer: document.querySelector(".main"),
      countriesContainer: document.querySelector(".countries"),
      countriesBtn: document.querySelector(".btn-country"),
      currentCountryBtn: document.querySelector(".btn-whereami"),
    };
  }
}

class CountriesUtils {
  langCodeMapper = new Map([
    ["Portugal", "por"],
    ["France", "fra"],
    ["Germany", "deu"],
    ["Spain", "spa"],
    ["Greece", "ell"],
  ]);

  formatPopulation(population) {
    if (typeof population !== "number") return;
    return `${(population / 1000000).toFixed(1)} M`;
  }
}

class CountriesService {
  mainCountriesUrl = "https://restcountries.com/v3.1/alpha";
  mainCountryUrl = "https://restcountries.com/v3.1/name";

  async fetchCountries({ codeOne, codeTwo, codeThree, codeFour }) {
    const response = await fetch(
      `${this.mainCountriesUrl}/?codes=${codeOne},${codeTwo},${codeThree},${codeFour}`
    );

    const data = await response.json();
    return data;
  }

  async fetchCountry(countryName) {
    const response = await fetch(`${this.mainCountryUrl}/${countryName}`);
    if (response.ok) {
      const [data] = await response.json();
      return data;
    }
  
    const data = await response.json();
    if (response.status === 404) throw new Error(data.message);

    return data;
  }
}

class GeolocationService {
  constructor() {
    this.run();
  }

  currentCountry = "";
  run() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentCountry = await this.fetch(
          position.coords.latitude,
          position.coords.longitude
        );
        this.currentCountry = currentCountry;
      },
      () => (this.currentCountry = undefined)
    );
  }

  mainUrl = "https://geocode.xyz";
  async fetch(lat, long) {
    const response = await fetch(`${this.mainUrl}/${lat},${long}?geoit=json`);
    if (response.ok) {
      const data = await response.json();
      return data.country;
    }
  }
}

const geoLocator = new GeolocationService();
const domMutator = new CountriesDOM();
const service = new CountriesService();

const countriesBtn = domMutator.selectors().countriesBtn;
const onClickCountries = async () => {
  const data = await service.fetchCountries({
    codeOne: "PT",
    codeTwo: "ES",
    codeThree: "FR",
    codeFour: "DE",
  });

  data.map((c) => domMutator.renderCountry(c));
};
domMutator.addBtnListener(countriesBtn, onClickCountries);

const currentCountryBtn = domMutator.selectors().currentCountryBtn;
const onClickCurrentCountry = async () => {
  const data = await service.fetchCountry(geoLocator.currentCountry);

  domMutator.renderCountry(data);
};
domMutator.addBtnListener(currentCountryBtn, onClickCurrentCountry);
