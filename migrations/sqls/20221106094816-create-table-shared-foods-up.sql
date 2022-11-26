/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.shared_foods
(
    id serial PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR (255) NOT NULL,
    category VARCHAR (255) NOT NULL,
    description VARCHAR (255),
    image VARCHAR (1024),
    expiry_date TIMESTAMP without time zone NOT NULL,
    county VARCHAR (255) NOT NULL,
    district VARCHAR (255) NOT NULL,
    address VARCHAR (255) NOT NULL,
    meet_up_datetime TIMESTAMP without time zone NOT NULL,
    amount INT NOT NULL,
    own_portions INT NOT NULL,
    price INT NOT NULL,
    created TIMESTAMP without time zone NOT NULL,
    updated TIMESTAMP without time zone NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES members (id)
)
