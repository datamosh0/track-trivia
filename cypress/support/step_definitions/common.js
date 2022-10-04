import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the {string} page", (path) => {
  cy.visit(path);
});

When(`I click on the {string} link`, (link) => {
  cy.get(`[data-cy="${link}"]`).click();
});

Then(`I see {string} in the url`, (path) => {
  cy.url().should("include", path);
});

Then(`I see {string} on the page`, (text) => {
  cy.contains(text, { matchCase: false });
});

Then(`I see {string} in the {string}`, (text, element) => {
  cy.get(`[data-cy="${element}"]`).contains(text);
});

Then(`I wait for the song`, () => {
  cy.wait(11000);
});
Then(`I wait for the timer`, () => {
  cy.wait(4000);
});

Then(`I wait for the audio to play`, () => {
  cy.get(`[data-cy="audioRef"]`).should((els) => {
    let audible = false;
    els.each((i, el) => {
      console.log(el);
      console.log(el.duration, el.paused, el.muted);
      if (el.duration > 0 && !el.paused && !el.muted) {
        audible = true;
      }

      // expect(el.duration > 0 && !el.paused && !el.muted).to.eq(false)
    });
    expect(audible).to.eq(true);
  });
});
