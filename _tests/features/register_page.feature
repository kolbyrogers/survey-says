Feature: Register page

    Scenario: Register with no name
        Given I navigate to survey-says
        When I navigate to the register page
        And I register with no name
        Then I expect to see username error

    Scenario: Register as existing user
        Given I navigate to survey-says
        When I navigate to the register page
        And I register as an existing user
        Then I expect to see unique email error

    Scenario: Register with no email
        Given I navigate to survey-says
        When I navigate to the register page
        And I register with no email
        Then I expect to see email error

    Scenario: Register with no email, password, or name
        Given I navigate to survey-says
        When I navigate to the register page
        And I register with no email, password, or name
        Then I expect to see email error
        And I expect to see password error
        And I expect to see username error
    
    Scenario: Register with no password
        Given I navigate to survey-says
        When I navigate to the register page
        And I register with no password
        Then I expect to see password error

    Scenario: Register as a new user
        Given I navigate to survey-says
        When I navigate to the register page
        And I register as a new user
        Then I expect to be on the home page