import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from '@mas/auth';
import { ContactService } from './contact.service';
import { ContactInput } from './contact.input';

@Resolver()
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Send a contact message from the portfolio landing page.
   * Public — no JWT required. Rate-limited to 3 requests per 10 minutes per IP.
   */
  @Public()
  @UseGuards(ThrottlerGuard)
  @Mutation(() => Boolean, { description: 'Send a contact message from the portfolio.' })
  async sendContactMessage(@Args('input') input: ContactInput): Promise<boolean> {
    await this.contactService.send(input);
    return true;
  }
}
