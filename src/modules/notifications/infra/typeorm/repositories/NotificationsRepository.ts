import { MongoRepository, getMongoRepository } from 'typeorm'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }

  public async findAll(): Promise<Notification[]> {
    return await this.ormRepository.find()
  }

  public async create(
    notificationData: ICreateNotificationDTO,
  ): Promise<Notification> {
    const notification = this.ormRepository.create(notificationData)

    await this.ormRepository.save(notificationData)

    return notification
  }
}

export default NotificationsRepository
