import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth-guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any
  ) {
    return this.productService.create(createProductDto, req.user);
  }
  
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: any
  ) {
    return this.productService.update(id, updateProductDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: any
  ) {
    return this.productService.remove(id, req.user);
  }
}
