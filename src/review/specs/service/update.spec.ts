import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FileUploadService } from '@/file/file.service';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Photo, PhotoType } from '@/schema/photo.schema';
import { ReviewService } from '../../review.service';
import { Review } from '../../schema/review.schema';
import { IReview } from '../../types/interfaces/review.do';
import { PlaceType } from '../../dto/reviewDto/base-review.dto';
import { ForbiddenException } from '@nestjs/common';

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

describe('ReviewService.update', () => {
  let service: ReviewService;
  let reviewModel: Model<Review>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        FileUploadService,
        ConfigService,
        {
          provide: getModelToken('Review'),
          useValue: {
            exec: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken('Photo'),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
    reviewModel = module.get<Model<Review>>(getModelToken('Review'));
  }, 10000);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Unauthorized when call update and verify currentUser with reviewCreator not pass', async () => {
    const reviewId: string = '6563d53576d44b652b8961d8';
    const current_userId: string = '655c94215ad11af262220c66';

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

    const mockedReviewServiceFindOneFromMe = jest.spyOn(service, 'findOneFromMe');

    mockedReviewServiceFindOneFromMe.mockImplementation(() => {
      throw new ForbiddenException('You have no permission to access this resource!');
    });

    expect(() => {
      service.findOneFromMe('6563d53576d44b652b8961d8', '655c94215ad11af262220c66');
    }).toThrowError('You have no permission to access this resource!');

    expect(mockedReviewServiceFindOneFromMe).toBeCalledWith(
      '6563d53576d44b652b8961d8',
      '655c94215ad11af262220c66'
    );

    await expect(service.update(reviewId, [], mockParams, current_userId)).rejects.toThrowError(
      ForbiddenException
    );
  });

  it('should return updated data when call update and verify currentUser with reviewCreator pass', async () => {
    const reviewId: string = '6563d53576d44b652b8961d8';
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
      _id: '6563d53576d44b652b8961d8',
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

    const mockFindOneFromMeResult: IReviews = {
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
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221be2',
        },
      ],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: PlaceType.ATTRACTION,
      createdAt: '2023-11-21T11:27:33.698Z',
      updatedAt: '2023-11-21T11:27:33.698Z',
      __v: 0,
    };

    const mockResult: IReviews = {
      _id: '6563d53576d44b652b8961d8',
      title: 'depereo subito viduo',
      description:
        'Torrens chirographum vitiosus aspernatur tribuo tandem. Suppono ad tabesco termes. Tui spero cotidie.',
      rating: 4,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee511 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221b11',
        },
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee522 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221b22',
        },
      ],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: PlaceType.ATTRACTION,
      createdAt: '2023-11-21T11:27:33.698Z',
      updatedAt: '2023-11-21T11:27:33.698Z',
      __v: 0,
    };

    const mockUploadResult = [
      {
        imageAlt: 'Attraction 65573aecb5ccb958b78ee511 review photo 0',
        imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
        imageType: PhotoType.REVIEW,
        uploadUserId: '655c94215ad11af262220c33',
      },
      {
        imageAlt: 'Attraction 65573aecb5ccb958b78ee522 review photo 0',
        imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
        imageType: PhotoType.REVIEW,
        uploadUserId: '655c94215ad11af262220c33',
      },
    ];

    const mockedReviewServiceUploadPhoto = jest
      .spyOn(service, 'uploadPhoto')
      .mockResolvedValueOnce(mockUploadResult);

    const mockedReviewServiceFindOneFromMe = jest
      .spyOn(service, 'findOneFromMe')
      .mockResolvedValueOnce(mockFindOneFromMeResult as any);

    const mockedReviewServiceFindByIdAndUpdate = jest
      .spyOn(reviewModel, 'findByIdAndUpdate')
      .mockReturnValueOnce({ exec: () => mockResult } as any);

    const result = await service.update(reviewId, mockFiles, mockParams, current_userId);

    expect(mockedReviewServiceFindOneFromMe).toBeCalledWith(
      '6563d53576d44b652b8961d8',
      '655c94215ad11af262220c33'
    );

    expect(mockedReviewServiceUploadPhoto).toBeCalledWith('655c94215ad11af262220c33', [
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
    ]);

    expect(mockedReviewServiceFindByIdAndUpdate).toBeCalledWith(
      '6563d53576d44b652b8961d8',
      {
        _id: '6563d53576d44b652b8961d8',
        title: 'review New 13',
        description: 'This is a review new 1',
        rating: 5,
        placeId: '6531d56a016ba782a35a8fd6',
        placeType: 'Attraction',
        photos: [
          {
            imageAlt: 'Attraction 65573aecb5ccb958b78ee511 review photo 0',
            imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
            imageType: PhotoType.REVIEW,
            uploadUserId: '655c94215ad11af262220c33',
          },
          {
            imageAlt: 'Attraction 65573aecb5ccb958b78ee522 review photo 0',
            imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
            imageType: PhotoType.REVIEW,
            uploadUserId: '655c94215ad11af262220c33',
          },
        ],
        userId: '655c94215ad11af262220c33',
        createdAt: new Date('2023-11-27T00:28:24.250Z'),
        updatedAt: new Date('2023-11-27T00:28:24.250Z'),
      },
      { new: true }
    );

    expect(result).toEqual({
      _id: '6563d53576d44b652b8961d8',
      title: 'depereo subito viduo',
      description:
        'Torrens chirographum vitiosus aspernatur tribuo tandem. Suppono ad tabesco termes. Tui spero cotidie.',
      rating: 4,
      photos: [
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee511 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221b11',
        },
        {
          imageAlt: 'Attraction 65573aecb5ccb958b78ee522 review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c33',
          _id: '655c94255ad11af262221b22',
        },
      ],
      userId: '655c94215ad11af262220c33',
      placeId: '6531d56a016ba782a35a8fd6',
      placeType: PlaceType.ATTRACTION,
      createdAt: '2023-11-21T11:27:33.698Z',
      updatedAt: '2023-11-21T11:27:33.698Z',
      __v: 0,
    });
  });
});
