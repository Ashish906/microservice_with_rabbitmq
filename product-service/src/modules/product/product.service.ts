import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from 'nestjs-typegoose';
import { Product } from './models/product.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) 
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {}

  async create(createProductDto: CreateProductDto, payload: any) {
    const product = await this.productModel.create({
      ...createProductDto,
      owner_id: payload.sub,
    });

    return {
      message: 'Product created successfully',
      data: product
    };
  }

  async findAll() {
    const products = await this.productModel.find().select(['_id', 'name', 'description', 'price']);
    return {
      message: 'Products retrieved successfully',
      data: products
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findOne({ _id: id }).select(['_id', 'name', 'description', 'price']);

    return {
      message: 'Product retrieved successfully',
      data: product
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, payload: any) {
    const product = await this.productModel.findOneAndUpdate(
      { _id: id, owner_id: payload.sub },
      updateProductDto,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new BadRequestException('Product cannot be updated');
    }

    return {
      message: 'Product updated successfully'
    };
  }

  async remove(id: string, payload: any) {
    const product = await this.productModel.findOneAndDelete({
      _id: id,
      owner_id: payload.sub,
    });

    if (!product) {
      throw new BadRequestException('Product cannot be deleted');
    }

    return {
      message: 'Product deleted successfully'
    }
  }
}
