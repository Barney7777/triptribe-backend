import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FileUploadService } from '@/file/file.service';
import { ConfigService } from '@nestjs/config';
import { PhotoType } from '@/schema/photo.schema';
import { ReviewService } from '@/review/review.service';
import { InternalServerErrorException } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME_DATABASE_SYNC } from '@/common/constant/queue.constant';

describe('ReviewService.uploadPhoto', () => {
  let service: ReviewService;
  let fileService: FileUploadService;
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
          useValue: {},
        },
        {
          provide: getModelToken('Photo'),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
    fileService = module.get<FileUploadService>(FileUploadService);
  }, 10000);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when call uploadPhoto and files array is empty', async () => {
    const files = [];
    const userId: string = '655c94215ad11af262220c33';

    const result = await service.uploadPhoto(userId, files);

    expect(result).toEqual([]);
  });

  it('should return newPicArray array when call uploadPhoto', async () => {
    const files = [
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
    const userId: string = '655c94215ad11af262220c33';

    const mockResult = [
      {
        success: true,
        data: {
          _id: '655c94215ad11af262220c2s',
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c2f',
        },
        imageName: '65573aecb5ccb958b78ee5fa',
      },
      {
        success: true,
        data: {
          _id: '655c94215ad11af262220c2w',
          imageAlt: 'Attraction 65573aecb5ccb958b78ee5fb review photo 0',
          imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
          imageType: PhotoType.REVIEW,
          uploadUserId: '655c94215ad11af262220c2f',
        },
        imageName: '65573aecb5ccb958b78ee5fb',
      },
    ];

    const mockedFileServiceUploadPhoto = jest
      .spyOn(fileService, 'uploadPhoto')
      .mockResolvedValueOnce(mockResult);

    const result = await service.uploadPhoto(userId, files);

    expect(mockedFileServiceUploadPhoto).toBeCalledWith(
      '655c94215ad11af262220c33',
      [
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
      ],
      PhotoType.REVIEW
    );

    expect(result).toEqual([
      {
        imageAlt: 'Attraction 65573aecb5ccb958b78ee5fa review photo 0',
        imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
        imageType: PhotoType.REVIEW,
        uploadUserId: '655c94215ad11af262220c2f',
      },
      {
        imageAlt: 'Attraction 65573aecb5ccb958b78ee5fb review photo 0',
        imageUrl: 'https://loremflickr.com/640/480/attraction?lock=7208175602237440',
        imageType: PhotoType.REVIEW,
        uploadUserId: '655c94215ad11af262220c2f',
      },
    ]);
  });

  it('should return Exception when call uploadPhoto and it return an exception', async () => {
    const files = [
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
    const userId: string = '655c94215ad11af262220c33';

    const mockedFileServiceUploadPhoto = jest
      .spyOn(fileService, 'uploadPhoto')
      .mockRejectedValue(new InternalServerErrorException('Error uploading image'));

    await expect(async () => {
      await service.uploadPhoto(userId, files);
    })
      .rejects.toThrowError(InternalServerErrorException)
      .catch(() => {});

    expect(mockedFileServiceUploadPhoto).toBeCalledWith(
      '655c94215ad11af262220c33',
      [
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
      ],
      PhotoType.REVIEW
    );
  });
});
