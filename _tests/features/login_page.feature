Feature: Login page

    Scenario: Log in with invalid credentials
        Given I navigate to survey-says
        When I login with invalid credentials
        Then I expect to see login errors

    Scenario: Cant log in without entering password
        Given I navigate to survey-says
        When I try to login with no password
        Then I expect to not be able to login

    Scenario: Log in with valid credentials
        Given I navigate to survey-says
        When I login with valid credentials
        Then I expect to be on the home page
        When I click the logout button
        Then I expect to be on the login page
