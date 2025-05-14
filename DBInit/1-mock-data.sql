-- Insert roles
INSERT INTO public."Roles" ("Id", "Name", "AccessLevel")
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin', 0),
       ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Editor', 19),
       ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'User', 20);

-- Insert users
INSERT INTO public."Users" ("Id", "Username", "Email", "PasswordHash", "RoleId")
VALUES
-- Пароль: Fungi123!
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'admin_user', 'admin@mushroomproject.com',
 '$2a$11$zA5O21EK4ncH2AOyaY/aoOnN8OXUIhz5m5tVGuhhTybxeTjLiohoq', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'editor_user', 'editor@mushroomproject.com',
 '$2a$11$zA5O21EK4ncH2AOyaY/aoOnN8OXUIhz5m5tVGuhhTybxeTjLiohoq', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'regular_user', 'user@mushroomproject.com',
 '$2a$11$zA5O21EK4ncH2AOyaY/aoOnN8OXUIhz5m5tVGuhhTybxeTjLiohoq', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

-- Insert mushrooms
INSERT INTO public."Mushrooms" ("Id", "Name", "SynonymousName", "LatinName", "Family", "RedBook", "Eatable", "HasStem",
                                "StemSizeFrom", "StemSizeTo", "StemType", "StemColor", "CapType", "CapColor",
                                "CapUndersideType", "Description", "HeaderPhotoLink", "ExtraPhotoLinks")
VALUES ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Белый гриб', 'Боровик', 'Boletus edulis', 'Болетовые', false,
        'Съедобный', true, 8, 25, 'цилиндрический', 'беловатый', 'выпуклый', 'коричневый', 'трубчатый',
        'Белый гриб - один из самых ценных съедобных грибов.', 'https://i.imgur.com/white_mushroom.jpg',
        'https://i.imgur.com/white_mushroom1.jpg;https://i.imgur.com/white_mushroom2.jpg'),
       ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Мухомор красный', NULL, 'Amanita muscaria', 'Аманитовые', false,
        'Несъедобный', true, 10, 20, 'цилиндрический', 'белый', 'полушаровидный', 'красный', 'пластинчатый',
        'Яркий гриб с красной шляпкой и белыми хлопьями.', 'https://i.imgur.com/fly_agaric.jpg',
        'https://i.imgur.com/fly_agaric1.jpg'),
       ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Бледная поганка', NULL, 'Amanita phalloides', 'Аманитовые', true,
        'Несъедобный', true, 8, 15, 'цилиндрический', 'белый', 'колокольчатый', 'зеленоватый', 'пластинчатый',
        'Один из самых ядовитых грибов.', 'https://i.imgur.com/death_cap.jpg', NULL);

-- Insert doppelgangers
INSERT INTO public."Doppelgangers" ("Id", "MushroomId", "DoppelgangerName")
VALUES ('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Желчный гриб'),
       ('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Сатанинский гриб'),
       ('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Шампиньон');

-- Insert articles
INSERT INTO public."Articles" ("Id", "Title", "PublishDate", "AuthorString", "HeaderPhotoLink", "ExtraPhotoLinks")
VALUES ('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'Как отличить съедобные грибы от ядовитых', '2023-08-15 10:00:00+03',
        'Иван Петров', 'https://i.imgur.com/safety.jpg',
        'https://i.imgur.com/safety1.jpg;https://i.imgur.com/safety2.jpg'),
       ('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'Топ-5 самых опасных грибов России', '2023-09-01 14:30:00+03',
        'Мария Сидорова', 'https://i.imgur.com/dangerous.jpg', NULL);

-- Insert paragraphs
INSERT INTO public."Paragraphs" ("Id", "ArticleId", "ParagraphText", "SerialNumber", "IsSubtitle")
VALUES ('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'Основные правила безопасности',
        0, true),
       ('4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
        'Никогда не собирайте грибы, в которых вы не уверены.', 1, false),
       ('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '1. Бледная поганка', 0, true);

-- Insert article likes (теперь без указания Id, так как он serial)
INSERT INTO public."ArticleLikes" ("ArticleId", "UserId", "LikeDate") VALUES
-- Лайки для статьи "Как отличить съедобные грибы от ядовитых"
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2023-08-15 10:15:00+03'), -- админ
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2023-08-15 11:30:00+03'), -- редактор
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2023-08-16 09:45:00+03'), -- пользователь

-- Лайки для статьи "Топ-5 самых опасных грибов России"
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2023-09-01 15:00:00+03'), -- админ
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2023-09-02 12:20:00+03'); -- пользователь

-- Insert mushroom likes (также без указания Id)
INSERT INTO public."MushroomLikes" ("MushroomId", "UserId", "LikeDate") VALUES
-- Лайки для Белого гриба
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2023-08-10 08:00:00+03'), -- админ
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2023-08-10 09:15:00+03'), -- редактор
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2023-08-11 10:30:00+03'), -- пользователь

-- Лайки для Мухомора красного
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2023-08-12 11:45:00+03'), -- редактор
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2023-08-13 12:00:00+03'), -- пользователь

-- Лайки для Бледной поганки
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2023-08-14 13:15:00+03'); -- админ