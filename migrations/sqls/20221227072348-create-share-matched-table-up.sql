CREATE TABLE IF NOT EXISTS public.matched_share
(
    id serial PRIMARY KEY,
    share_id INT NOT NULL,
    participant_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created TIMESTAMP without time zone NOT NULL,
    updated TIMESTAMP without time zone NOT NULL,
    FOREIGN KEY (share_id)
      REFERENCES shared_foods (id),
    FOREIGN KEY (participant_id)
      REFERENCES members (id)
);
