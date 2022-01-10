# Description

This is a small Javascript app that consumes the <a href="https://restcountries.com/" target="_blank">REST countries</a> public API.

Two buttons are rendered. One for fetching a couple of countries and another one for fetching the country of the location of the user.

The location of the user is requested as soon as the page is loaded and handled using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API" target="_blank">Geolocation API</a>.

From a technical perspective, basic OOP principles have been implemented (e.g. delegation) along with the inversion of control programming principle.
