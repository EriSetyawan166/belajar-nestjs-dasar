import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "../connection/connection";
import { PrismaService } from "src/prisma/prisma/prisma.service";
import { User } from "prisma";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class UserRepository {
    constructor(
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    ) {
        this.logger.info('Create User Repository');
    }

    async save(firstname: string, lastname?: string): Promise<User> {
        this.logger.info(
            `create user with firstname ${firstname} and lastname ${lastname}`
        );
        return this.prismaService.user.create({
            data: {
                first_name: firstname,
                last_name: lastname,
            }
        })
    }
}