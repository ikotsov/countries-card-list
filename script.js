"use strict";

class CountriesDOM {
  constructor() {
    this.api = new CountriesAPI();
  }

  selectors() {
    return {
      countriesContainer: document.querySelector(".countries"),
    };
  }

  async add(countryName) {
    const data = await this.api.fetch(countryName);

    const html = `
    <article class="country">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>🧑‍🤝‍🧑</span>${data.population}</p>
        <p class="country__row"><span>🗣️</span>${data.languages.por}</p>
        <p class="country__row"><span>🪙</span>${data.currencies.EUR.name}</p>
      </div>
    </article>`;

    this.selectors().countriesContainer.insertAdjacentHTML("beforeend", html);
  }
}
class CountriesAPI {
  mainUrl = "https://restcountries.com/v3.1/name";

  async fetch(country) {
    const response = await fetch(`${this.mainUrl}/${country}`);
    const [data] = await response.json();
    return data;
  }
}

const countries = new CountriesDOM();
countries.add("portugal");
