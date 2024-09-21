import { Controller, Get, Post, Query, Req, Param, Res, Header, HttpCode, HttpRedirectResponse, Redirect, Inject, UseFilters, HttpException, ParseIntPipe, Body, UsePipes, UseInterceptors, UseGuards } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { title } from 'process';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from 'prisma'
import { ValidationFilter } from 'src/validation/validation.filter';
import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';

@Controller('/api/users')
export class UserController {
    constructor(
        private service: UserService,
        private connection: Connection,
        private mailService: MailService,
        private userRepository: UserRepository,
        @Inject('EmailService') private emailService: MailService,
        private memberService: MemberService,
    ) { }

    @Get('/connection')
    async getConnection(): Promise<string> {
        this.emailService.send();
        this.mailService.send();
        console.info(this.memberService.getConnectionName());
        this.memberService.sendEmail();
        return this.connection.getName();
    }

    @Get('/create')
    async create(
        @Query('first_name') firstName: string,
        @Query('last_name') lastName: string,
    ): Promise<User> {
        if (!firstName) {
            throw new HttpException(
                {
                    code: 400,
                    errors: 'first name is required',
                },
                400,
            );
        }
        return this.userRepository.save(firstName, lastName);
    }
        
    @Get('/hello')
    // @UseFilters(ValidationFilter)
    async sayHello(
        @Query("name") name: string,
    ): Promise<string> {
        return this.service.sayHello(name);
    }

    @UsePipes(new ValidationPipe(loginUserRequestValidation))
    @UseFilters(ValidationFilter)
    @Post('/login')
    @Header('Content-Type', 'application/json')
    @UseInterceptors(TimeInterceptor)
    login(@Query('name') name: string, @Body() request: LoginUserRequest) {
        return {
            data: `Hello ${request.username}`,
        };
    }

    @Get('/current')
    @Roles(['Admin', 'Operator'])
    current(@Auth() user: User): Record<string, any> {
        return {
            data: `Hello ${user.first_name} ${user.last_name}`,
        };
    }

    @Get("/sample-response")
    @Header("Content-Type", "application/json")
    @HttpCode(200)
    sampleResponse() : Record<string, string> {
        return {
            data: 'Hello JSON',
        };
    }
    
    @Get('/redirect')
    @Redirect()
    redirect(): HttpRedirectResponse {
        return {
            url: '/api/users/sample-response',
            statusCode: 301,
        };
    }
    @Get('/set-cookie')
    setCookies(@Query('name') name: string, @Res() response: Response) {
        response.cookie('name', name);
        response.status(200).send('Success Set Cookie');
    }

    @Get('/get-cookie')
    getCookie(@Req() request: Request): string {
        return request.cookies['name'];
    }

    @Get('/view/hello')
    viewHello(@Query('name') name: string, @Res() response: Response) {
        response.render('index.html', {
            title: 'Template Engine',
            name: name,
        });
    }

    @Get('/:id')
    getById(@Param('id', ParseIntPipe) id: number): string {
        console.log(id * 10);
        return `GET ${id}`;
    }

    @Post()
    post(): string {
        return 'POST';
    }

    @Get("/sample")
    get(): string {
        return 'GET';
    }
}
