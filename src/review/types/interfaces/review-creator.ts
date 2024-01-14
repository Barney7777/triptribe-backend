import { User } from '@/user/schema/user.schema';
import { Review } from '@/review/schema/review.schema';
export interface ReviewCreator extends Review {
  creator: User;
}
