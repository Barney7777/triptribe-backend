import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from '@/restaurant/restaurant.controller';
import { RestaurantService } from '@/restaurant/restaurant.service';
import { NotFoundException } from '@nestjs/common';
import { FileUploadService } from '@/file/file.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

describe('Restaurant Controller', () => {
  interface RatingDistribution {
    count: number;
    rating: number;
  }
  let restaurantController: RestaurantController;
  let restaurantService: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        RestaurantService,
        FileUploadService,
        ConfigService,
        {
          provide: getModelToken('Restaurant'),
          useValue: {
            find: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('Photo'),
          useValue: {},
        },
        {
          provide: getModelToken('Review'),
          useValue: {},
        },
      ],
    }).compile();

    restaurantController = module.get<RestaurantController>(RestaurantController);
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  describe('get restaurant ratingDistribution', () => {
    it('should return rating distribution array with valid restaurant id', async () => {
      const mockRestaurantId = '655afde260f02f37d6f448b2';
      const mockResult: RatingDistribution[] = [
        {
          count: 5,
          rating: 5,
        },
        {
          count: 6,
          rating: 4,
        },
        {
          count: 6,
          rating: 3,
        },
        {
          count: 6,
          rating: 2,
        },
        {
          count: 7,
          rating: 1,
        },
      ];
      jest.spyOn(restaurantService, 'findRestaurantRating').mockResolvedValueOnce(mockResult);
      const result = await restaurantController.getRestaurantRating({ id: mockRestaurantId });
      expect(result).toEqual(mockResult);
      expect(restaurantService.findRestaurantRating).toHaveBeenCalledWith(mockRestaurantId);
    });

    it('should throw NotFoundException with invalid restaurant id', async () => {
      const mockRestaurantId = '655afde260f02f37d6f448b0';
      jest
        .spyOn(restaurantService, 'findRestaurantRating')
        .mockRejectedValue(new NotFoundException('this restaurant does not exist'));
      await expect(
        restaurantController.getRestaurantRating({ id: mockRestaurantId })
      ).rejects.toThrowError(NotFoundException);
      await expect(
        restaurantController.getRestaurantRating({ id: mockRestaurantId })
      ).rejects.toThrow(new Error('this restaurant does not exist'));
      expect(restaurantService.findRestaurantRating).toHaveBeenCalledWith(mockRestaurantId);
    });
  });
});
