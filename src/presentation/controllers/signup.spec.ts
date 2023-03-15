import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { type EmailValidator } from '../protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStup: EmailValidator
}

const makeSut = (): SutTypes => {
  // Return a fixed value for testing
  class EmailValidatorStup implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStup = new EmailValidatorStup()
  const sut = new SignUpController(emailValidatorStup)

  return {
    sut,
    emailValidatorStup
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@main.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@main.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@main.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStup } = makeSut()

    // Spy method isValid of this instance and mock the return value to false
    jest.spyOn(emailValidatorStup, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@main.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStup } = makeSut()

    // Get the spy for the isValid method
    const isValidSpy = jest.spyOn(emailValidatorStup, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@main.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)

    // Check if the email was passed correctly to the isValid function inside our test
    expect(isValidSpy).toHaveBeenCalledWith('any_email@main.com')
  })

  test('Should return 500 if email validator throws', () => {
    // Return a fixed value for testing
    class EmailValidatorStup implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStup = new EmailValidatorStup()
    const sut = new SignUpController(emailValidatorStup)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@main.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
