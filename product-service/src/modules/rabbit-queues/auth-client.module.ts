import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
    providers: [
        {
            provide: 'AUTH_SERVICE',
            useFactory: () => {
                return ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: 'auth_queue',
                        queueOptions: { durable: false },
                    },
                });
            },
        },
    ],
    exports: ['AUTH_SERVICE'],
})
export class AuthClientModule {}
