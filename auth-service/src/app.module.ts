import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRoot(process.env.MONGO_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
