CREATE TABLE IF NOT EXISTS members
(
    id serial NOT NULL ,
    email character varying(50) NOT NULL,
    password character varying(1024) NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    username character varying(50) NOT NULL,
    provider character varying(50) NOT NULL,
    token_expired character varying(50) NOT NULL,
    access_token character varying(1024) NOT NULL,
    CONSTRAINT members_pkey PRIMARY KEY (id),
    CONSTRAINT members_email_key UNIQUE (email)
)
