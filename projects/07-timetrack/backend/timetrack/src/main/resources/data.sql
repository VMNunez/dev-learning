INSERT INTO users (id, email, password, name, role, active)
VALUES (nextval('users_seq'),
        'manager@timetrack.com',
        '$2a$10$0Q59WhP76BarGkra8uDyfOV/J9meIXU5AXsx5JDMflgqFlorwxvfS',
        'Admin Manager',
        'MANAGER',
        true)
ON CONFLICT (email) DO NOTHING;