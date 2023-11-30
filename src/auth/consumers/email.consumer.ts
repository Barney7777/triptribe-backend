import { QUEUE_NAME_SEND_EMAIL, QUEUE_PROCESS_REGISTER } from '@/common/constant/queue.constant';
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor(QUEUE_NAME_SEND_EMAIL)
export class EmailConsumer {
  constructor(private readonly mailService: MailerService) {}
  @Process(QUEUE_PROCESS_REGISTER)
  async registerEmail(job: Job) {
    console.log('JobId:', job.id);
    console.log('jobData:', job.data);
    // send the welcome email here
    const { data } = job; // get data from job
    //send email for next step
    await this.mailService.sendMail({
      to: data.email,
      from: 'trip-trib@gmail.com',
      subject: 'Testing Nest MailerModule',
      template: 'welcome',
      context: {},
    });
  }
}
