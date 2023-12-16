import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FileUploadService } from '@/file/file.service';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Photo, PhotoType } from '@/schema/photo.schema';
import { ReviewService } from '../../review.service';
import { Review } from '../../schema/review.schema';
import { IReview } from '../../types/interfaces/review.do';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME_DATABASE_SYNC } from '@/common/constant/queue.constant';

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

describe('ReviewService.create', () => {
  let service: ReviewService;
  let fileService: FileUploadService;
  let reviewModel: Model<Review>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: QUEUE_NAME_DATABASE_SYNC,
        }),
      ],
      providers: [
        ReviewService,
        FileUploadService,
        ConfigService,
        {
          provide: getModelToken('Review'),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken('Photo'),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
    fileService = module.get<FileUploadService>(FileUploadService);
    reviewModel = module.get<Model<Review>>(getModelToken('Review'));
  }, 10000);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a review with photos:[] when call create and files is empty array', async () => {
    const current_userId: string = '655c94215ad11af262220c33';

    const mockParams = {
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      photos: [],
      userId: '655c94215ad11af262220c33',
      createdAt: new Date('2023-11-27T00:28:24.250Z'),
      updatedAt: new Date('2023-11-27T00:28:24.250Z'),
    };

    const mockResult: IReviews = {
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      photos: [],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      _id: '6563e2a8d74487a4439c2254',
      createdAt: '2023-11-27T00:28:24.250Z',
      updatedAt: '2023-11-27T00:28:24.250Z',
      __v: 0,
    };

    const mockedReviewModelCreate = jest
      .spyOn(reviewModel, 'create')
      .mockReturnValueOnce(mockResult as any);

    const result = await service.create([], mockParams, current_userId);

    expect(mockedReviewModelCreate).toBeCalledWith({
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      photos: [],
      userId: '655c94215ad11af262220c33',
      createdAt: new Date('2023-11-27T00:28:24.250Z'),
      updatedAt: new Date('2023-11-27T00:28:24.250Z'),
    });

    expect(result).toEqual({
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      photos: [],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      _id: '6563e2a8d74487a4439c2254',
      createdAt: '2023-11-27T00:28:24.250Z',
      updatedAt: '2023-11-27T00:28:24.250Z',
      __v: 0,
    });
  });

  it('should return a review with photos data when call create and files is not empty array', async () => {
    const current_userId: string = '655c94215ad11af262220c33';

    const mockFiles = [
      {
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake file content', 'utf-8'),
        originalname: 'originalname',
        encoding: 'encoding',
      },
      {
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake file content', 'utf-8'),
        originalname: 'originalname',
        encoding: 'encoding',
      },
    ];

    const mockParams = {
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      photos: [],
      userId: '655c94215ad11af262220c33',
      createdAt: new Date('2023-11-27T00:28:24.250Z'),
      updatedAt: new Date('2023-11-27T00:28:24.250Z'),
    };

    const mockResult: IReviews = {
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221be2',
        },
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee533 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221b66',
        },
      ],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      _id: '6563e2a8d74487a4439c2254',
      createdAt: '2023-11-27T00:28:24.250Z',
      updatedAt: '2023-11-27T00:28:24.250Z',
      __v: 0,
    };

    const mockUploadResult = [
      {
        success: true,
        data: {
          _id: '655c94215ad11af262220c33',
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
        },
        imageName: '65573aecb5ccb958b78ee5fa',
      },
      {
        success: true,
        data: {
          _id: '655c94215ad11af262220c33',
          imageAlt: 'Attraction 65573aecb5ccb958b78ee533 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
        },
        imageName: '65573aecb5ccb958b78ee5fb',
      },
    ];

    jest.spyOn(fileService, 'uploadPhoto').mockResolvedValueOnce(mockUploadResult);

    const mockedReviewModelCreate = jest
      .spyOn(reviewModel, 'create')
      .mockReturnValueOnce(mockResult as any);

    const result = await service.create(mockFiles, mockParams, current_userId);

    expect(mockedReviewModelCreate).toBeCalledWith({
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
        },
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee533 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
        },
      ],
      userId: '655c94215ad11af262220c33',
      createdAt: new Date('2023-11-27T00:28:24.250Z'),
      updatedAt: new Date('2023-11-27T00:28:24.250Z'),
    });

    expect(result).toEqual({
      title: 'review New 13',
      description: 'This is a review new 1',
      rating: 5,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221be2',
        },
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee533 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221b66',
        },
      ],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: 'Attraction',
      _id: '6563e2a8d74487a4439c2254',
      createdAt: '2023-11-27T00:28:24.250Z',
      updatedAt: '2023-11-27T00:28:24.250Z',
      __v: 0,
    });
  });
});
