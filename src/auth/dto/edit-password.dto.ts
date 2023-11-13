import { IsStrongPassword } from "class-validator";

export class EditPasswordDto {
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    newPassword: string;
}