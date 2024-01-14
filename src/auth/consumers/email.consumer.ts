import { QUEUE_NAME_SEND_EMAIL, QUEUE_PROCESS_REGISTER } from '@/common/constant/queue.constant';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from '@/user/user.service';
import nodemailer from 'nodemailer';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

@Processor(QUEUE_NAME_SEND_EMAIL)
export class EmailConsumer {
  constructor(private readonly userService: UserService) {}

  @Process(QUEUE_PROCESS_REGISTER)
  async processSendRegisterEmailVerification(job) {
    try {
      const createdUserId = job.data.userId;
      const hostname = job.data.hostname;
      const user = await this.userService.findOne(createdUserId);
      console.log('consumer', user);
      const token = user.emailToken;
      const email = user.email;
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const jobData = {
        data: {
          sendVerificationEmailDto: {
            email,
            token,
            createdUserId,
            hostname,
          },
        },
      } as Job<{
        sendVerificationEmailDto: {
          email: string;
          token: string;
          createdUserId: string;
          hostname: string;
        };
      }>;
      await this.sendVerificationEmail(jobData);
    } catch (error) {
      return { message: error.message };
    }
  }

  async sendVerificationEmail(job: Job<{ sendVerificationEmailDto }>) {
    const sendVerificationEmailDto = job.data.sendVerificationEmailDto;
    const hostname = sendVerificationEmailDto.hostname;
    const templatePath = 'src/templates/email-verifiy-template.html';
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    const baseVerificationLink = isDevEnvironment
      ? 'http://localhost:3000/verify'
      : `http://${hostname}/verify`;
    const verificationLink = `${baseVerificationLink}?token=${sendVerificationEmailDto.token}`;
    console.log('verificationLink', verificationLink);
    const user = await this.userService.findOne(sendVerificationEmailDto.createdUserId);
    const userNickName = user.nickname;

    const emailContent = templateContent
      .replace('{{ userNickName }}', userNickName)
      .replace('{{ verificationLink }}', verificationLink);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'triptribegroup@gmail.com',
        pass: 'kneb ibye buka witq',
      },
    });

    const mailOptions = {
      from: 'triptribegroup@gmail.com',
      to: sendVerificationEmailDto.email,
      subject: 'Email Verification',
      html: emailContent,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return { jobId: job.id };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
