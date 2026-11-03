import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleDestroy {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.getOrThrow<string>('SMTP_HOST'),
      port: Number(this.config.getOrThrow<string>('SMTP_PORT')),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.getOrThrow<string>('SMTP_USER'),
        pass: this.config.getOrThrow<string>('SMTP_PASSWORD'),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');

    const verificationUrl = new URL('/verify-email', frontendUrl);
    verificationUrl.searchParams.set('token', token);

    await this.transporter.sendMail({
      from: this.config.getOrThrow<string>('SMTP_FROM'),
      to: email,
      subject: 'ยืนยันอีเมลของคุณ | Enterprise Chat',
      text: [
        'ยินดีต้อนรับสู่ Enterprise Chat',
        '',
        'กรุณายืนยันอีเมลของคุณผ่านลิงก์ด้านล่าง',
        verificationUrl.toString(),
        '',
        'ลิงก์นี้มีอายุ 15 นาที',
        'หากคุณไม่ได้สมัครสมาชิก สามารถละเว้นอีเมลนี้ได้',
      ].join('\n'),
    });

    this.logger.log('Verification email sent successfully');
  }

  async verifyConnection(): Promise<boolean> {
    return this.transporter.verify();
  }

  onModuleDestroy() {
    this.transporter.close();
  }
}
