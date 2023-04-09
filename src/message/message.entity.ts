import { Injectable } from "@nestjs/common";
import { MaxLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity as TypeORMBase } from "typeorm";


@Injectable()
@Entity('messages')
export class Message extends TypeORMBase {
    @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
    public id: number

    @Column('bigint', {
        name: 'channelId'
    })
    public channelId: number;

    @Column('datetime', {
        name: 'created_at'
    })
    public createdAt: Date = new Date();

    @Column('bigint',{
        name: 'authorId'
    })
    public authorId: number;

    @Column('varchar', {
        name: 'content'
    })
    @MaxLength(255, {message: 'CHAT_MESSAGE_TOO_LONG'})
    public content: string;
}