Feature: Home page

    Scenario: Friend feed shows on home page
        Given I navigate to survey-says
        And I login with valid credentials
        Then I expect to be on the home page
        And I expect to see the friend feed

    Scenario: Navigate to explore page
        Given I navigate to survey-says
        When I click the explore button
        Then I expect to be on the explore page

    Scenario: Navigate to friends page
        Given I navigate to survey-says
        When I click the friends button
        Then I expect to be on the friends page

    Scenario: Navigate to make survey page
        Given I navigate to survey-says
        When I click the make survey button
        Then I expect to be on the make survey page

    Scenario: Logout button works
        Given I navigate to survey-says
        When I click the logout button
        Then I expect to be on the login page