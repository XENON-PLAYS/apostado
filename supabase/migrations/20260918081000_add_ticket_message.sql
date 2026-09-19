alter table public.bot_settings
add column if not exists ticket_message text not null default 'Olá! Um mediador já irá te atender no seu ticket.';

notify pgrst, 'reload schema';