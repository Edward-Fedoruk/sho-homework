CREATE TYPE status_enum AS ENUM ('OPEN', 'ORDERED');


CREATE TABLE IF NOT EXISTS carts (
	id UUID NOT NULL PRIMARY KEY,
	user_id UUID NOT NULL,
	created_at DATE NOT NULL,
	updated_at DATE NOT NULL,
	status status_enum
);

create table if not exists cart_items (
	id UUID not null primary key,
	product_id UUID not null,
	cart_id UUID not null,
	item_count integer,
	CONSTRAINT fk_carts
      FOREIGN KEY(cart_id) 
	      REFERENCES carts(id)
);
