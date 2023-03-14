import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helper/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return { statusCode: 200, body: undefined }
  }
}
