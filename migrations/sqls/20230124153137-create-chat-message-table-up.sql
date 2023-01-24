CREATE TABLE IF NOT EXISTS chat_info
(
    id serial PRIMARY KEY NOT NULL ,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message VARCHAR(1024) NOT NULL,
    send_at timestamp without time zone NOT NULL,
    room VARCHAR(50) NOT NULL,
    unread INT,
    updated timestamp without time zone NOT NULL,
    status VARCHAR(1024) NOT NULL,
    FOREIGN KEY (sender_id)
      REFERENCES members (id),
    FOREIGN KEY (receiver_id)
      REFERENCES members (id)
)
