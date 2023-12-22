import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelEntity } from "./channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([ChannelEntity])],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class ChannelModule { }
