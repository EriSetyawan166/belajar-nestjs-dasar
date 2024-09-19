import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, createConnectio, MongoDBConnection, MySqlConnection } from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: Connection,
      useFactory: createConnectio,
      inject: [ConfigService],
    },
    {
      provide: MailService,
      useValue: mailService,
    },
    UserRepository,
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    MemberService
  ],
})
export class UserModule {}
