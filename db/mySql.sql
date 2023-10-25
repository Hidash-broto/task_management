CREATE DATABASE IF NOT EXISTS interval_mechine_task;

USE interval_mechine_task;

CREATE TABLE IF NOT EXISTS tasks (
    heading varchar(20) not null unique;
    describtion varchar(100) not null;
    dateAndTime varchar(50) not null;
    image varchar(50) not null;
    priority varchar(10) not null;
);