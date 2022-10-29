Feature: Make survey

    Scenario: Create with no title
        Given I navigate to survey-says
        When I login with valid credentials
        Then I expect to be on the home page
        When I click the make survey button
        Then I expect to be on the make survey page
        When I enter "Test Title" into the title field
        And I click the create survey button
        Then I expect to see the prompt error

    Scenario: Create with no prompt
        Given I navigate to survey-says
        When I click the make survey button
        Then I expect to be on the make survey page
        When I enter "Test Prompt" into the survey prompt field
        And I click the create survey button
        Then I expect to see the title error

    Scenario: Create with no title or prompt
        Given I navigate to survey-says
        When I click the make survey button
        Then I expect to be on the make survey page
        And I click the create survey button
        Then I expect to see the title error
        And I expect to see the prompt error
        When I navigate to survey-says
        When I click the logout button
        Then I expect to be on the login page
    