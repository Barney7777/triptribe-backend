import { User } from '@/user/schema/user.schema';
import { Review } from '@/review/schema/review.schema';

export class UserReview {
  creator: User;
  reviews: Review[];
}
