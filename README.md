# Лабораторна робота №1 — Розгортання Web-сервісу з автоматизацією

## Варіант індивідуального завдання

**N = 13** (номер у списку групи)

| Формула | Обчислення | Результат | Значення |
|---------|-----------|-----------|----------|
| V2 = (N % 2) + 1 | (13 % 2) + 1 | **2** | Конфігураційний файл `/etc/mywebapp/config.yaml`; база даних **PostgreSQL** |
| V3 = (N % 3) + 1 | (13 % 3) + 1 | **2** | **Task Tracker** — сервіс для відстеження задач |
| V5 = (N % 5) + 1 | (13 % 5) + 1 | **4** | Порт застосунку **8000** |

## Архітектура системи

```
client → nginx (reverse proxy, 0.0.0.0:80) → mywebapp (127.0.0.1:8000) → PostgreSQL (127.0.0.1:5432)
```


## Веб-застосунок

### Призначення

**Task Tracker** — REST API сервіс для відстеження задач. Дозволяє створювати задачі, переглядати список усіх задач та позначати їх як виконані.


### Налаштування середовища для розробки

1. Встановити Node.js 20+ та PostgreSQL 14+.
2. Встановити залежності:
   ```bash
   npm install
   ```
3. Створити базу даних та користувача PostgreSQL:
   ```sql
   CREATE ROLE mywebapp LOGIN PASSWORD 'changeme';
   CREATE DATABASE mywebapp OWNER mywebapp;
   ```
4. У корені проєкту розмістити `config.dev.yaml`, за потреби змінити параметри:
   ```yaml
   host: "127.0.0.1"
   port: 8000
   database:
     host: "127.0.0.1"
     port: 5432
     user: "mywebapp"
     password: "changeme"
     database: "mywebapp"
   ```
5. Виконати міграції:
   ```bash
   npm run migrate
   ```
6. Запустити у dev моді:
   ```bash
   npm run dev
   ```

### Запуск застосунку (production)

1. Розмістити конфігураційний файл у `/etc/mywebapp/config.yaml` (аналогічний `config.dev.yaml`)

2. Запустити застосунок
```bash
npm run setup   # install + build + migrate
npm start
```

### Документація API

Бізнес-ендпоінти підтримують заголовок `Accept`:
- `application/json` — відповідь у форматі JSON
- `text/html` — проста HTML-сторінка (таблиця, без JS/CSS)

Кореневий ендпоінт (`GET /`) віддає тільки `text/html`.

#### Ендпоінти бізнес-логіки (Task Tracker)

| Метод | Шлях | Опис | Тіло запиту |
|-------|------|------|-------------|
| GET | `/tasks` | Список усіх задач (`id`, `title`, `status`, `created_at`) | — |
| POST | `/tasks` | Створити нову задачу (статус `pending`) | `{ "title": "..." }` |
| POST | `/tasks/:id/done` | Позначити задачу як виконану (`done`) | — |

#### Ендпоінти перевірки стану (Health)

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/health/alive` | Завжди повертає `200 OK` |
| GET | `/health/ready` | `200 OK` якщо БД доступна, інакше `500` з описом проблеми |

#### Кореневий ендпоінт

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/` | HTML-сторінка зі списком усіх бізнес-ендпоінтів |

---

## Розгортання

### Базовий образ віртуальної машини

- **Дистрибутив:** Ubuntu 24.04 LTS
- **Vagrant Box:** `hashicorp-education/ubuntu-24-04` (версія `0.1.0`)

### Вимоги до ресурсів ВМ

| Ресурс | Мінімум |
|--------|---------|
| CPU | 2 ядра |
| RAM | 2048 MB |
| Disk | 10 GB |
| Мережа | NAT з прокиданням порту 80 |

Спеціальних налаштувань при встановленні ОС (розбивка диску тощо) не потрібно.

### Як увійти на ВМ

Після розгортання доступні користувачі:

