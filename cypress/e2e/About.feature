Feature: About Page

  Testing features of the about Page
  
  Scenario: the title is there
    Given I open the "localhost:3000/" page
    Then I see "Welcome to Track Trivia" on the page

  Scenario: start quiz page works
    Given I open the "localhost:3000/" page
    When I click on the "Kanye West" link
    Then I see "start" in the url

  Scenario: start quiz and go back to home
    Given I open the "localhost:3000/" page
    When I click on the "Kanye West" link
    Then I see "5K4W6rqBFWDnAN6FQUkS6x" in the url
    When I click on the "goHomeBtn" link
    Then I see "Welcome to Track Trivia" on the page

  Scenario: full quiz functionality works
    Given I open the "localhost:3000/" page
    When I click on the "Kanye West" link
    Then I see "5K4W6rqBFWDnAN6FQUkS6x" in the url
    When I click on the "playBtn" link
    Then I see "3" on the page
    Then I wait for the timer
    Then I see 'play' in the url
    Then I wait for the song
    Then I see "listen AGAIN" on the page
    When I click on the "correct" link
    Then I see 'correct' on the page
    Then I see "Listen on Spotify" on the page
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "wrong1" link
    Then I see "wrong" on the page
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I wait for the audio to play
    When I click on the "correct" link
    When I click on the "continue" link
    Then I see "your score" on the page
    Then I see "avg score" on the page
    Then I see "share" on the page
    Then I see "replay" on the page
    Then I see "home" on the page
    When I click on the 'homeBtn' link
    Then I see "Welcome to Track Trivia" on the page

    