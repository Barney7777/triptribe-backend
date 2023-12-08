import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { GraphQLCurrentUser } from '@/auth/CurrentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/auth/utils/gqlAuthGuard.strategy';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    description: 'Get ME',
  })
  @UseGuards(GqlAuthGuard)
  getMe(@GraphQLCurrentUser() currentUser): User {
    return this.userService.getMe(currentUser);
  }

  @Query(() => User, {
    description: 'Get user by id',
  })
  @UseGuards(GqlAuthGuard)
  async getOneUser(
    @Args('id', { type: () => ID })
    id: string
  ): Promise<User> {
    return this.userService.findOne(id);
  }
}
