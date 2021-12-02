create table airline
(
    airline_id       integer not null
        constraint airline_pk
            primary key,
    name             varchar not null,
    main_hub         varchar not null,
    headquarter_city varchar not null,
    country          varchar not null
);

alter table airline
    owner to postgres;

create table aircraft_model
(
    model_id      integer not null
        constraint aircraft_model_pk
            primary key,
    name          varchar not null,
    num_of_engine integer
        constraint aircraft_model_num_of_engine_check
            check (num_of_engine > 0),
    num_of_fleet  integer
        constraint aircraft_model_num_of_fleet_check
            check ((0 <= num_of_fleet) AND (num_of_fleet <= 100)),
    airline_id    integer not null
        constraint aircraft_model_airline_airline_id_fk
            references airline
);

alter table aircraft_model
    owner to postgres;

create table airport
(
    city    varchar not null,
    code    char(3) not null
        constraint airport_pk
            primary key,
    country varchar not null,
    name    varchar not null,
    type    char
        constraint airport_type_check
            check (type = ANY (ARRAY ['I'::bpchar, 'D'::bpchar, 'B'::bpchar]))
);

alter table airport
    owner to postgres;

create table flight
(
    flight_id         varchar             not null
        constraint flight_pk
            primary key,
    departure_airport char(3)             not null,
    arrival_airport   char(3)             not null,
    departure_time    time with time zone not null,
    arrival_time      time with time zone not null,
    airline_id        integer             not null
        constraint flight_airline_airline_id_fk
            references airline,
    constraint flight_airport_not_equal_chk
        check (departure_airport <> arrival_airport)
);

alter table flight
    owner to postgres;

create table airport_flight
(
    airport_code char(3) not null
        constraint airport_flight_airport_fk
            references airport
            on update cascade on delete cascade,
    flight_id    varchar not null
        constraint airport_flight_flight_fk
            references flight
);

alter table airport_flight
    owner to postgres;

create table insurance_plan
(
    plan_id            integer not null
        constraint insurance_plan_pk
            primary key,
    name               varchar not null,
    description        varchar not null,
    cost_per_passenger numeric(6, 2)
        constraint insurance_plan_cost_per_passenger_check
            check (cost_per_passenger > (0)::numeric)
);

alter table insurance_plan
    owner to postgres;

create table member
(
    member_id             integer not null
        constraint member_pk
            primary key,
    membership_name       varchar not null,
    membership_start_date date    not null,
    membership_end_date   date,
    airline_id            integer
        constraint member_airline_fk
            references airline
);

alter table member
    owner to postgres;

create table customer
(
    customer_id               integer not null
        constraint customer_pk
            primary key,
    street                    varchar not null,
    city                      varchar not null,
    country                   varchar not null,
    zipcode                   varchar not null,
    phone                     integer not null,
    phone_country_code        integer not null,
    emer_contact_fname        varchar not null,
    emer_contact_lname        varchar not null,
    emer_contact_phone        integer not null,
    emer_contact_country_code integer not null,
    insurance_plan_id         integer not null
        constraint customer_insurance_plan_fk
            references insurance_plan
            on update cascade on delete cascade,
    type                      char    not null
        constraint ch_inh_customer
            check (type = ANY (ARRAY ['A'::bpchar, 'C'::bpchar, 'M'::bpchar])),
    invoice_number            integer,
    member_id                 integer
        constraint customer_member_id_fk
            references member
);

alter table customer
    owner to postgres;

create unique index customer__idx
    on customer (invoice_number);

create table agent
(
    customer_id integer not null
        constraint agent_pk
            primary key
        constraint agent_customer_fk
            references customer
            on update cascade on delete cascade,
    agent_name  varchar not null,
    web_address varchar not null,
    phone       integer not null
);

alter table agent
    owner to postgres;

create table invoice
(
    invoice_number integer not null
        constraint invoice_pk
            primary key,
    invoice_date   date    not null,
    amount         numeric(8, 2)
        constraint invoice_amount_check
            check (amount > (0)::numeric),
    customer_id    integer not null
        constraint invoice_customer_fk
            references customer
            on update cascade on delete cascade
);

alter table invoice
    owner to postgres;

alter table customer
    add constraint customer_invoice_fk
        foreign key (invoice_number) references invoice
            on update cascade on delete cascade;

create unique index invoice__idx
    on invoice (customer_id);

create table passenger
(
    passenger_id         integer not null,
    first_name           varchar not null,
    middle_name          varchar,
    last_name            varchar not null,
    date_of_birth        date    not null,
    gender               char    not null,
    passport_num         integer not null,
    passport_expire_date date    not null,
    customer_id          integer not null
        constraint passenger_customer_fk
            references customer
            on update cascade on delete cascade,
    nationality          varchar not null,
    constraint passenger_pk
        primary key (passenger_id, customer_id)
);

alter table passenger
    owner to postgres;

create table payment
(
    payment_id             integer not null,
    payment_date           date    not null,
    amount                 numeric(8, 2)
        constraint payment_amount_check
            check (amount > (0)::numeric),
    method                 char
        constraint payment_method_check
            check (method = ANY (ARRAY ['D'::bpchar, 'C'::bpchar])),
    card_number            varchar not null,
    card_holder_fname      varchar not null,
    card_holder_lname      varchar not null,
    expire_date            date    not null,
    invoice_invoice_number integer not null
        constraint payment_invoice_fk
            references invoice
            on update cascade on delete cascade,
    constraint payment_pk
        primary key (payment_id, invoice_invoice_number)
);

alter table payment
    owner to postgres;

create table itinerary
(
    passenger_id    integer not null,
    flight_id       varchar not null
        constraint itinerary_flight_flight_id_fk
            references flight,
    customer_id     integer not null,
    cabin_class     varchar not null,
    meal_plan       char(4) not null,
    special_request char,
    constraint itinerary_pk
        primary key (passenger_id, flight_id, customer_id),
    constraint itinerary_passenger_fk
        foreign key (passenger_id, customer_id) references passenger
);

alter table itinerary
    owner to postgres;

create table customer_insurance
(
    customer_id integer not null
        constraint customer_insurance_fk
            references customer,
    plan_id     integer not null
        constraint customer_insurance_fk2
            references insurance_plan,
    constraint customer_insurance_pk
        primary key (customer_id, plan_id)
);

alter table customer_insurance
    owner to postgres;

