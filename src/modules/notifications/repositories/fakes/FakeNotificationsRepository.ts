import { ObjectID } from 'mongodb'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = []

  public async findAll(): Promise<Notification[]> {
    return this.notifications
  }

  public async create(
    notificationData: ICreateNotificationDTO,
  ): Promise<Notification> {
    const notification = new Notification()

    Object.assign(notification, { id: new ObjectID() }, notificationData)

    this.notifications.push(notification)

    return notification
  }
}

export default FakeNotificationsRepository
