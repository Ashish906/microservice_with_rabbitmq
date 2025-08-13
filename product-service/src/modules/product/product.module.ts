import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Product } from './models/product.model';
import { AuthClientModule } from '../rabbit-queues/auth-client.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Product]),
    AuthClientModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
