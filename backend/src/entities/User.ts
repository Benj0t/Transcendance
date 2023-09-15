import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * Represents a user in the database.
 * @author Komqdo
 */

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	nickname: string;
	
	@Column()
	avatar_url: string;
	
	@Column()
	two_factor_auth: boolean;

	@Column()
	user_42_id: number;
}