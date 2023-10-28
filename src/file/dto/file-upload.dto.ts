import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class FileUploadDto {
  @IsString()
  @IsNotEmpty()
  public mimetype: string;

  @IsNumber()
  @IsNotEmpty()
  public size: number;

  @IsNotEmpty()
  public buffer: Buffer;
}
