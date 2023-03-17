import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helper/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return { statusCode: 200, body: undefined }
    } catch (_) {
      return serverError()
    }
  }
}
