import { Controller, Get, Post, Query, Req, Param, Res, Header, HttpCode, HttpRedirectResponse, Redirect } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/api/users')
export class UserController {
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

    @Get('/hello')
    sayHello(
        @Query("first_name") firstName: string,
        @Query("last_name") lastName : string,
    ): string {
        return `Hello ${firstName} ${lastName}`;
    }

    @Get('/:id')
    getById(@Param('id') id: string): string {
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
