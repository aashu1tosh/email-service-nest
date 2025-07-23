// src/modules/mail/entities/message-log.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type MessageStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

@Entity('message_log')
export class MessageLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    queue: string;

    @Column('json')
    payload: any;

    @Column({ type: 'varchar' })
    status: MessageStatus;

    @Column({ nullable: true })
    error?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
