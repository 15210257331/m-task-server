import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { NotificationDetail } from './notification-detail.entity';
import { User } from '../../user/entity/user.entity';

// 用户消息表 储存用户的消息

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'bool',
    name: 'read',
    default: false,
    comment: '是否已读',
  })
  read: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'sendDate',
    comment: '发送时间',
  })
  sendDate: Date;

  @ManyToOne(() => NotificationDetail)
  @JoinColumn()
  detail: NotificationDetail;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn()
  belong: User;
}
