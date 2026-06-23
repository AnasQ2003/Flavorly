-- ============================================================
--  Flavorly — SQL Server Database Setup Script
--  Run this in SSMS or sqlcmd against your SQL Server instance
-- ============================================================

USE master;
GO

-- ── Create database if it doesn't exist ──────────────────────
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FlavorlyDB')
BEGIN
    CREATE DATABASE FlavorlyDB;
    PRINT '✅ FlavorlyDB created.';
END
GO

USE FlavorlyDB;
GO

-- ============================================================
--  TABLE: Users
-- ============================================================
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        name          NVARCHAR(100)   NOT NULL,
        handle        NVARCHAR(50)    NOT NULL UNIQUE,
        email         NVARCHAR(255)   NOT NULL UNIQUE,
        password_hash NVARCHAR(255)   NOT NULL,   -- bcrypt hash
        avatar        NVARCHAR(10)    NOT NULL DEFAULT 'JT',
        bio           NVARCHAR(500)   NULL,
        location      NVARCHAR(100)   NULL DEFAULT 'Kitchen',
        premium       BIT             NOT NULL DEFAULT 1,
        created_at    DATETIME2       NOT NULL DEFAULT GETDATE(),
        updated_at    DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table Users created.';
END
GO

-- ============================================================
--  TABLE: Favorites
-- ============================================================
IF OBJECT_ID('dbo.Favorites', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Favorites (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        user_id       INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        recipe_id     NVARCHAR(100)   NOT NULL,
        created_at    DATETIME2       NOT NULL DEFAULT GETDATE(),
        CONSTRAINT UQ_User_Recipe UNIQUE (user_id, recipe_id)
    );
    PRINT '✅ Table Favorites created.';
END
GO

-- ============================================================
--  TABLE: MealPlans
-- ============================================================
IF OBJECT_ID('dbo.MealPlans', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MealPlans (
        id            NVARCHAR(50)    PRIMARY KEY,   -- e.g. 'm1', 'm2'
        user_id       INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        date_offset   INT             NOT NULL,      -- 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
        slot          INT             NOT NULL,      -- 0=Breakfast, 1=Lunch, 2=Snack, 3=Dinner
        recipe_id     NVARCHAR(100)   NOT NULL,
        servings      INT             NOT NULL DEFAULT 2,
        calories      INT             NULL,
        title         NVARCHAR(255)   NULL,          -- custom meal fallback
        chef          NVARCHAR(255)   NULL,
        image         NVARCHAR(255)   NULL,
        time          NVARCHAR(50)    NULL,
        created_at    DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table MealPlans created.';
END
GO

-- ============================================================
--  TABLE: ShoppingList
-- ============================================================
IF OBJECT_ID('dbo.ShoppingList', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ShoppingList (
        id            NVARCHAR(50)    PRIMARY KEY,
        user_id       INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        name          NVARCHAR(255)   NOT NULL,
        qty           NVARCHAR(100)   NOT NULL,
        price         DECIMAL(18,2)   NOT NULL DEFAULT 0.00,
        aisle         NVARCHAR(50)    NOT NULL,      -- Produce | Protein | Dairy | Pantry | Bakery | Wine
        done          BIT             NOT NULL DEFAULT 0,
        note          NVARCHAR(500)   NULL,
        created_at    DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table ShoppingList created.';
END
GO

-- ============================================================
--  TABLE: Notifications
-- ============================================================
IF OBJECT_ID('dbo.Notifications', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Notifications (
        id            NVARCHAR(50)    PRIMARY KEY,
        user_id       INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        type          NVARCHAR(50)    NOT NULL,      -- social | recipe | system | plan
        title         NVARCHAR(255)   NOT NULL,
        body          NVARCHAR(500)   NOT NULL,
        [to]          NVARCHAR(255)   NULL,
        time_label    NVARCHAR(50)    NOT NULL,      -- '2m', '1h', '3d'
        is_read       BIT             NOT NULL DEFAULT 0,
        created_at    DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table Notifications created.';
END
GO

-- ============================================================
--  SEED: First user — Anas (email: anas@example.com, password: anas123)
--  Bcrypt hash of 'anas123' (10 rounds):
--    $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE email = 'anas@example.com')
BEGIN
    INSERT INTO dbo.Users
        (name, handle, email, password_hash, avatar, bio, location, premium)
    VALUES
        (
            'Anas',
            'anas',
            'anas@example.com',
            '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi',
            'AN',
            'Self-taught home chef · obsessed with slow cooking, sharp knives, and Mediterranean sun.',
            'Lahore, PK',
            1
        );
    PRINT '✅ Seed user Anas inserted (email: anas@example.com, password: anas123).';
END
GO

-- ============================================================
--  SEED: Default favorites for Anas
-- ============================================================
DECLARE @anasId INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Favorites WHERE user_id = @anasId)
BEGIN
    INSERT INTO dbo.Favorites (user_id, recipe_id) VALUES
    (@anasId, 'wagyu-chimichurri'),
    (@anasId, 'leek-bisque'),
    (@anasId, 'truffle-pasta'),
    (@anasId, 'burrata-salad'),
    (@anasId, 'lava-cake'),
    (@anasId, 'bruschetta');
    PRINT '✅ Seed favorites for Anas inserted.';
END
GO

-- ============================================================
--  SEED: Default meal plans for Anas
-- ============================================================
DECLARE @anasId2 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.MealPlans WHERE user_id = @anasId2)
BEGIN
    -- We'll seed the Wed plans (date_offset = 2) which match the mock UI setup:
    -- Breakfast (slot 0): recipe[0] = wagyu-chimichurri
    -- Lunch (slot 1): recipe[1] = leek-bisque
    -- Snack (slot 2): Custom (honey-pistachio-yogurt)
    -- Dinner (slot 3): recipe[2] = truffle-pasta
    INSERT INTO dbo.MealPlans (id, user_id, date_offset, slot, recipe_id, servings, calories, title, chef, image, time) VALUES
    ('m1', @anasId2, 2, 0, 'wagyu-chimichurri', 2, 450, NULL, NULL, NULL, NULL),
    ('m2', @anasId2, 2, 1, 'leek-bisque', 4, 280, NULL, NULL, NULL, NULL),
    ('m3', @anasId2, 2, 2, 'snack-yogurt', 1, 180, 'Honey Pistachio Yogurt', 'Cultivate Kitchen', '/src/assets/recipe-dessert.jpg', '5 min'),
    ('m4', @anasId2, 2, 3, 'truffle-pasta', 2, 520, NULL, NULL, NULL, NULL);
    PRINT '✅ Seed meal plans for Anas inserted.';
END
GO

-- ============================================================
--  SEED: Default shopping items for Anas
-- ============================================================
DECLARE @anasId3 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.ShoppingList WHERE user_id = @anasId3)
BEGIN
    INSERT INTO dbo.ShoppingList (id, user_id, name, qty, price, aisle, done, note) VALUES
    ('s1',  @anasId3, 'Heirloom Tomatoes', '4 large', 6.4,  'Produce', 0, 'Ripe, not soft.'),
    ('s2',  @anasId3, 'Fresh Basil',       '1 bunch', 2.5,  'Produce', 0, NULL),
    ('s3',  @anasId3, 'Lemons',            '3',       1.8,  'Produce', 1, NULL),
    ('s4',  @anasId3, 'Wagyu Ribeye',      '400g',    38.0, 'Protein', 0, 'Ask for A5 grade.'),
    ('s5',  @anasId3, 'Atlantic Salmon',   '300g',    14.5, 'Protein', 0, NULL),
    ('s6',  @anasId3, 'Burrata',           '2 balls', 8.0,  'Dairy',   1, NULL),
    ('s7',  @anasId3, 'Aged Parmesan',     '200g',    12.0, 'Dairy',   0, '24-month minimum.'),
    ('s8',  @anasId3, 'Olive Oil (EVOO)',  '1 bottle',18.0, 'Pantry',  0, NULL),
    ('s9',  @anasId3, 'Black Truffle',     '20g',     32.0, 'Pantry',  1, NULL),
    ('s10', @anasId3, 'Sourdough Loaf',    '1',       7.5,  'Bakery',  0, NULL),
    ('s11', @anasId3, 'Malbec Reserve',    '1 bottle',24.0, 'Wine',    0, 'Pairs with wagyu.');
    PRINT '✅ Seed shopping list for Anas inserted.';
END
GO

-- ============================================================
--  SEED: Default notifications for Anas
-- ============================================================
DECLARE @anasId4 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Notifications WHERE user_id = @anasId4)
BEGIN
    INSERT INTO dbo.Notifications (id, user_id, type, title, body, [to], time_label, is_read) VALUES
    ('n1', @anasId4, 'social', 'Sofia loved your bruschetta', '“Best I''ve ever had — added extra basil!”', '/recipe/bruschetta', '2m', 0),
    ('n2', @anasId4, 'recipe', 'Marco Bellini posted a new recipe', 'Pan-Seared Wagyu with Chimichurri — 35 min · Intermediate', '/recipe/wagyu-chimichurri', '1h', 0),
    ('n3', @anasId4, 'social', 'Anika replied to your comment', '“Add a pinch of saffron — game changer.”', '/blog/broth-bones', '3h', 1),
    ('n4', @anasId4, 'plan',   'Tomorrow''s meal plan is ready', 'Shakshuka · Truffle Linguine · Crema Catalana', '/mealplan', '5h', 0),
    ('n5', @anasId4, 'plan',   '4 items still on your list', 'Heirloom tomatoes, sourdough, EVOO & parmesan', '/shopping', '8h', 1),
    ('n6', @anasId4, 'system', 'Achievement unlocked: Pasta Pro', '5 pasta recipes cooked this month 🍝 +120 XP', '/profile', '1d', 1),
    ('n7', @anasId4, 'social', '12 cooks saved your risotto', 'Trending #3 in Mediterranean this week.', '/profile', '2d', 1),
    ('n8', @anasId4, 'recipe', 'New regional pack: Southeast Asia', '42 new recipes ready to explore.', '/region/east-asian', '3d', 1);
    PRINT '✅ Seed notifications for Anas inserted.';
END
GO

-- ============================================================
--  VERIFY
-- ============================================================
SELECT 'Users'         AS [Table], COUNT(*) AS [Rows] FROM dbo.Users         UNION ALL
SELECT 'Favorites',                 COUNT(*)            FROM dbo.Favorites     UNION ALL
SELECT 'MealPlans',                 COUNT(*)            FROM dbo.MealPlans     UNION ALL
SELECT 'ShoppingList',              COUNT(*)            FROM dbo.ShoppingList  UNION ALL
SELECT 'Notifications',             COUNT(*)            FROM dbo.Notifications;
GO

PRINT '🎉 FlavorlyDB setup complete!';
GO
