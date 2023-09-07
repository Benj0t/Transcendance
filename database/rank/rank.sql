
-- Represent a rank.

create table "rank" (
    "id" serial primary key,
    "rank_name" varchar(50)
);

create or replace view "v_rank" as select * from "rank";

insert into
		"rank" (rank_name)
values 
		('Beginner'),
		('Amateur'),
		('Skilled'),
		('Pro'),
		('Expert'),
		('Master'),
		('Legend'),
		('Elite'),
		('Champion'),
		('Legendary');