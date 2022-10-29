import time

# main

@step('I navigate to survey-says')
def step_impl(context):
    context.execute_steps('''
        Given I open the url "https://survey-says-4200.herokuapp.com/"
        Then I wait on element "#app" to be visible
    ''')


@step('I expect to be on the home page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#welcomeTitle" to be visible
    ''')

@step('I am not logged in')
def step_impl(context):
    context.browser.request("DELETE", "https://survey-says-4200.herokuapp.com/session")

# login

@step('I expect to be on the login page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#signInEmail" to be visible
    ''')


@step('I login with valid credentials')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#signInEmail" to be visible
        When I set "test@test.com" to the inputfield "#signInEmail"
        And I set "asdf1234" to the inputfield "#signInPass"
        And I click on the element "#signInButton"
        And I pause for 1000ms
    ''')


@step('I try to login with no password')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#signInEmail" to be visible
        When I set "test@test.com" to the inputfield "#signInEmail"
    ''')


@step('I login with invalid credentials')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#signInEmail" to be visible
        When I set "INVALID" to the inputfield "#signInEmail"
        And I set "INVALID" to the inputfield "#signInPass"
        And I click on the element "#signInButton"
    ''')


@step('I expect to not be able to login')
def step_impl(context):
    context.execute_steps('''
        Then I expect that element "#signInButton" does not exist
    ''')


@step('I expect to see login errors')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#signInErrors" to be visible
    ''')

# register

@step('I register as a new user')
def step_impl(context):
    name = str(time.time())
    email = name + "@test.com"
    context.execute_steps('''
        Then I wait on element "#registerEmail" to be visible
        When I set "{}" to the inputfield "#registerName"
        And I set "{}" to the inputfield "#registerEmail"
        And I set "asdf1234" to the inputfield "#registerPass"
        And I click on the element "#registerButton"
        And I pause for 1000ms
    '''.format(name, email))

@step('I expect to see unique email error')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerErrors" to be visible
        Then I expect that element "#registerErrors" contains the text "Email is already associated with an account."
    ''')

@step('I expect to see email error')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerErrors" to be visible
        Then I expect that element "#registerErrors" contains the text "Please enter a valid email address"
    ''')

@step('I expect to see username error')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerErrors" to be visible
        Then I expect that element "#registerErrors" contains the text "Username must be more than 2 characters"
    ''')

@step('I expect to see password error')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerErrors" to be visible
        Then I expect that element "#registerErrors" contains the text "Password must be more than 8 characters"
    ''')

@step('I navigate to the register page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#signUpButton" to be visible
        When I click on the element "#signUpButton"
        Then I wait on element "#registerName" to be visible
    ''')

@step('I register as an existing user')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerName" to be visible
        When I set "test" to the inputfield "#registerName"
        And I set "test@test.com" to the inputfield "#registerEmail"
        And I set "asdf1234" to the inputfield "#registerPass"
        And I click on the element "#registerButton"
        ''')

@step('I register with no password')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerName" to be visible
        When I set "test" to the inputfield "#registerName"
        And I set "test@test.com" to the inputfield "#registerEmail"
        And I click on the element "#registerButton"
        ''')

@step('I register with no email')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerName" to be visible
        When I set "test" to the inputfield "#registerName"
        And I set "asdf1234" to the inputfield "#registerPass"
        And I click on the element "#registerButton"
        ''')

@step('I register with no email, password, or name')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerButton" to be visible
        When I click on the element "#registerButton"
        ''')

@step('I register with no name')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#registerEmail" to be visible
        When I set "test@test.com" to the inputfield "#registerEmail"
        And I set "asdf1234" to the inputfield "#registerPass"
        And I click on the element "#registerButton"
        ''')

# home

@step('I expect to see the friend feed')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#friendFeed" to be visible
    ''')

@step('I click the explore button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#exploreButton" to be visible
        When I click on the element "#exploreButton"
    ''')

@step('I click the logout button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#logoutButton" to be visible
        When I click on the element "#logoutButton"
        And I pause for 3000ms
    ''')

@step('I click the friends button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#friendsButton" to be visible
        When I click on the element "#friendsButton"
    ''')

@step('I click the make survey button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#makeSurveyButton" to be visible
        When I click on the element "#makeSurveyButton"
    ''')

@step('I click the home button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#homeButton" to be visible
        When I click on the element ".home-button"
    ''')

@step('I expect to be on the explore page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#exploreTitle" to be visible
    ''')

@step('I expect to be on the friends page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#friendTitle" to be visible
    ''')

@step('I expect to be on the make survey page')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#makeSurveyTitle" to be visible
    ''')

@step('I enter "{title}" into the title field')
def step_impl(context, title):
    context.execute_steps('''
        Then I wait on element "#inputTitle" to be visible
        When I set "{}" to the inputfield "#inputTitle"
    '''.format(title))

@step('I enter "{prompt}" into the survey prompt field')
def step_impl(context, prompt):
    context.execute_steps('''
        Then I wait on element "#inputPrompt" to be visible
        When I set "{}" to the inputfield "#inputPrompt"
    '''.format(prompt))

@step('I click the create survey button')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#createSurveyButton" to be visible
        When I click on the element "#createSurveyButton"
    ''')

@step('I expect to see the prompt error')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#creationErrors" to be visible
        Then I expect that element "#creationErrors" contains the text "Prompt must be at least 3 characters"
    ''')

@step('I expect to see the title error')
def step_impl(context):
    context.execute_steps('''
        Then I wait on element "#creationErrors" to be visible
        Then I expect that element "#creationErrors" contains the text "Title must be at least 3 characters"
    ''')