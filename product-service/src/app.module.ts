import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { TypegooseModule } from 'nestjs-typegoose';
// import mongoose from 'mongoose';

// async function connectWithRetry(uri: string, retries = 5, delay = 1000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       await mongoose.connect(uri);
//       console.log('MongoDB connected!');
//       return;
//     } catch (err) {
//       console.error(`MongoDB connection failed. Retry ${i + 1}/${retries}`, err);
//       await new Promise(res => setTimeout(res, delay));
//     }
//   }
//   throw new Error('MongoDB connection failed after multiple retries');
// }

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRoot(process.env.MONGO_URL),
    // TypegooseModule.forRootAsync({
    //   useFactory: async () => {
    //     const uri = 'mongodb://mongo-db:27017/ecommerce';

    //     await connectWithRetry(uri); // retry logic here
    //     return {
    //       uri,
    //     };
    //   },
    // }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
