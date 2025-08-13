import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumberString()
    @IsNotEmpty()
    price: number;
}
