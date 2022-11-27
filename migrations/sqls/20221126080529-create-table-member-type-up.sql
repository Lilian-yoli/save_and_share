/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.member_types
(
    id serial PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    member_type VARCHAR (255) NOT NULL,
    shared_times INT NOT NULL,
    shared_limit_times INT NOT NULL,
    expired_datetime TIMESTAMP without time zone,
    created TIMESTAMP without time zone NOT NULL,
    updated TIMESTAMP without time zone NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES members (id)
)