-- Создаем базы данных, если они нужны. 
-- По умолчанию создается база, имя которой совпадает с пользователем (aleksandr).
-- Добавляем две наши базы данных:
CREATE DATABASE zmk_production;
CREATE DATABASE zmk_supply;

\c zmk_production;

CREATE TABLE IF NOT EXISTS calculations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50),
    steel_grade VARCHAR(50),
    selected_target VARCHAR(255),
    selected_raw VARCHAR(255),
    order_weight VARCHAR(50),
    ordered_length VARCHAR(50),
    length_input_value VARCHAR(50),
    length_input_source VARCHAR(50),
    front_coef VARCHAR(50),
    back_coef VARCHAR(50),
    useful_length VARCHAR(50),
    sell_price VARCHAR(50),
    raw_price_used VARCHAR(50),
    scrap_price_used VARCHAR(50),
    remnant_price_used VARCHAR(50),
    label VARCHAR(255),
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id VARCHAR(255) PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\c zmk_supply;

CREATE TABLE IF NOT EXISTS calculations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50),
    steel_grade VARCHAR(50),
    selected_target VARCHAR(255),
    selected_raw VARCHAR(255),
    order_weight VARCHAR(50),
    ordered_length VARCHAR(50),
    length_input_value VARCHAR(50),
    length_input_source VARCHAR(50),
    front_coef VARCHAR(50),
    back_coef VARCHAR(50),
    useful_length VARCHAR(50),
    sell_price VARCHAR(50),
    raw_price_used VARCHAR(50),
    scrap_price_used VARCHAR(50),
    remnant_price_used VARCHAR(50),
    label VARCHAR(255),
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id VARCHAR(255) PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
