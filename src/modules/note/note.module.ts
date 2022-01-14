import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { Note } from '../../common/entity/note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { Message } from '../../common/entity/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note,User,Message]),
  ],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService]
})
export class NoteModule {}