DROP DATABASE ecommerce;

CREATE DATABASE IF NOT EXISTS ecommerce;

use ecommerce;

CREATE TABLE users(
    id BINARY(16) DEFAULT (UUID_TO_BIN(UUID(), 1)),
    name varchar(30) NOT NULL,
    lastname varchar(30) NOT NULL,
    email varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE teams(
  id BINARY(16) DEFAULT (UUID_TO_BIN(UUID(), 1)),
  image_url JSON NOT NULL,
  name varchar(255) NOT NULL,
  owner BINARY(16) NOT NULL,
  members JSON NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  CONSTRAINT `fk_teams_1`
    FOREIGN KEY (`owner`)
    REFERENCES `ecommerce`.`users`(`id`)
);

CREATE TABLE instructors(
    id BINARY(16) DEFAULT (UUID_TO_BIN(UUID(), 1)),
    id_user BINARY(16) NOT NULL,
    specialist json,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_instructor_1`
        FOREIGN KEY (`id_user` )
        REFERENCES `ecommerce`.`users` (`id`)
);

CREATE TABLE orders(
  id BINARY(16) DEFAULT (UUID_TO_BIN(UUID(), 1)),
  id_user BINARY(16) NOT NULL,
  total decimal(5,2) DEFAULT 0.00 NOT NULL,
  paid boolean DEFAULT 0 NOT NULL,
  closed boolean DEFAULT 0 NOT NULL, 
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_orders_1`
        FOREIGN KEY (`id_user` )
        REFERENCES `ecommerce`.`users` (`id`)
);

CREATE TABLE categories(
    id INT AUTO_INCREMENT,
    name varchar(50) unique,
    PRIMARY KEY (`id`)
);

CREATE TABLE products(
    id BINARY(16) DEFAULT (UUID_TO_BIN(UUID(), 1)),
    id_category int NOT NULL,
    image_url JSON NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price decimal(5,2) NOT NULL,
    stock int DEFAULT 0 NOT NULL,
    active boolean NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_products_1`
        FOREIGN KEY (`id_category` )
        REFERENCES `ecommerce`.`categories` (`id`)
);

CREATE TABLE orders_products(
    id_orders BINARY(16) NOT NULL,
    id_products BINARY(16) NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (`id_orders`,`id_products`),
    CONSTRAINT `fk_orders_products_1` 
        FOREIGN KEY(`id_orders`)
        REFERENCES `ecommerce`.`orders` (`id`),
    CONSTRAINT `fk_orders_products_2` 
        FOREIGN KEY(`id_products`)
        REFERENCES `ecommerce`.`products` (`id`)
);

CREATE TABLE instructors_opinions(
    id INT NOT NULL AUTO_INCREMENT,
    id_instrutor BINARY(16) NOT NULL,
    id_user BINARY(16) NOT NULL,
    opinion varchar(150) NOT NULL,
    calification INT NOT NULL,
    PRIMARY KEY(`id`),
    CONSTRAINT `fk_instructors_opinions_1`
        FOREIGN KEY(`id_instrutor`)
        REFERENCES `ecommerce`.`instructors` (`id`),
    CONSTRAINT `fk_instructors_opinions_2`
        FOREIGN KEY(`id_user`)
        REFERENCES `ecommerce`.`users` (`id`)
);

CREATE TABLE places(
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    description varchar(250) NOT NULL,
    ubication varchar(250) NOT NULL,
    latitude float NOT NULL,
    longitude float NOT NULL,
    ambiente ENUM('Boscoso','Urbano','llano','Cerrado','Experimental') NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE events(
    id BINARY(16) DEFAULT (UUID_TO_BIN(UUID(), 1)),
    id_place int NOT NULL,
    description varchar(255) NOT NULL,
    price decimal(5,2) NOT NULL,
    fecha_de_evento date NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE users_events(
    id int NOT NULL AUTO_INCREMENT,
    id_event BINARY(16) NOT NULL,
    id_users BINARY(16) NOT NULL,
    PRIMARY KEY(`id`),
    CONSTRAINT `fk_users_events_1`
        FOREIGN KEY(`id_event`)
        REFERENCES `ecommerce`.`events`(`id`),
    CONSTRAINT `fk_users_events_2`
        FOREIGN KEY(`id_users`)
        REFERENCES `ecommerce`.`users`(`id`)
);

CREATE TABLE events_opinions(
    id int NOT NULL AUTO_INCREMENT,
    id_event BINARY(16) NOT NULL,
    id_user BINARY(16) NOT NULL,
    opinion varchar(255) NOT NULL,
    calification int NOT NULL,
    PRIMARY KEY(`id`),
    CONSTRAINT `fk_events_opinions_1`
        FOREIGN KEY(`id_event`)
        REFERENCES `ecommerce`.`events`(`id`),
    CONSTRAINT `fk_events_opinions_2`
        FOREIGN KEY(`id_user`)
        REFERENCES `ecommerce`.`users` (`id`)
);

/*
    users
    instructors
    orders
    categories
    products
    orders_products
*/

/*
    dates json,
    created_at timestamp NULL,
    updated_at timestamp NULL,
*/

/*PRIMARY KEY(`id_instructor`,`id_user`)*/

/*
id INT NOT NULL AUTO_INCREMENT,
*/