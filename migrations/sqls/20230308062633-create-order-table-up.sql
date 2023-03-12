CREATE TABLE IF NOT EXISTS orders
(
    id serial PRIMARY KEY NOT NULL,
    member_id INT NOT NULL,
    prime VARCHAR(1024) NOT NULL,
    status VARCHAR(64) NOT NULL,
    amount INT NOT NULL,
    paid VARCHAR(64) NOT NULL,
    plan_type VARCHAR(64) NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    FOREIGN KEY (member_id)
      REFERENCES members (id)
)
