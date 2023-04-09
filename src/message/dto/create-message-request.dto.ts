import { IsNotEmpty, IsNumber, IsString, MaxLength, isNotEmpty } from "class-validator";

export class CreateMessageRequestDto {
    @IsNumber()
    @IsNotEmpty()
    public channelId: number;

    @IsString()
    @MaxLength(255)
    public content: string;

    @IsNumber()
    @IsNotEmpty()
    public authorId: number;
}