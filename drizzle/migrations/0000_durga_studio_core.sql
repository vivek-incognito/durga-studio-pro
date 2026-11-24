
-- ========== ROLES ==========
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create table public.admin_invites (
  email text primary key,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.admin_invites to authenticated;
grant all on public.admin_invites to service_role;
alter table public.admin_invites enable row level security;
create policy "Admins manage invites" on public.admin_invites for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.admin_invites (email) values ('durgastudiorcl@gmail.com');

-- Grant admin only once the invited email is confirmed
create or replace function public.grant_invited_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null
     and exists (select 1 from public.admin_invites i where lower(i.email) = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;

create trigger on_auth_user_confirmed_admin
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.grant_invited_admin();

create or replace function public.apply_admin_invite()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_roles (user_id, role)
  select u.id, 'admin' from auth.users u
  where lower(u.email) = lower(new.email) and u.email_confirmed_at is not null
  on conflict do nothing;
  return new;
end $$;

create trigger on_admin_invite_added
  after insert on public.admin_invites
  for each row execute function public.apply_admin_invite();

-- ========== ENUMS ==========
create type public.order_status as enum ('received','pending_confirmation','confirmed','in_production','ready_for_pickup','completed','cancelled');
create type public.product_category as enum ('passport','frames','banners','events');
create type public.gallery_category as enum ('passport','frames','banners','wedding','birthday','engagement','videography','albums');
create type public.upload_kind as enum ('none','passport','frame','banner','event');

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- ========== BRANCHES ==========
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  city text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  whatsapp_alt text not null default '',
  email text not null default '',
  maps_url text not null default '',
  hours text not null default '',
  is_main boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.branches to anon;
grant select, insert, update, delete on public.branches to authenticated;
grant all on public.branches to service_role;
alter table public.branches enable row level security;
create policy "Public reads active branches" on public.branches for select to anon, authenticated
  using (is_active or public.has_role(auth.uid(), 'admin'));
create policy "Admins insert branches" on public.branches for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update branches" on public.branches for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete branches" on public.branches for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create trigger branches_touch before update on public.branches for each row execute function public.touch_updated_at();

-- ========== PRODUCTS ==========
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.product_category not null,
  short_description text not null default '',
  description text not null default '',
  price numeric(10,2) not null default 0 check (price >= 0),
  price_unit text not null default '',
  price_is_starting boolean not null default false,
  image_url text not null default '',
  upload_kind public.upload_kind not null default 'none',
  upload_required boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "Public reads active products" on public.products for select to anon, authenticated
  using (is_active or public.has_role(auth.uid(), 'admin'));
create policy "Admins insert products" on public.products for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update products" on public.products for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete products" on public.products for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

-- ========== GALLERY ==========
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  category public.gallery_category not null,
  title text not null default '',
  description text not null default '',
  image_url text not null,
  storage_path text,
  is_sample boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_images to anon;
grant select, insert, update, delete on public.gallery_images to authenticated;
grant all on public.gallery_images to service_role;
alter table public.gallery_images enable row level security;
create policy "Public reads gallery" on public.gallery_images for select to anon, authenticated using (true);
create policy "Admins insert gallery" on public.gallery_images for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update gallery" on public.gallery_images for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete gallery" on public.gallery_images for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ========== CUSTOMERS & ORDERS ==========
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  mobile text not null unique,
  name text not null,
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  mobile text not null,
  email text not null default '',
  branch_id uuid references public.branches(id) on delete set null,
  branch_name text not null default '',
  status public.order_status not null default 'received',
  total_amount numeric(12,2) not null default 0,
  customer_notes text not null default '',
  preferred_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_created_idx on public.orders (created_at desc);
create index orders_mobile_idx on public.orders (mobile);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  category public.product_category not null,
  unit_price numeric(10,2) not null,
  price_unit text not null default '',
  price_is_starting boolean not null default false,
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null,
  item_notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  label text not null default '',
  created_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text not null default '',
  changed_by uuid,
  created_at timestamptz not null default now()
);

create table public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  note text not null,
  author_id uuid,
  author_email text not null default '',
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['customers','orders','order_items','order_files','order_status_history','order_notes'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Admins full access" on public.%I for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))', t);
  end loop;
end $$;

create trigger customers_touch before update on public.customers for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ========== HELPERS ==========
create or replace function public.normalize_mobile(p text)
returns text language plpgsql immutable set search_path = public as $$
declare d text := regexp_replace(coalesce(p,''), '\D', '', 'g');
begin
  if length(d) = 12 and left(d,2) = '91' then d := right(d,10); end if;
  if length(d) = 11 and left(d,1) = '0' then d := right(d,10); end if;
  return d;
end $$;

-- ========== CREATE ORDER (public) ==========
create or replace function public.create_order(p_customer jsonb, p_branch_id uuid, p_items jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_name text := btrim(coalesce(p_customer->>'name',''));
  v_mobile text := public.normalize_mobile(p_customer->>'mobile');
  v_email text := lower(btrim(coalesce(p_customer->>'email','')));
  v_notes text := left(btrim(coalesce(p_customer->>'notes','')), 1000);
  v_date date;
  v_branch public.branches;
  v_customer_id uuid;
  v_order_id uuid;
  v_code text;
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_file jsonb;
  v_product public.products;
  v_qty int;
  v_item_id uuid;
  v_file_count int;
  v_path text;
  i int;
begin
  if length(v_name) < 2 or length(v_name) > 100 then raise exception 'Please enter your full name.'; end if;
  if v_mobile !~ '^[6-9][0-9]{9}$' then raise exception 'Please enter a valid 10-digit mobile number.'; end if;
  if v_email <> '' and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Please enter a valid email address.'; end if;
  begin
    v_date := nullif(p_customer->>'preferred_date','')::date;
  exception when others then v_date := null; end;

  select * into v_branch from public.branches where id = p_branch_id and is_active;
  if not found then raise exception 'Please select a branch.'; end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Your cart is empty.'; end if;
  if jsonb_array_length(p_items) > 30 then raise exception 'Too many items in one order.'; end if;

  insert into public.customers (mobile, name, email) values (v_mobile, v_name, v_email)
  on conflict (mobile) do update set name = excluded.name, email = case when excluded.email <> '' then excluded.email else public.customers.email end
  returning id into v_customer_id;

  loop
    v_code := 'DS' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-';
    for i in 1..5 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.orders where order_code = v_code);
  end loop;

  insert into public.orders (order_code, customer_id, customer_name, mobile, email, branch_id, branch_name, customer_notes, preferred_date)
  values (v_code, v_customer_id, v_name, v_mobile, v_email, v_branch.id, v_branch.name, v_notes, v_date)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid and is_active;
    if not found then raise exception 'A product in your cart is no longer available.'; end if;
    v_qty := coalesce((v_item->>'quantity')::int, 0);
    if v_qty < 1 or v_qty > 500 then raise exception 'Invalid quantity for %.', v_product.name; end if;

    insert into public.order_items (order_id, product_id, product_name, category, unit_price, price_unit, price_is_starting, quantity, line_total, item_notes)
    values (v_order_id, v_product.id, v_product.name, v_product.category, v_product.price, v_product.price_unit, v_product.price_is_starting, v_qty, v_product.price * v_qty, left(btrim(coalesce(v_item->>'notes','')), 500))
    returning id into v_item_id;
    v_total := v_total + v_product.price * v_qty;

    v_file_count := 0;
    if jsonb_typeof(v_item->'files') = 'array' then
      for v_file in select * from jsonb_array_elements(v_item->'files') loop
        v_path := coalesce(v_file->>'path','');
        if v_path !~ '^pending/[0-9a-f-]{36}/[A-Za-z0-9._-]{1,120}$' then raise exception 'Invalid uploaded file.'; end if;
        if not exists (select 1 from storage.objects o where o.bucket_id = 'order-uploads' and o.name = v_path) then
          raise exception 'An uploaded file could not be found. Please upload it again.';
        end if;
        if exists (select 1 from public.order_files f where f.storage_path = v_path) then
          raise exception 'An uploaded file is already attached to another order. Please upload it again.';
        end if;
        insert into public.order_files (order_id, order_item_id, storage_path, file_name, mime_type, size_bytes, label)
        values (v_order_id, v_item_id, v_path, left(coalesce(v_file->>'name','file'),200), left(coalesce(v_file->>'mime',''),100), coalesce((v_file->>'size')::bigint,0), left(coalesce(v_file->>'label',''),60));
        v_file_count := v_file_count + 1;
      end loop;
    end if;
    if v_file_count > 10 then raise exception 'Too many files for %.', v_product.name; end if;
    if v_product.upload_required and v_file_count = 0 then
      raise exception 'Please upload the required photo for %.', v_product.name;
    end if;
  end loop;

  update public.orders set total_amount = v_total where id = v_order_id;
  insert into public.order_status_history (order_id, status, note) values (v_order_id, 'received', 'Your order has been received by Durga Studio.');

  return jsonb_build_object('order_code', v_code, 'total_amount', v_total, 'branch_name', v_branch.name, 'created_at', now());
end $$;

revoke all on function public.create_order(jsonb, uuid, jsonb) from public;
grant execute on function public.create_order(jsonb, uuid, jsonb) to anon, authenticated;

-- ========== TRACK ORDER (public, requires code + mobile) ==========
create or replace function public.track_order(p_order_code text, p_mobile text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_order public.orders;
  v_mobile text := public.normalize_mobile(p_mobile);
begin
  if coalesce(btrim(p_order_code),'') = '' or v_mobile !~ '^[0-9]{10}$' then return null; end if;
  select * into v_order from public.orders
   where order_code = upper(btrim(p_order_code)) and mobile = v_mobile;
  if not found then return null; end if;

  return jsonb_build_object(
    'order_code', v_order.order_code,
    'customer_name', v_order.customer_name,
    'created_at', v_order.created_at,
    'branch_name', v_order.branch_name,
    'total_amount', v_order.total_amount,
    'status', v_order.status,
    'items', coalesce((select jsonb_agg(jsonb_build_object('name', product_name, 'quantity', quantity, 'unit_price', unit_price, 'price_unit', price_unit, 'price_is_starting', price_is_starting, 'line_total', line_total) order by created_at) from public.order_items where order_id = v_order.id), '[]'::jsonb),
    'history', coalesce((select jsonb_agg(jsonb_build_object('status', status, 'note', note, 'created_at', created_at) order by created_at) from public.order_status_history where order_id = v_order.id), '[]'::jsonb)
  );
end $$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- ========== ADMIN: UPDATE STATUS ==========
create or replace function public.update_order_status(p_order_id uuid, p_status public.order_status, p_note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Not authorized'; end if;
  update public.orders set status = p_status where id = p_order_id;
  if not found then raise exception 'Order not found'; end if;
  insert into public.order_status_history (order_id, status, note, changed_by)
  values (p_order_id, p_status, left(btrim(coalesce(p_note,'')), 500), auth.uid());
end $$;

revoke all on function public.update_order_status(uuid, public.order_status, text) from public;
grant execute on function public.update_order_status(uuid, public.order_status, text) to authenticated;

-- ========== STORAGE POLICIES ==========
create policy "Admins read order uploads" on storage.objects for select to authenticated
  using (bucket_id = 'order-uploads' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete order uploads" on storage.objects for delete to authenticated
  using (bucket_id = 'order-uploads' and public.has_role(auth.uid(), 'admin'));
create policy "Admins upload gallery" on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update gallery files" on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete gallery files" on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));
