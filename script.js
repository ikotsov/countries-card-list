class Countries {
  portugalUrl = "https://restcountries.com/v3.1/name/portugal";
  countries = [];

  async fetch() {
    const response = await fetch(this.portugalUrl);
    const [data] = await response.json();
    this.countries.push(data);
    this.logData();
  }

  logData() {
    console.log(this.countries[0].name.common); // name
    console.log(this.countries[0].currencies.EUR.name); // currency
    console.log(this.countries[0].region); // where it belongs
    console.log(this.countries[0].languages.por); // spoken language
    console.log(this.countries[0].population); // people
    console.log(this.countries[0].flags.svg); // icon
  }
}
const countries = new Countries();
countries.fetch();
