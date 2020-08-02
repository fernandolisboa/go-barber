import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ShowProfileService from '@modules/users/services/ShowProfileService'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id

    const showProfile = container.resolve(ShowProfileService)

    const user = await showProfile.execute({ userId })

    delete user.password

    return response.json(user)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id

    const { name, email, old_password, new_password } = request.body

    const updateProfile = container.resolve(UpdateProfileService)

    const user = await updateProfile.execute({
      userId,
      name,
      email,
      old_password,
      new_password,
    })

    delete user.password

    return response.json(user)
  }
}

export default ProfileController