| Користувач | Пароль | Права | Примітка |
|------------|--------|-------|----------|
| student | `student` | sudo (повні) | Робочий користувач |
| teacher | `12345678` | sudo (повні) | Пароль потрібно змінити при першому вході |
| operator | `12345678` | обмежений sudo (див. нижче) | Пароль потрібно змінити при першому вході |
| app | `app` | мінімальні | Запускає застосунок |

Користувач `vagrant` заблоковано після розгортання.

**Підключення через SSH:**
```bash
ssh <user>@127.0.0.1 -p 2222
```

#### Права operator

Користувач `operator` може виконувати через `sudo` тільки:
```bash
sudo systemctl start task_tracker.service
sudo systemctl stop task_tracker.service
sudo systemctl restart task_tracker.service
sudo systemctl status task_tracker.service
sudo systemctl reload nginx.service
```

### Запуск автоматизації розгортання

1. Встановити [Vagrant](https://developer.hashicorp.com/vagrant/install) та [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

2. Виконати наступні дії
```bash
# Клонувати репозиторій
git clone <url-репозиторію>
cd lab1

# Створити config.yaml з потрібними параметрами
cp config.example.yaml config.yaml

# Розгорнути ВМ (автоматично виконає усі скрипти)
vagrant up
```

Vagrant автоматично виконує 7 скриптів з `vm_scripts/` у порядку:

1. **1_install_dependencies.sh** — встановлення Node.js 24, PostgreSQL, Nginx
2. **2_setup_users.sh** — створення користувачів (student, teacher, operator, app), блокування vagrant
3. **3_create_db.sh** — створення бази даних та ролі mywebapp у PostgreSQL
4. **4_copy_config.sh** — копіювання коду в `/home/app/`, конфігурації в `/etc/mywebapp/config.yaml`
5. **5_systemmd_setup.sh** — встановлення systemd unit-файлів, збірка проекту, міграція БД, запуск сервісу
6. **6_setup_nginx.sh** — налаштування Nginx як reverse proxy
7. **7_create_gradebook.sh** — створення файлу `/home/student/gradebook` з числом 13

## Тестування розгорнутої системи

Після розгортання перевірити коректність роботи системи:

### 1. Перевірка health-ендпоінтів (з ВМ)

```bash
# Сервіс живий
curl http://127.0.0.1:8000/health/alive
# Очікувано: OK

# БД підключена
curl http://127.0.0.1:8000/health/ready
# Очікувано: OK
```

### 2. Перевірка бізнес-логіки через Nginx (з хоста або ВМ)

```bash
# Кореневий ендпоінт (HTML зі списком маршрутів)
curl http://localhost/

# Список задач (JSON)
curl -H "Accept: application/json" http://localhost/tasks

# Список задач (HTML)
curl -H "Accept: text/html" http://localhost/tasks

# Створення задачі
curl -X POST http://localhost/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task"}'

# Позначити задачу як виконану (id=1)
curl -X POST http://localhost/tasks/1/done

# Перевірити оновлений список
curl -H "Accept: application/json" http://localhost/tasks
```

### 3. Перевірка обмеження доступу через Nginx

```bash
# Health-ендпоінти мають бути недоступні ззовні
curl http://localhost/health/alive
# Очікувано: 403 Forbidden
```

### 4. Перевірка systemd

```bash
# Статус сервісу
sudo systemctl status task_tracker.socket
sudo systemctl status task_tracker.service

# Перевірка логів
journalctl -u task_tracker.service 
```

### 5. Перевірка користувачів та прав

```bash
# Вхід під operator
ssh operator@<ip>
# Пароль: 12345678 (потрібно змінити)

# Перевірка дозволених команд
sudo systemctl status task_tracker.service   # має працювати
sudo systemctl reload nginx.service          # має працювати
sudo apt update                              # має бути заборонено

# Перевірка що vagrant заблоковано
ssh vagrant@<ip>   # має бути відмовлено
```

### 6. Перевірка gradebook

```bash
cat /home/student/gradebook
# Очікувано: 13
```
