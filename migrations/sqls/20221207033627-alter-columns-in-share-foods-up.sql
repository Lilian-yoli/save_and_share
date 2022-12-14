ALTER table shared_foods ADD COLUMN unit_description VARCHAR(255) NOT NULL;
ALTER table shared_foods RENAME COLUMN amount TO total_portions;