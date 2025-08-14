import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Global()
@Module({
    providers: [
        {
            provide: 'USER_SERVICE',
            useFactory: () => {
                return ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: 'user_queue',
                        queueOptions: { durable: false },
                    },
                });
            },
        },
    ],
    exports: ['USER_SERVICE'],
})
export class UserClientModule {}
