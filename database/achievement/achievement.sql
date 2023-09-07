
-- Represent an achievement.

create table "achievement" (
    "id" serial primary key,
    "name" varchar(50),
	"caption" text,
    "icon_url" varchar(255)
);

create or replace view "v_achievement" as select * from "achievement";

insert into
		"achievement" ("name", "caption", "icon_url")
values 
		('First Strike', 'Win the first point in a match.', 'first_strike_icon.png'),
		('High Five', 'Score 5 points in a row without losing a point.', 'high_five_icon.png'),
		('Unstoppable', 'Win 10 matches in a row.', 'unstoppable_icon.png'),
		('Sharpshooter', 'Score with 5 difficult corner shots.', 'sharpshooter_icon.png'),
		('The Comeback Kid', 'Win a match after being 3 points behind.', 'comeback_kid_icon.png');