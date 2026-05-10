-- Таблица для расчетов
CREATE TABLE IF NOT EXISTS calculations (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_type TEXT,
    steel_grade TEXT,
    selected_target TEXT,
    selected_raw TEXT,
    order_weight TEXT,
    ordered_length TEXT,
    length_input_value TEXT,
    length_input_source TEXT,
    front_coef TEXT,
    back_coef TEXT,
    useful_length TEXT,
    sell_price TEXT,
    raw_price_used TEXT,
    scrap_price_used TEXT,
    remnant_price_used TEXT,
    label TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по пользователю
CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id);

-- Таблица для настроек пользователей
CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для системных настроек (цены и т.д.)
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
