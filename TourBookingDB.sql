CREATE DATABASE TourBookingDB;
GO

USE TourBookingDB;
GO

-- bang user (nguoi dung)
CREATE TABLE Users (
    user_id INT IDENTITY PRIMARY KEY,
    username NVARCHAR(100) NOT NULL UNIQUE,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) CHECK (role IN ('USER', 'CREATOR', 'ADMIN')),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

-- bang locations (dia diem - dung cho gg map)
CREATE TABLE Locations (
    location_id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(255),
    address NVARCHAR(255),
    latitude FLOAT,
    longitude FLOAT
);

-- bang TOUR
CREATE TABLE Tours (
    tour_id INT IDENTITY PRIMARY KEY,
    creator_id INT,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    location_id INT,
    price DECIMAL(12,2),
    start_date DATETIME,
    end_date DATETIME,
    max_people INT,
    available_slots INT,
    status NVARCHAR(20) CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (creator_id) REFERENCES Users(user_id),
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

-- bang image TOUR
CREATE TABLE TourImages (
    image_id INT IDENTITY PRIMARY KEY,
    tour_id INT,
    image_url NVARCHAR(500),
    FOREIGN KEY (tour_id) REFERENCES Tours(tour_id)
);

-- bang BOOKING (Dat Tour)
CREATE TABLE Bookings (
    booking_id INT IDENTITY PRIMARY KEY,
    user_id INT,
    tour_id INT,
    number_of_people INT,
    contact_email NVARCHAR(150),
    contact_phone NVARCHAR(20),
    status NVARCHAR(20) CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELED')),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (tour_id) REFERENCES Tours(tour_id)
);

-- bang Payments (thanh toan) 
CREATE TABLE Payments (
    payment_id INT IDENTITY PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(12,2),
    payment_method NVARCHAR(50), -- VNPay / Stripe
    status NVARCHAR(20) CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    transaction_code NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
);

-- Reviews (danh gia) danh gia tour (comment cua user) 
CREATE TABLE Reviews (
    review_id INT IDENTITY PRIMARY KEY,
    user_id INT,
    tour_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (tour_id) REFERENCES Tours(tour_id)
);

-- TOUR APPROVAL (Admin duyet)
CREATE TABLE TourApprovals (
    approval_id INT IDENTITY PRIMARY KEY,
    tour_id INT,
    admin_id INT,
    status NVARCHAR(20) CHECK (status IN ('APPROVED', 'REJECTED')),
    note NVARCHAR(255),
    approved_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (tour_id) REFERENCES Tours(tour_id),
    FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

-- DASHBOARD (optional - log thong ke)
CREATE TABLE SystemLogs (
    log_id INT IDENTITY PRIMARY KEY,
    action NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);
go 
-- data user 
INSERT INTO Users (username, email, password_hash, role)
VALUES 
('user1', 'user1@gmail.com', 'hash1', 'USER'),
('creator1', 'creator1@gmail.com', 'hash2', 'CREATOR'),
('admin1', 'admin@gmail.com', 'hash3', 'ADMIN');


-- data locations 
INSERT INTO Locations (name, address, latitude, longitude)
VALUES 
(N'Đà Nẵng', N'Đà Nẵng, Việt Nam', 16.0544, 108.2022),
(N'Phú Quốc', N'Kiên Giang, Việt Nam', 10.2899, 103.9840);

-- data TOURS
INSERT INTO Tours 
(creator_id, title, description, location_id, price, start_date, end_date, max_people, available_slots, status)
VALUES
(2, N'Tour Đà Nẵng 3 ngày 2 đêm', N'Du lịch biển', 1, 3000000, '2026-05-01', '2026-05-03', 20, 20, 'APPROVED'),
(2, N'Tour Phú Quốc 4 ngày 3 đêm', N'Khám phá đảo', 2, 5000000, '2026-06-10', '2026-06-13', 15, 15, 'PENDING');

-- data images 
INSERT INTO TourImages (tour_id, image_url)
VALUES 
(1, 'danang1.jpg'),
(1, 'danang2.jpg'),
(2, 'phuquoc1.jpg');


-- data BOOKINGS
INSERT INTO Bookings 
(user_id, tour_id, number_of_people, contact_email, contact_phone, status)
VALUES
(1, 1, 2, 'user1@gmail.com', '0123456789', 'CONFIRMED');

-- data Payments 
INSERT INTO Payments 
(booking_id, amount, payment_method, status)
VALUES
(1, 6000000, 'VNPay', 'SUCCESS');

-- data Reviews
INSERT INTO Reviews 
(user_id, tour_id, rating, comment)
VALUES
(1, 1, 5, N'Tour rất tuyệt vời!');


-- data Phe duyet Admin 
INSERT INTO TourApprovals (tour_id, admin_id, status, note)
VALUES
(1, 3, 'APPROVED', N'Duyệt OK'),
(2, 3, 'REJECTED', N'Chưa đủ thông tin');
--
go 
-- INDEX (tim kiem nhanh hon)
CREATE INDEX idx_tour_search 
ON Tours(title, price, start_date);

CREATE INDEX idx_booking_user 
ON Bookings(user_id);

CREATE INDEX idx_review_tour 
ON Reviews(tour_id);

-- TRIGGER QUAN TRỌNG (Giảm slot khi đặt tour) 
CREATE TRIGGER trg_UpdateSlots_AfterBooking
ON Bookings
AFTER INSERT
AS
BEGIN
    UPDATE Tours
    SET available_slots = available_slots - i.number_of_people
    FROM Tours t
    JOIN inserted i ON t.tour_id = i.tour_id;
END;

-- TRIGGER HỦY TOUR (Trả lại slot)
CREATE TRIGGER trg_ReturnSlots_WhenCancel
ON Bookings
AFTER UPDATE
AS
BEGIN
    IF UPDATE(status)
    BEGIN
        UPDATE Tours
        SET available_slots = available_slots + i.number_of_people
        FROM Tours t
        JOIN inserted i ON t.tour_id = i.tour_id
        JOIN deleted d ON i.booking_id = d.booking_id
        WHERE i.status = 'CANCELED';
    END
END;

SELECT * FROM Tours;

SELECT * FROM Users;

DELETE FROM django_migrations;

USE TourBookingDB;
IF OBJECT_ID('django_migrations', 'U') IS NOT NULL 
    DROP TABLE django_migrations;

	USE TourBookingDB;
ALTER TABLE Users ADD 
    last_login DATETIME NULL,
    is_superuser BIT DEFAULT 0,
    is_staff BIT DEFAULT 1, 
    date_joined DATETIME DEFAULT GETDATE(),
    first_name NVARCHAR(150) NULL,
    last_name NVARCHAR(150) NULL;
GO
-- Cấp quyền tối cao cho admin1 để bạn có thể đăng nhập
UPDATE Users SET is_superuser = 1, is_staff = 1 WHERE username = 'admin1';

USE TourBookingDB;
GO

-- 1. Xóa các ràng buộc cũ đang trỏ sai bảng
ALTER TABLE django_admin_log DROP CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id;
GO

-- 2. Thiết lập lại khóa ngoại trỏ vào bảng Users mới của bạn
-- Lưu ý: Kiểm tra tên cột khóa chính của bảng Users (là user_id hay id)
ALTER TABLE django_admin_log 
ADD CONSTRAINT django_admin_log_user_id_fk_Users_user_id 
FOREIGN KEY (user_id) REFERENCES Users(user_id);
GO
SELECT user_id, username FROM Users WHERE username = 'admin1';