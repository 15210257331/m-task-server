import { Controller, Get, Body, UseGuards, Post, UsePipes, Delete, Param, Request, Query, ParseIntPipe, ClassSerializerInterceptor, UseInterceptors, Res, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as urlencode from 'urlencode';
import { ConfigService } from '@nestjs/config';

@ApiTags('用户相关')
@Controller('/user')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private configService: ConfigService,
    ) { }

    // 登录
    @Post('/login')
    // @UseGuards(AuthGuard('local'))
    @UsePipes(new ValidationPipe())
    public async login(@Body() loginDTO: LoginDTO,): Promise<any> {
        return this.userService.login(loginDTO);
    }

    // 跳转微信扫码页面
    @Get('/wechatLogin')
    public async wechatLogin(@Headers() header, @Res() res): Promise<any> {
        const APPID = this.configService.get('secretId');
        const host = this.configService.get('HOST');
        const redirectUri = urlencode(host);
        res.redirect(
            `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`,
        );
    }

    // 微信登录
    @Post('wechat')
    async loginWithWechat(@Body('code') code: string) {
        return this.userService.loginWithWechat(code);
    }

    // 注册
    @Post('/register')
    @UsePipes(new ValidationPipe())
    public async register(@Body() data: RegisterDTO): Promise<any> {
        return this.userService.register(data);
    }

    // 向手机发送验证码
    @Post('/code')
    @UsePipes(new ValidationPipe())
    public async code(@Body() data: any): Promise<any> {
        return this.userService.sendVerificationCode(data);
    }

    // 获取用户信息
    @Get('/info')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    // 使用此拦截器结合entity中的Exclude装饰器可以查询数据时隐藏相应的字段
    @UseInterceptors(ClassSerializerInterceptor)
    public async getUserInfo(@Request() request: any): Promise<any> {
        return this.userService.getUserInfo(request);
    }

    // 用户删除
    @Get('/delete/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async deleteUser(@Param('id') id: number | string): Promise<any> {
        return this.userService.deleteUser(id);
    }

    // 更新用户信息
    @Post('/update')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe())
    public async updateUserInfo(@Body() data: any, @Request() request: any): Promise<any> {
        return this.userService.updateUserInfo(data, request);
    }

    // 分页查询用户列表
    @UseGuards(AuthGuard('jwt'))
    @Post('/list')
    public async list(@Body() body: any): Promise<any> {
        return this.userService.userList(body);
    }

    // 为用户关联角色
    @Post('/setRole')
    @UseGuards(AuthGuard('jwt'))
    public async setRole(@Body() body: any, @Request() request: any): Promise<any> {
        return this.userService.setRole(body, request);
    }

    // 查询用户关联的角色
    @Get('/getRole')
    @UseGuards(AuthGuard('jwt'))
    public async getRole(@Query('id', new ParseIntPipe()) id: number): Promise<any> {
        return this.userService.getRole(id);
    }
}
