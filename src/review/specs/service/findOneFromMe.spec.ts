import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FileUploadService } from '@/file/file.service';
import { ConfigService } from '@nestjs/config';
import { Photo, PhotoType } from '@/schema/photo.schema';
import { ReviewService } from '../../review.service';
import { IReview } from '../../types/interfaces/review.do';
import { PlaceType } from '../../dto/reviewDto/base-review.dto';

interface IPhoto extends Photo {
  _id: string;
}
interface IReviews extends IReview {
  _id: string;
  photos: IPhoto[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

describe('ReviewService.findOneFromMe', () => {
  let service: ReviewService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        FileUploadService,
        ConfigService,
        {
          provide: getModelToken('Review'),
          useValue: {},
        },
        {
          provide: getModelToken('Photo'),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
  }, 10000);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a review object when call findOneFromMe and reviewId match with current_userId', async () => {
    const reviewId: string = '6563d53576d44b652b8961d8';
    const current_userId: string = '655c94215ad11af262220c2f';

    const mockResult: IReviews = {
      _id: '6563d53576d44b652b8961d8',
      title: 'depereo subito viduo',
      description:
        'Torrens chirographum vitiosus aspernatur tribuo tandem. Suppono ad tabesco termes. Tui spero cotidie.',
      rating: 4,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c2f',
          _id: '655c94255ad11af262221be2',
        },
      ],
      userId: '655c94215ad11af262220c2f',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: PlaceType.ATTRACTION,
      createdAt: '2023-11-21T11:27:33.698Z',
      updatedAt: '2023-11-21T11:27:33.698Z',
      __v: 0,
    };

    const mockedReviewServiceFindOne = jest.spyOn(service, 'findOne');

    mockedReviewServiceFindOne.mockResolvedValueOnce(mockResult as any);

    const result = await service.findOneFromMe(reviewId, current_userId);

    expect(mockedReviewServiceFindOne).toBeCalledWith('6563d53576d44b652b8961d8');

    expect(result).toEqual({
      _id: '6563d53576d44b652b8961d8',
      title: 'depereo subito viduo',
      description:
        'Torrens chirographum vitiosus aspernatur tribuo tandem. Suppono ad tabesco termes. Tui spero cotidie.',
      rating: 4,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c2f',
          _id: '655c94255ad11af262221be2',
        },
      ],
      userId: '655c94215ad11af262220c2f',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: PlaceType.ATTRACTION,
      createdAt: '2023-11-21T11:27:33.698Z',
      updatedAt: '2023-11-21T11:27:33.698Z',
      __v: 0,
    });

    mockedReviewServiceFindOne.mockRestore();
  });

  it('should return Unauthorized when call findOneFromMe and reviewId not match with current_userId', async () => {
    const reviewId: string = '6563d53576d44b652b8961d8';
    const current_userId: string = '655c94215ad11af262220c33';

    const mockResult: IReviews = {
      _id: '6563d53576d44b652b8961d8',
      title: 'depereo subito viduo',
      description:
        'Torrens chirographum vitiosus aspernatur tribuo tandem. Suppono ad tabesco termes. Tui spero cotidie.',
      rating: 4,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c2f',
          _id: '655c94255ad11af262221be2',
        },
      ],
      userId: '655c94215ad11af262220c2f',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: PlaceType.ATTRACTION,
      createdAt: '2023-11-21T11:27:33.698Z',
      updatedAt: '2023-11-21T11:27:33.698Z',
      __v: 0,
    };

    const mockedReviewServiceFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(mockResult as any);

    expect(service.findOneFromMe(reviewId, current_userId)).rejects.toThrowError(
      'You have no permission to access this resource!'
    );

    expect(mockedReviewServiceFindOne).toBeCalledWith('6563d53576d44b652b8961d8');
  });
});
