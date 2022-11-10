/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.shared_foods
(
    id serial PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR (255) NOT NULL,
    category VARCHAR (255) NOT NULL,
    county VARCHAR (255) NOT NULL,
    district VARCHAR (255) NOT NULL,
    description VARCHAR (255),
    price INT NOT NULL,
    expiry_date TIMESTAMP without time zone NOT NULL,
    datetime TIMESTAMP without time zone NOT NULL,
    amount INT NOT NULL,
    created TIMESTAMP without time zone NOT NULL,
    updated TIMESTAMP without time zone NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES members (id)
)
